package main

import (
	"embed"
	"io/fs"
	"log"
)

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
