package main

import (
	"log"

	"github.com/ilmuna/backend/internal/app"
)

func main() {
	application, err := app.New()
	if err != nil {
		log.Fatalf("failed to initialize app: %v", err)
	}

	if err := application.Run(); err != nil {
		log.Fatalf("server stopped with error: %v", err)
	}

}
