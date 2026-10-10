package db

import (
	"fmt"

	"product-catalog-backend/models"
)

func SeedProducts() error {
	if DB == nil {
		return fmt.Errorf("database is not initialized")
	}

	var count int64
	if err := DB.Model(&models.Product{}).Count(&count).Error; err != nil {
		return fmt.Errorf("failed to count products: %w", err)
	}

	if count > 0 {
		return nil
	}

	products := []models.Product{
		{
			Name:        "Mechanical Keyboard",
			Description: "A premium mechanical keyboard with hot-swappable switches, RGB backlighting, and a compact aluminum frame for focused productivity.",
			Price:       129.99,
			Stock:       24,
			ImageURL:    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
		},
		{
			Name:        "Ultrawide Monitor",
			Description: "A 34-inch ultrawide monitor with crisp 4K clarity, USB-C connectivity, and a sleek stand designed for creative professionals.",
			Price:       599.0,
			Stock:       12,
			ImageURL:    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
		},
		{
			Name:        "Ergonomic Standing Desk",
			Description: "A height-adjustable standing desk with whisper-quiet motor control, cable management, and a breathable desktop finish.",
			Price:       899.0,
			Stock:       8,
			ImageURL:    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
		},
		{
			Name:        "Wireless Mouse",
			Description: "A low-latency wireless mouse with programmable buttons, a smooth matte finish, and all-day comfort for desk setups.",
			Price:       49.99,
			Stock:       35,
			ImageURL:    "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
		},
		{
			Name:        "Noise-Cancelling Headset",
			Description: "A surround-sound headset with active noise cancellation, Bluetooth support, and plush ear cushions built for long work sessions.",
			Price:       179.99,
			Stock:       18,
			ImageURL:    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
		},
	}

	if err := DB.Create(&products).Error; err != nil {
		return fmt.Errorf("failed to seed demo products: %w", err)
	}

	return nil
}
