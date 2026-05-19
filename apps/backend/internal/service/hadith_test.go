package service

import (
	"path/filepath"
	"testing"
)

func TestHadithServiceLoadsBooks(t *testing.T) {
	service, err := NewHadithService(filepath.Join("..", "..", "data"))
	if err != nil {
		t.Fatalf("expected hadith service to load, got error: %v", err)
	}

	books := service.Books()
	if len(books) == 0 {
		t.Fatal("expected hadith books to be loaded")
	}

	if books[0].Slug == "" {
		t.Fatal("expected first hadith book slug to be populated")
	}
}
