package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv                string
	Port                  string
	AppURL                string
	APIBaseURL            string
	DatabaseURL           string
	JWTAccessSecret       string
	JWTRefreshSecret      string
	AccessTokenTTLMinutes int
	RefreshTokenTTLDays   int
	CORSOrigin            string
	DataDir               string
}

func Load() (Config, error) {
	loadEnv()

	cfg := Config{
		AppEnv:                getEnv("APP_ENV", "development"),
		Port:                  getEnv("PORT", "8080"),
		AppURL:                getEnv("APP_URL", "http://localhost:8080"),
		APIBaseURL:            getEnv("API_BASE_URL", "http://localhost:8080/api/v1"),
		DatabaseURL:           os.Getenv("DATABASE_URL"),
		JWTAccessSecret:       getEnv("JWT_ACCESS_SECRET", "ilmuna-access-secret-development"),
		JWTRefreshSecret:      getEnv("JWT_REFRESH_SECRET", "ilmuna-refresh-secret-development"),
		AccessTokenTTLMinutes: getEnvInt("ACCESS_TOKEN_TTL_MINUTES", 60),
		RefreshTokenTTLDays:   getEnvInt("REFRESH_TOKEN_TTL_DAYS", 30),
		CORSOrigin:            getEnv("CORS_ORIGIN", "http://localhost:5173"),
		DataDir:               getEnv("DATA_DIR", filepath.Join("data")),
	}

	if cfg.AccessTokenTTLMinutes <= 0 {
		return Config{}, fmt.Errorf("ACCESS_TOKEN_TTL_MINUTES must be greater than zero")
	}

	if cfg.RefreshTokenTTLDays <= 0 {
		return Config{}, fmt.Errorf("REFRESH_TOKEN_TTL_DAYS must be greater than zero")
	}

	return cfg, nil
}

func loadEnv() {
	_ = godotenv.Load()
	_ = godotenv.Load(filepath.Join("apps", "backend", ".env"))
}

func getEnv(key string, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}

	return fallback
}

func getEnvInt(key string, fallback int) int {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}

	return parsed
}
