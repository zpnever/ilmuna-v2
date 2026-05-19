package service

import (
	"path/filepath"
	"testing"
)

func TestQuranServiceLoadsSummariesAndDailyAyah(t *testing.T) {
	service, err := NewQuranService(filepath.Join("..", "..", "data"))
	if err != nil {
		t.Fatalf("expected quran service to load, got error: %v", err)
	}

	summaries := service.SurahSummaries()
	if len(summaries) != 114 {
		t.Fatalf("expected 114 surah summaries, got %d", len(summaries))
	}

	ayah := service.AyahOfTheDay()
	if ayah.SurahNumber == 0 {
		t.Fatal("expected ayah of the day to be populated")
	}
}
