# Web-based Inventory Control System - Category Management Module

This project is a viva-ready Category Management module for a Web-based Inventory Control System. The module is designed for the Admin role and demonstrates category CRUD, product grouping, filtering, validation, MySQL persistence, and a professional dashboard UI.

## Tech Stack

- Frontend: React JavaScript with Vite
- Styling: Tailwind CSS with shadcn/ui style components
- Icons: Lucide React
- API Communication: Axios
- Alerts: SweetAlert2
- Notifications: React Toastify
- Backend: Spring Boot Java
- Database: MySQL

## My Contribution

Category Management module for the Admin user.

## Features

- Add category
- View categories
- Update category
- Delete category with confirmation
- Prevent deleting categories that have products
- View products under category
- Filter products by category
- Search categories and products
- Frontend and backend validation
- MySQL database connection
- Seed data for viva demonstration

## MySQL Setup

Create the database manually or allow Spring Boot to create it automatically:

```sql
CREATE DATABASE inventory_db;
```

Set your MySQL password in:

```text
backend/src/main/resources/application.properties
```

Replace:

```properties
spring.datasource.password=YOUR_PASSWORD_HERE
```

with your real MySQL root password.

## How to Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

## How to Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

If PowerShell blocks `npm` scripts on Windows, use:

```bash
npm.cmd install
npm.cmd run dev
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Return all categories with product count |
| GET | `/api/categories/stats` | Return dashboard summary counts |
| GET | `/api/categories/{id}` | Return one category by ID |
| POST | `/api/categories` | Create a new category |
| PUT | `/api/categories/{id}` | Update category details |
| DELETE | `/api/categories/{id}` | Delete category if no products are assigned |
| GET | `/api/categories/{id}/products` | Return products under selected category |
| GET | `/api/products` | Return all products |
| GET | `/api/products?categoryId={id}` | Return products filtered by category |
| POST | `/api/products/seed` | Demo endpoint showing seed data is automatic |

## Demo Flow for Viva

1. Open the frontend at `http://localhost:5173`.
2. Show dashboard summary cards.
3. Go to Category Management.
4. Click Add Category.
5. Submit with an empty category name to show validation.
6. Try an existing category name such as `Electronics` to show duplicate validation.
7. Add a valid new category.
8. Edit a category and save changes.
9. Delete a category with confirmation.
10. Try deleting a category that has products to show backend protection.
11. Click View Products for a category.
12. Use the category dropdown to filter products by category.

## Viva Explanation

My module helps the admin organize products into categories and filter products easily. It uses a layered architecture where the Controller handles API requests, the Service handles business logic such as duplicate checking and delete protection, the Repository handles database operations, and the Entity classes represent MySQL tables. DTOs are used to transfer clean data between the backend and frontend without directly exposing the full entity structure.
