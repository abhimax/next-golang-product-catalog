# Product Catalog Backend

A Go-based backend for the Product Catalog demo application. It uses:

- Go
- Gin HTTP framework
- GORM ORM
- SQLite database via a pure-Go driver (`github.com/glebarez/sqlite`)
- Local seed data for demo products

## Project Structure

```text
backend/
├── go.mod
├── main.go
├── catalog.db              # created automatically when the app starts
├── db/
│   ├── database.go
│   └── seed.go
├── handlers/
│   └── product.go
├── models/
│   └── product.go
└── README.md
```

## Requirements

- Go 1.22 or later

## Setup

From the backend directory:

```bash
cd /Users/abhimanranaweera/my-disk/projects/abhimax/next-golang-product-catalog/backend
go mod tidy
```

## Run the server

```bash
go run .
```

The backend listens on:

```text
http://localhost:8080
```

## API Endpoints

### List all products

```bash
curl http://localhost:8080/api/products
```

### Get product by ID

```bash
curl http://localhost:8080/api/products/1
```

### Create a product

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Standing Desk Converter",
    "description": "A compact desk riser for laptop workstations.",
    "price": 249.99,
    "stock": 15,
    "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
  }'
```

## Database

The app uses SQLite with a local database file named `catalog.db` in the backend folder.

On the first run, the database is auto-migrated and demo products are inserted automatically if the table is empty.

## CORS

CORS is enabled for the frontend origin:

```text
http://localhost:3000
```

## Notes

- This setup is intended for local development/demo purposes.
- The seed data includes example office and productivity products.
- The database persists between runs in the local `catalog.db` file.
