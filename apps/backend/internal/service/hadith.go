package service

import (
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/ilmuna/backend/internal/domain"
)

type HadithService struct {
	books []domain.HadithBookSummary
}

type hadithListItem struct {
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	Total int    `json:"total"`
}

func NewHadithService(dataDir string) (*HadithService, error) {
	path := filepath.Join(dataDir, "hadist", "list.json")
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var items []hadithListItem
	if err := json.Unmarshal(raw, &items); err != nil {
		return nil, err
	}

	books := make([]domain.HadithBookSummary, 0, len(items))
	for _, item := range items {
		books = append(books, domain.HadithBookSummary{
			Slug:       item.Slug,
			Name:       normalizeHadithName(item.Name),
			Narrator:   narratorForBook(item.Name),
			TotalItems: item.Total,
		})
	}

	return &HadithService{books: books}, nil
}

func (s *HadithService) Books() []domain.HadithBookSummary {
	return append([]domain.HadithBookSummary(nil), s.books...)
}

func normalizeHadithName(name string) string {
	switch name {
	case "Bukhari":
		return "Shahih Bukhari"
	case "Muslim":
		return "Shahih Muslim"
	case "Abu Dawud":
		return "Sunan Abu Dawud"
	case "Tirmidzi":
		return "Sunan Tirmidzi"
	default:
		return name
	}
}

func narratorForBook(name string) string {
	switch name {
	case "Abu Dawud":
		return "Imam Abu Dawud"
	case "Ahmad":
		return "Imam Ahmad"
	case "Bukhari":
		return "Imam Bukhari"
	case "Darimi":
		return "Imam Darimi"
	case "Ibnu Majah":
		return "Imam Ibnu Majah"
	case "Malik":
		return "Imam Malik"
	case "Muslim":
		return "Imam Muslim"
	case "Nasai":
		return "Imam An-Nasai"
	case "Tirmidzi":
		return "Imam Tirmidzi"
	default:
		return name
	}
}
