package app

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/ilmuna/backend/internal/config"
	backendhttp "github.com/ilmuna/backend/internal/http"
	"github.com/ilmuna/backend/internal/http/handlers"
	"github.com/ilmuna/backend/internal/service"
	"github.com/ilmuna/backend/internal/store/memory"
)

type App struct {
	config config.Config
	router *gin.Engine
}

func New() (*App, error) {
	cfg, err := config.Load()
	if err != nil {
		return nil, err
	}

	return NewWithConfig(cfg)
}

func NewWithConfig(cfg config.Config) (*App, error) {
	dataDir, err := resolveDataDir(cfg.DataDir)
	if err != nil {
		return nil, err
	}

	seed, err := service.BuildSeedData()
	if err != nil {
		return nil, err
	}

	quranService, err := service.NewQuranService(dataDir)
	if err != nil {
		return nil, fmt.Errorf("load quran data: %w", err)
	}

	hadithService, err := service.NewHadithService(dataDir)
	if err != nil {
		return nil, fmt.Errorf("load hadith data: %w", err)
	}

	store := memory.New(memory.SeedInput{
		Users:           seed.Users,
		Followers:       seed.Followers,
		Following:       seed.Following,
		LandingSnapshot: seed.LandingSnapshot,
		FeedPosts:       seed.FeedPosts,
		Groups:          seed.Groups,
		Notifications:   seed.Notifications,
	})

	tokenService := service.NewTokenService(
		cfg.JWTAccessSecret,
		cfg.JWTRefreshSecret,
		cfg.AccessTokenTTLMinutes,
		cfg.RefreshTokenTTLDays,
	)

	authService := service.NewAuthService(store, store, tokenService)
	contentService := service.NewContentService(store, store, store)
	handler := handlers.New(authService, contentService, quranService, hadithService)
	router := backendhttp.NewRouter(cfg.CORSOrigin, handler, tokenService, authService)

	return &App{
		config: cfg,
		router: router,
	}, nil
}

func (a *App) Run() error {
	server := &http.Server{
		Addr:    ":" + a.config.Port,
		Handler: a.router,
	}

	log.Printf(
		"Ilmuna backend running on %s (env=%s, app=%s, api=%s, data=%s)",
		server.Addr,
		a.config.AppEnv,
		a.config.AppURL,
		a.config.APIBaseURL,
		a.config.DataDir,
	)
	log.Printf("Health check: http://localhost%s/healthz", server.Addr)

	return server.ListenAndServe()
}

func (a *App) Router() *gin.Engine {
	return a.router
}

func resolveDataDir(configured string) (string, error) {
	candidates := []string{configured}

	if !filepath.IsAbs(configured) {
		candidates = append(candidates, filepath.Join("apps", "backend", configured))
		candidates = append(candidates, filepath.Join(".", configured))
	}

	for _, candidate := range candidates {
		if candidate == "" {
			continue
		}

		if _, err := os.Stat(candidate); err == nil {
			return candidate, nil
		}
	}

	return "", fmt.Errorf("unable to resolve data directory from %q", configured)
}
