package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"product-catalog-backend/db"
	"product-catalog-backend/models"
)

func setupTestRouter(t *testing.T) *gin.Engine {
	t.Helper()

	previousDB := db.DB
	t.Cleanup(func() { db.DB = previousDB })

	database, err := gorm.Open(sqlite.Open(t.TempDir()+"/catalog-test.db"), &gorm.Config{})
	if err != nil {
		t.Fatalf("open test database: %v", err)
	}
	if err := database.AutoMigrate(&models.Product{}); err != nil {
		t.Fatalf("migrate test database: %v", err)
	}
	db.DB = database

	gin.SetMode(gin.TestMode)
	return newRouter()
}

func performRequest(router http.Handler, method, path string, body any) *httptest.ResponseRecorder {
	var requestBody bytes.Buffer
	if body != nil {
		if err := json.NewEncoder(&requestBody).Encode(body); err != nil {
			panic(err)
		}
	}

	request := httptest.NewRequest(method, path, &requestBody)
	if body != nil {
		request.Header.Set("Content-Type", "application/json")
	}
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	return response
}

func TestProductRoutesCRUD(t *testing.T) {
	router := setupTestRouter(t)

	listResponse := performRequest(router, http.MethodGet, "/api/products", nil)
	if listResponse.Code != http.StatusOK || listResponse.Body.String() != "[]" {
		t.Fatalf("GET /api/products = %d %s, want 200 []", listResponse.Code, listResponse.Body.String())
	}

	createdResponse := performRequest(router, http.MethodPost, "/api/products", models.Product{
		Name:        "Desk Lamp",
		Description: "Adjustable LED lamp",
		Price:       39.99,
		Stock:       12,
		ImageURL:    "https://example.com/lamp.png",
	})
	if createdResponse.Code != http.StatusCreated {
		t.Fatalf("POST /api/products = %d %s, want 201", createdResponse.Code, createdResponse.Body.String())
	}

	var created models.Product
	if err := json.Unmarshal(createdResponse.Body.Bytes(), &created); err != nil {
		t.Fatalf("decode created product: %v", err)
	}
	if created.ID == 0 || created.Name != "Desk Lamp" {
		t.Fatalf("created product = %+v, want generated ID and name Desk Lamp", created)
	}

	getResponse := performRequest(router, http.MethodGet, "/api/products/"+strconv.FormatUint(uint64(created.ID), 10), nil)
	if getResponse.Code != http.StatusOK {
		t.Fatalf("GET product = %d %s, want 200", getResponse.Code, getResponse.Body.String())
	}

	updatedResponse := performRequest(router, http.MethodPut, "/api/products/"+strconv.FormatUint(uint64(created.ID), 10), models.Product{
		Name:        "Desk Lamp Pro",
		Description: "Dimmable adjustable LED lamp",
		Price:       49.99,
		Stock:       8,
	})
	if updatedResponse.Code != http.StatusOK {
		t.Fatalf("PUT product = %d %s, want 200", updatedResponse.Code, updatedResponse.Body.String())
	}
	var updated models.Product
	if err := json.Unmarshal(updatedResponse.Body.Bytes(), &updated); err != nil {
		t.Fatalf("decode updated product: %v", err)
	}
	if updated.ID != created.ID || updated.Name != "Desk Lamp Pro" || updated.Price != 49.99 {
		t.Fatalf("updated product = %+v, want updated name and price", updated)
	}

	deleteResponse := performRequest(router, http.MethodDelete, "/api/products/"+strconv.FormatUint(uint64(created.ID), 10), nil)
	if deleteResponse.Code != http.StatusNoContent {
		t.Fatalf("DELETE product = %d %s, want 204", deleteResponse.Code, deleteResponse.Body.String())
	}

	missingResponse := performRequest(router, http.MethodGet, "/api/products/"+strconv.FormatUint(uint64(created.ID), 10), nil)
	if missingResponse.Code != http.StatusNotFound {
		t.Fatalf("GET deleted product = %d %s, want 404", missingResponse.Code, missingResponse.Body.String())
	}
}

func TestProductRoutesRejectInvalidAndMissingResources(t *testing.T) {
	router := setupTestRouter(t)
	tests := []struct {
		name   string
		method string
		path   string
		body   any
		want   int
	}{
		{name: "invalid ID", method: http.MethodGet, path: "/api/products/not-a-number", want: http.StatusBadRequest},
		{name: "missing product", method: http.MethodGet, path: "/api/products/999", want: http.StatusNotFound},
		{name: "invalid create payload", method: http.MethodPost, path: "/api/products", body: "not a product", want: http.StatusBadRequest},
		{name: "missing update target", method: http.MethodPut, path: "/api/products/999", body: models.Product{Name: "Missing"}, want: http.StatusNotFound},
		{name: "missing delete target", method: http.MethodDelete, path: "/api/products/999", want: http.StatusNotFound},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			response := performRequest(router, test.method, test.path, test.body)
			if response.Code != test.want {
				t.Fatalf("%s %s = %d %s, want %d", test.method, test.path, response.Code, response.Body.String(), test.want)
			}
		})
	}
}