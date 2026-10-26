package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"product-catalog-backend/db"
	"product-catalog-backend/handlers"
)

func main() {
	if _, err := db.InitDatabase(); err != nil {
		log.Fatalf("database initialization failed: %v", err)
	}

	if err := db.SeedProducts(); err != nil {
		log.Fatalf("product seeding failed: %v", err)
	}

	if err := newRouter().Run(":8080"); err != nil {
		log.Fatalf("server failed to start: %v", err)
	}
}

func newRouter() *gin.Engine {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.GET("/api/products", handlers.GetProducts)
	router.GET("/api/products/:id", handlers.GetProductByID)
	router.POST("/api/products", handlers.CreateProduct)
	router.PUT("/api/products/:id", handlers.UpdateProduct)
	router.DELETE("/api/products/:id", handlers.DeleteProduct)

	return router
}
