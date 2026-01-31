package main

import (
	"flag"

	"justshare/internal/server"
)

func main() {
	port := flag.String("port", "8080", "Port to run the server on")
	pin := flag.String("pin", "", "6-digit Access PIN (optional, generated if empty)")
	flag.Parse()

	if *pin == "" {
		// rand.Seed(time.Now().UnixNano())
		// *pin = fmt.Sprintf("%06d", rand.Intn(1000000))
		*pin = "111111" // Hardcoded for now
	}

	srv := server.NewServer(*port, *pin)
	srv.Start()
}
