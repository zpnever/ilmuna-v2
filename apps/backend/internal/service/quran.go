package service

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/ilmuna/backend/internal/domain"
)

type QuranService struct {
	summaries []domain.QuranSurahSummary
	dailyAyah domain.QuranAyahPreview
}

type quranFile struct {
	Data map[string]quranSurah `json:"1"`
}

type quranDataset map[string]quranSurah

type quranSurah struct {
	Number       string `json:"number"`
	Name         string `json:"name"`
	NameLatin    string `json:"name_latin"`
	NumberOfAyah string `json:"number_of_ayah"`
	Translations struct {
		ID struct {
			Text map[string]string `json:"text"`
		} `json:"id"`
	} `json:"translations"`
	Text map[string]string `json:"text"`
}

func NewQuranService(dataDir string) (*QuranService, error) {
	quranDir := filepath.Join(dataDir, "quran")
	entries, err := os.ReadDir(quranDir)
	if err != nil {
		return nil, err
	}

	summaries := make([]domain.QuranSurahSummary, 0, len(entries))
	var dailyAyah domain.QuranAyahPreview

	for _, entry := range entries {
		if entry.IsDir() || filepath.Ext(entry.Name()) != ".json" {
			continue
		}

		fullPath := filepath.Join(quranDir, entry.Name())
		raw, err := os.ReadFile(fullPath)
		if err != nil {
			return nil, err
		}

		var dataset quranDataset
		if err := json.Unmarshal(raw, &dataset); err != nil {
			return nil, err
		}

		for _, surah := range dataset {
			number, _ := strconv.Atoi(surah.Number)
			totalAyahs, _ := strconv.Atoi(surah.NumberOfAyah)

			summaries = append(summaries, domain.QuranSurahSummary{
				Number:     number,
				Slug:       slugify(surah.NameLatin),
				LatinName:  surah.NameLatin,
				ArabicName: surah.Name,
				TotalAyahs: totalAyahs,
				Revelation: revelationForSurah(number),
			})

			if number == 20 {
				dailyAyah = domain.QuranAyahPreview{
					SurahNumber: number,
					SurahName:   surah.NameLatin,
					AyahNumber:  114,
					Arabic:      surah.Text["114"],
					Translation: surah.Translations.ID.Text["114"],
				}
			}
		}
	}

	sort.Slice(summaries, func(i int, j int) bool {
		return summaries[i].Number < summaries[j].Number
	})

	if dailyAyah.SurahNumber == 0 && len(summaries) > 0 {
		first := summaries[0]
		dailyAyah = domain.QuranAyahPreview{
			SurahNumber: first.Number,
			SurahName:   first.LatinName,
			AyahNumber:  1,
			Arabic:      "",
			Translation: "",
		}
	}

	return &QuranService{
		summaries: summaries,
		dailyAyah: dailyAyah,
	}, nil
}

func (s *QuranService) SurahSummaries() []domain.QuranSurahSummary {
	return append([]domain.QuranSurahSummary(nil), s.summaries...)
}

func (s *QuranService) AyahOfTheDay() domain.QuranAyahPreview {
	return s.dailyAyah
}

func revelationForSurah(number int) string {
	madaniyah := map[int]bool{
		2: true, 3: true, 4: true, 5: true, 8: true, 9: true, 22: true, 24: true, 33: true,
		47: true, 48: true, 49: true, 55: true, 57: true, 58: true, 59: true, 60: true,
		61: true, 62: true, 63: true, 64: true, 65: true, 66: true, 76: true, 98: true,
	}

	if madaniyah[number] {
		return "Madaniyah"
	}

	return "Makkiyah"
}

func slugify(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	replacer := strings.NewReplacer(" ", "-", "'", "", ",", "", ".", "", "_", "-")
	value = replacer.Replace(value)
	value = strings.ReplaceAll(value, "--", "-")
	return value
}
