package app

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"github.com/ilmuna/backend/internal/config"
)

func TestAppCoreEndpoints(t *testing.T) {
	application, err := NewWithConfig(config.Config{
		AppEnv:                "test",
		Port:                  "8080",
		AppURL:                "http://localhost:8080",
		APIBaseURL:            "http://localhost:8080/api/v1",
		JWTAccessSecret:       "test-access",
		JWTRefreshSecret:      "test-refresh",
		AccessTokenTTLMinutes: 60,
		RefreshTokenTTLDays:   30,
		CORSOrigin:            "http://localhost:5173",
		DataDir:               filepath.Join("..", "..", "data"),
	})
	if err != nil {
		t.Fatalf("expected app to build, got error: %v", err)
	}

	router := application.Router()

	t.Run("landing snapshot", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/public/landing", nil)
		res := httptest.NewRecorder()

		router.ServeHTTP(res, req)

		if res.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d", res.Code)
		}
	})

	t.Run("login and auth me", func(t *testing.T) {
		payload := map[string]string{
			"email":    "ilmuna@gmail.com",
			"password": "10203040",
		}
		body, _ := json.Marshal(payload)

		loginReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewReader(body))
		loginReq.Header.Set("Content-Type", "application/json")
		loginRes := httptest.NewRecorder()
		router.ServeHTTP(loginRes, loginReq)

		if loginRes.Code != http.StatusOK {
			t.Fatalf("expected 200 login, got %d", loginRes.Code)
		}

		var loginPayload struct {
			AccessToken string `json:"accessToken"`
		}
		if err := json.Unmarshal(loginRes.Body.Bytes(), &loginPayload); err != nil {
			t.Fatalf("expected login response to decode, got error: %v", err)
		}

		meReq := httptest.NewRequest(http.MethodGet, "/api/v1/auth/me", nil)
		meReq.Header.Set("Authorization", "Bearer "+loginPayload.AccessToken)
		meRes := httptest.NewRecorder()
		router.ServeHTTP(meRes, meReq)

		if meRes.Code != http.StatusOK {
			t.Fatalf("expected 200 auth/me, got %d", meRes.Code)
		}
	})

	t.Run("quran and hadith endpoints", func(t *testing.T) {
		endpoints := []string{
			"/api/v1/quran/surahs",
			"/api/v1/quran/ayah-of-the-day",
			"/api/v1/hadist/books",
			"/api/v1/groups",
			"/api/v1/users/salsabila.nur",
			"/api/v1/users/salsabila.nur/followers",
			"/api/v1/users/salsabila.nur/following",
			"/api/v1/notifications",
		}

		for _, endpoint := range endpoints {
			req := httptest.NewRequest(http.MethodGet, endpoint, nil)
			res := httptest.NewRecorder()
			router.ServeHTTP(res, req)

			if res.Code != http.StatusOK {
				t.Fatalf("expected 200 for %s, got %d", endpoint, res.Code)
			}
		}
	})
}
