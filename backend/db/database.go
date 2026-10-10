package db

import (
	"fmt"
	"path/filepath"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"product-catalog-backend/models"
)

var DB *gorm.DB

func InitDatabase() (*gorm.DB, error) {
	dbPath := filepath.Join(".", "catalog.db")

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to sqlite database: %w", err)
	}

	if err := db.AutoMigrate(&models.Product{}); err != nil {
		return nil, fmt.Errorf("failed to migrate product schema: %w", err)
	}

	DB = db
	return DB, nil
}
