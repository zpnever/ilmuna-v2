package postgres

import (
	"errors"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(databaseURL string) (*gorm.DB, error) {
	if databaseURL == "" {
		return nil, errors.New("database url is empty")
	}

	return gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
}
