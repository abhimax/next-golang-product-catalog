package models

// Product represents an item in the product catalog.
type Product struct {
	ID          uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string  `gorm:"not null;index" json:"name"`
	Description string  `gorm:"type:text" json:"description"`
	Price       float64 `gorm:"type:real;not null" json:"price"`
	Stock       int     `gorm:"not null;default:0" json:"stock"`
	ImageURL    string  `gorm:"column:image_url;type:text" json:"image_url"`
}

func (Product) TableName() string {
	return "products"
}
