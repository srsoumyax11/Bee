package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"

	"Bee/internal/server"
)

var version = "dev"

func main() {
	fmt.Printf("Bee version: %s\n", version)
	port := flag.String("port", "1111", "Port to run the server on")
	pin := flag.String("pin", "", "6-digit Access PIN (optional, generated if empty)")
	flag.Parse()

	if *pin == "" {
		// rand.Seed(time.Now().UnixNano())
		// *pin = fmt.Sprintf("%06d", rand.Intn(1000000))
		*pin = "111111" // Hardcoded for now
	}

	srv := server.NewServer(*port, *pin)
	// Set embedded frontend filesystem
	srv.FrontendFS = http.FS(GetFrontendFS())
	srv.Start()
}

//go:embed frontend/dist
var frontendFS embed.FS

// GetFrontendFS returns the embedded frontend filesystem
func GetFrontendFS() fs.FS {
	frontendSubFS, err := fs.Sub(frontendFS, "frontend/dist")
	if err != nil {
		log.Fatal("Failed to load embedded frontend:", err)
	}
	return frontendSubFS
}
