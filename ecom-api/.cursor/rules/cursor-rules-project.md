
# Cursor AI Project Rules

## 🧩 Project Overview
This project is a backend system for an e-commerce platform built using:
- TypeScript + Node.js
- Express.js & NestJS
- PostgreSQL as database
- Prisma ORM
- JWT-based Authentication (with Refresh Token Rotation)
- Cerbos for Authorization (to be added later)

All API endpoints are prefixed with `/api`.

---

## 📂 Modules Overview

### 🔐 Auth Module
- POST `/api/auth/register` → User registration
- POST `/api/auth/login` → User login
- GET `/api/auth/me` → Get current user info
- POST `/api/auth/logout` → Logout current session
- POST `/api/auth/logout-all` → Logout all sessions

Authentication is JWT-based. No verification code is required at this stage. There are no roles yet (admin/moderator/user); all users are treated equally for now.

---

### 👤 Users Module
- GET `/api/users` → List all users
- GET `/api/users/:id` → View single user
- PATCH `/api/users/:id` → Update user info

---

### 🏷️ Categories Module
- POST `/api/categories`
- GET `/api/categories`
- GET `/api/categories/:id`
- PATCH `/api/categories/:id`
- DELETE `/api/categories/:id`

Each category includes:
- name
- slug
- order
- createdAt
- updatedAt

---

### 📦 Products Module
- POST `/api/products`
- GET `/api/products`
- GET `/api/products/:id`
- PATCH `/api/products/:id`
- DELETE `/api/products/:id`

Each product includes:
- categoryId
- name
- slug
- short_description
- long_description
- price
- primary_photo_url
- comment_count
- average_rating
- createdAt
- updatedAt

---

### 🖼️ Product Photos Module
- POST `/api/product-photos` → Add photo (auto-assigns order)
- PATCH `/api/product-photos/:id` → Update `is_primary` or order
- DELETE `/api/product-photos/:id` → Remove photo and reassign orders

Rules:
- Only one photo per product can have a given `order`.
- When order is changed or photo is deleted, other photos' orders must be adjusted.
- At least one photo per product must be marked as `is_primary`.

---

### 💬 Product Comments Module
- POST `/api/comments`
- GET `/api/comments?product_id=&rating=`
- GET `/api/comments/:id`
- PATCH `/api/comments/:id`
- DELETE `/api/comments/:id`

Each comment includes:
- userId
- productId
- title (nullable)
- content (nullable, depends on title)
- rating (1 to 5)
- createdAt
- updatedAt

Validation:
- If title is null, content must also be null.
- If content is not null, title must not be null.

---

## 🔧 Code Style Rules
- Use TypeScript best practices.
- Organize modules into feature-based folders.
- Follow NestJS dependency injection and modularization principles.
- Use Prisma schema for model definitions.
- RESTful routes, and descriptive variable/function names.
