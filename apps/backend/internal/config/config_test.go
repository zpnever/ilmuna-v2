package config

import "testing"

func TestLoadUsesDefaults(t *testing.T) {
	t.Setenv("APP_ENV", "")
	t.Setenv("PORT", "")
	t.Setenv("APP_URL", "")
	t.Setenv("API_BASE_URL", "")
	t.Setenv("DATABASE_URL", "")
	t.Setenv("JWT_ACCESS_SECRET", "")
	t.Setenv("JWT_REFRESH_SECRET", "")
	t.Setenv("ACCESS_TOKEN_TTL_MINUTES", "")
	t.Setenv("REFRESH_TOKEN_TTL_DAYS", "")
	t.Setenv("CORS_ORIGIN", "")
	t.Setenv("DATA_DIR", "")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("expected config to load, got error: %v", err)
	}

	if cfg.Port != "8080" {
		t.Fatalf("expected default port 8080, got %s", cfg.Port)
	}

	if cfg.DataDir != "data" {
		t.Fatalf("expected default data dir, got %s", cfg.DataDir)
	}
}
