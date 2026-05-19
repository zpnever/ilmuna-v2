package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/ilmuna/backend/internal/config"
	"github.com/ilmuna/backend/internal/platform/postgres"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required to run migrations")
	}

	db, err := postgres.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("failed to unwrap sql db: %v", err)
	}
	defer sqlDB.Close()

	if _, err := sqlDB.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version BIGINT PRIMARY KEY,
			dirty BOOLEAN NOT NULL DEFAULT FALSE
		)
	`); err != nil {
		log.Fatalf("failed to ensure schema_migrations table: %v", err)
	}

	migrationsDir := filepath.Join("migrations")
	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		log.Fatalf("failed to read migrations dir: %v", err)
	}

	files := make([]string, 0, len(entries))
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".up.sql") {
			continue
		}

		files = append(files, filepath.Join(migrationsDir, entry.Name()))
	}

	sort.Strings(files)

	for _, file := range files {
		version := filepath.Base(file)
		versionNumber, err := parseVersionNumber(version)
		if err != nil {
			log.Fatalf("failed to parse migration version %s: %v", version, err)
		}

		var exists bool
		if err := sqlDB.QueryRow(`SELECT EXISTS (SELECT 1 FROM schema_migrations WHERE version = $1)`, versionNumber).Scan(&exists); err != nil {
			log.Fatalf("failed to check migration status %s: %v", version, err)
		}

		if exists {
			log.Printf("skipped migration: %s", version)
			continue
		}

		if version == "000001_init.up.sql" {
			var usersTableExists bool
			if err := sqlDB.QueryRow(`
				SELECT EXISTS (
					SELECT 1
					FROM information_schema.tables
					WHERE table_schema = 'public' AND table_name = 'users'
				)
			`).Scan(&usersTableExists); err != nil {
				log.Fatalf("failed to inspect baseline schema: %v", err)
			}

			if usersTableExists {
				if _, err := sqlDB.Exec(`INSERT INTO schema_migrations (version, dirty) VALUES ($1, FALSE)`, versionNumber); err != nil {
					log.Fatalf("failed to mark baseline migration as applied: %v", err)
				}
				log.Printf("marked existing baseline migration as applied: %s", version)
				continue
			}
		}

		sqlBytes, err := os.ReadFile(file)
		if err != nil {
			log.Fatalf("failed to read migration %s: %v", file, err)
		}

		tx, err := sqlDB.Begin()
		if err != nil {
			log.Fatalf("failed to start transaction for %s: %v", version, err)
		}

		if _, err := tx.Exec(string(sqlBytes)); err != nil {
			_ = tx.Rollback()
			log.Fatalf("failed to execute migration %s: %v", file, err)
		}

		if _, err := tx.Exec(`INSERT INTO schema_migrations (version, dirty) VALUES ($1, FALSE)`, versionNumber); err != nil {
			_ = tx.Rollback()
			log.Fatalf("failed to record migration %s: %v", version, err)
		}

		if err := tx.Commit(); err != nil {
			log.Fatalf("failed to commit migration %s: %v", version, err)
		}

		log.Printf("applied migration: %s", version)
	}

	fmt.Println("database migrations completed")
}

func parseVersionNumber(filename string) (int64, error) {
	parts := strings.SplitN(filename, "_", 2)
	if len(parts) == 0 || parts[0] == "" {
		return 0, fmt.Errorf("invalid migration filename")
	}

	return strconv.ParseInt(parts[0], 10, 64)
}
