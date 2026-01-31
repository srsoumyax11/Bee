package server

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"runtime"
	"time"

	"justshare/internal/hub"

	"github.com/gorilla/websocket"
)

type Server struct {
	Hub        *hub.Hub
	Port       string
	Pin        string
	FrontendFS http.FileSystem // Optional embedded frontend filesystem
}

func NewServer(port, pin string) *Server {
	return &Server{
		Hub:  hub.NewHub(),
		Port: port,
		Pin:  pin,
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all for LAN
	},
}

func (s *Server) Start() {
	// Ensure uploads directory exists
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		os.Mkdir("uploads", 0755)
	}

	go s.Hub.Run()

	// Upload Handler
	http.HandleFunc("/upload", s.handleUpload)
	// Serve Uploaded Files
	// Using StripPrefix so /upload/filename.ext maps to uploads/filename.ext
	http.Handle("/upload/", http.StripPrefix("/upload/", http.FileServer(http.Dir("uploads"))))

	// List Files Handler
	http.HandleFunc("/files", s.handleListFiles)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		// Validate PIN
		pin := r.URL.Query().Get("pin")
		name := r.URL.Query().Get("name")
		device := r.URL.Query().Get("device")

		if pin != s.Pin {
			log.Printf("AUTH FAILED: IP=%s Name=%s PIN=%s (Expected: %s)", r.RemoteAddr, name, pin, s.Pin)
			http.Error(w, "Invalid PIN", http.StatusUnauthorized)
			return
		}
		if name == "" {
			http.Error(w, "Name Required", http.StatusBadRequest)
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		// Extract IP address (strip port)
		ip := extractIP(r.RemoteAddr)

		client := &hub.Client{Hub: s.Hub, Conn: conn, Send: make(chan []byte, 256), Name: name, Device: device, IP: ip}
		s.Hub.Register <- client

		// Send current file list to the new client specifically
		files, _ := s.listFiles()
		msg, _ := json.Marshal(map[string]interface{}{
			"type": "files",
			"data": files,
		})
		client.Send <- msg

		// Handle incoming messages
		go func() {
			defer func() {
				s.Hub.Unregister <- client
				conn.Close()
			}()
			for {
				_, _, err := conn.ReadMessage()
				if err != nil {
					break
				}
				// For now, just ignore echo or handle specific logic
			}
		}()

		// Handle outgoing messages
		go func() {
			for message := range client.Send {
				conn.WriteMessage(websocket.TextMessage, message)
			}
		}()
	})

	// Serve Frontend
	// Use embedded files if provided, otherwise serve from disk (development mode)
	if s.FrontendFS != nil {
		// Production: use embedded files
		http.Handle("/", http.FileServer(s.FrontendFS))
	} else {
		// Development: serve from disk
		http.Handle("/", http.FileServer(http.Dir("./frontend/dist")))
	}

	ip := getLocalIP()

	fmt.Println("\n=================================================")
	fmt.Println("   JUST-SHARE: LAN File Sharing")
	fmt.Println("=================================================")
	fmt.Printf(" Server running at: http://%s:%s\n", ip, s.Port)
	fmt.Printf(" Access PIN:        %s\n", s.Pin)
	fmt.Println("-------------------------------------------------")
	fmt.Println(" Share this URL and PIN with others on your Wi-Fi")
	fmt.Println("=================================================")

	// openBrowser(fmt.Sprintf("http://localhost:%s", s.Port))

	// Handle Graceful Shutdown
	stop := make(chan os.Signal, 1)
	// SIGINT for Ctrl+C, SIGTERM for kill command
	// On Windows, syscall.SIGTERM is not supported for os.Notify, so we rely on os.Interrupt (Ctrl+C)
	// or we can read from Stdin for "Enter" to quit.
	// Let's support both.
	signal.Notify(stop, os.Interrupt)

	go func() {
		fmt.Println(" Server is running. Press CTRL+C to stop.")
		if err := http.ListenAndServe(":"+s.Port, nil); err != nil {
			log.Fatal(err)
		}
	}()

	<-stop
	fmt.Println("\nShutting down server...")
	// Cleanup if needed
	os.Exit(0)
}

func getLocalIP() string {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		return "localhost"
	}
	defer conn.Close()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP.String()
}

func extractIP(remoteAddr string) string {
	host, _, err := net.SplitHostPort(remoteAddr)
	if err != nil {
		return remoteAddr // Return as-is if parsing fails
	}
	return host
}

func (s *Server) handleUpload(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == "OPTIONS" {
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Use MultipartReader for true streaming (no full-parse in RAM/Temp)
	reader, err := r.MultipartReader()
	if err != nil {
		http.Error(w, "Invalid multipart request", http.StatusBadRequest)
		return
	}

	// Ensure uploads dir exists
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		os.Mkdir("uploads", 0755)
	}

	// Iterate over parts
	for {
		part, err := reader.NextPart()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("Error reading part: %v", err)
			http.Error(w, "Upload error", http.StatusInternalServerError)
			return
		}

		// Only process the file field
		if part.FormName() == "file" {
			filename := filepath.Base(part.FileName())
			if filename == "" {
				continue
			}

			savePath := filepath.Join("uploads", filename)
			// Ensure unique name
			if _, err := os.Stat(savePath); err == nil {
				filename = fmt.Sprintf("%d_%s", time.Now().Unix(), filename)
				savePath = filepath.Join("uploads", filename)
			}

			dst, err := os.Create(savePath)
			if err != nil {
				log.Printf("Error creating file: %v", err)
				http.Error(w, "Error saving file", http.StatusInternalServerError)
				return
			}

			// Stream directly from Network -> Disk
			// This is "chunk-wise". It reads a small buffer from net, writes to disk.
			// It does NOT load the whole file into RAM.
			size, err := io.Copy(dst, part)
			dst.Close()

			if err != nil {
				log.Printf("Error copying file: %v", err)
				http.Error(w, "Error saving file", http.StatusInternalServerError)
				return
			}

			log.Printf("File received: %s (%d bytes)", filename, size)
		}
	}

	// Broadcast Update
	s.broadcastFileList()

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Upload successful"))
}

func (s *Server) handleListFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	files, err := s.listFiles()
	if err != nil {
		http.Error(w, "Could not list files", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(files)
}

func (s *Server) listFiles() ([]map[string]interface{}, error) {
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		os.Mkdir("uploads", 0755)
		return []map[string]interface{}{}, nil
	}

	entries, err := os.ReadDir("uploads")
	if err != nil {
		return nil, err
	}

	fileList := []map[string]interface{}{}
	for _, e := range entries {
		if !e.IsDir() {
			info, _ := e.Info()
			fileList = append(fileList, map[string]interface{}{
				"name": e.Name(),
				"size": info.Size(),
				"time": info.ModTime(),
			})
		}
	}
	return fileList, nil
}

func (s *Server) broadcastFileList() {
	files, _ := s.listFiles()
	msg, _ := json.Marshal(map[string]interface{}{
		"type": "files",
		"data": files,
	})
	s.Hub.Broadcast <- msg // Hub handles unsafe send now? No, we fixed it.
	// Actually, ensure we use the safe send if we can access Hub methods,
	// or just send to Broadcast channel which Hub.Run consumes.
	// The previous fix ensures Hub.Run uses `sendToAll`.
}

func openBrowser(url string) {
	var err error
	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Printf("Failed to open browser: %v", err)
	}
}
