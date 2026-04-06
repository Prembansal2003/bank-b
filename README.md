# Trusted Bank Management System — Backend

A RESTful API server built with **Node.js**, **Express**, and **MongoDB** that powers the Trusted Bank Management System. It handles authentication, user and customer management, transactions, branch/currency/branding configuration, and file uploads, with Redis-backed caching for high-read endpoints.

---
<img width="1904" height="827" alt="Screenshot 2026-04-06 195025" src="https://github.com/user-attachments/assets/521142a7-5b9f-4882-a704-7cd4dd11d48c" />

<img width="1888" height="882" alt="Screenshot 2026-04-06 195040" src="https://github.com/user-attachments/assets/3ec8c469-b3a9-40ef-910d-1466f69d9467" />

<img width="1894" height="868" alt="Screenshot 2026-04-06 195144" src="https://github.com/user-attachments/assets/f49b1294-27cf-4fc9-97e8-88c5ff9ae8da" />

<img width="1890" height="878" alt="Screenshot 2026-04-06 194857" src="https://github.com/user-attachments/assets/b538f3b0-fca7-4014-aa3e-1b811b64f81b" />

<img width="1888" height="853" alt="Screenshot 2026-04-06 194946" src="https://github.com/user-attachments/assets/890e8c6c-6de8-4a01-817a-23b037e4b46a" />

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [Demo Credentials](#demo-credentials)
- [API Reference](#api-reference)
- [Authentication & Authorization](#authentication--authorization)
- [Data Models](#data-models)
- [Caching Strategy](#caching-strategy)
- [File Uploads](#file-uploads)
- [Email Service](#email-service)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | MongoDB via Mongoose 8 |
| Cache | Redis via ioredis |
| Auth | JWT (jsonwebtoken) |
| Password hashing | bcrypt |
| File storage | Cloudinary + Multer |
| Email | SendGrid (`@sendgrid/mail`) |
| Rate limiting | express-rate-limit |
| Dev tooling | nodemon |

---

## Project Structure

```
bank-b-master/
├── app.js                  # Express app setup, route mounting, error handler
├── bin/
│   └── www                 # HTTP server entry point
├── controller/
│   ├── controller.js       # Generic CRUD + pagination, filtering, transaction summary
│   ├── email.controller.js # SendGrid email dispatch
│   ├── login.controller.js # Login with JWT issuance
│   └── upload.controller.js# Cloudinary upload handler
├── middlewares/
│   ├── midddleware.js      # verifyToken, isAdmin, isAdminEmployee, isAdminEmployeeCustomer
│   └── validate.js         # Joi/custom request-body validators
├── model/
│   ├── branch.model.js
│   ├── branding.model.js
│   ├── currency.model.js
│   ├── customer.model.js
│   ├── transaction.model.js
│   └── users.model.js
├── routes/
│   ├── branch.routes.js
│   ├── branding.routes.js
│   ├── currency.routes.js
│   ├── customer.routes.js
│   ├── email.routes.js
│   ├── findByAccount.routes.js
│   ├── login.routes.js
│   ├── transaction.routes.js
│   ├── upload.routes.js
│   ├── users.routes.js
│   └── verify.routes.js
├── services/
│   ├── db.service.js       # Mongoose CRUD helpers
│   ├── redis.service.js    # getCache / setCache / deleteCache
│   ├── token.services.js   # JWT verify helper
│   └── upload.service.js   # Cloudinary config & upload logic
├── public/
│   └── bankimages/         # Static assets
├── .env                    # Environment config (see below)
└── package.json
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB** instance (local or Atlas)
- **Redis** instance (local or Redis Cloud)
- **Cloudinary** account (for file/image uploads)
- **SendGrid** account (for transactional emails)

---

## Environment Variables

Create a `.env` file in the project root and fill in all values:

```env
# MongoDB connection string
DB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# Admin seed user (used on first run if applicable)
ADMIN_USER=admin@example.com

# Secret used to sign and verify JWTs — keep this long and random
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary credentials (from Cloudinary Dashboard)
CLOUD_NAME=your_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# SendGrid API key
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx

# Redis connection string e.g. redis://localhost:6379 or redis://:<password>@host:port
REDIS_URL=redis://localhost:6379

# Comma-separated list of allowed CORS origins (currently set to * in app.js)
ALLOWED_ORIGINS=http://localhost:5173

# Port the server listens on (defaults to 3000 if omitted)
PORT=3000
```

> **Security note:** Never commit `.env` to version control. The `.gitignore` already excludes it.

---

## Installation

```bash
# Clone / extract the repository
cd bank-b-master

# Install dependencies
npm install
```

---

## Running the Server

```bash
# Production
npm start

# Development (auto-reload with nodemon)
npm run dev
```

The server starts on `http://localhost:<PORT>` (default `3000`).

---

## Demo Credentials

Use the following admin account to log in and explore the system:

| Field | Value |
|---|---|
| **Email** | `trusted2003@gmail.com` |
| **Password** | `Prem@2003` |
| **Role** | `admin` |

Send a POST request to `/api/login` with the above credentials to receive a JWT token:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "trusted2003@gmail.com", "password": "Prem@2003"}'
```

Use the returned token as a Bearer header on all subsequent protected requests:

```bash
Authorization: Bearer <your_jwt_token>
```

---

## API Reference

All routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/login` | Public | Login with email + password; returns JWT |
| GET | `/api/verify-token` | Bearer token | Validate a JWT and return decoded payload |

### Users (Staff / Employees)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List all users |
| POST | `/api/users` | Admin, Employee | Create a new user (employee) |
| PUT | `/api/users/:id` | Admin, Employee | Update user record |
| DELETE | `/api/users/:id` | Admin, Employee | Delete a user |

### Customers

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/customers` | Admin, Employee | List all customers |
| POST | `/api/customers` | Admin, Employee | Create a new customer account |
| PUT | `/api/customers/:id` | Admin, Employee | Update customer details |
| DELETE | `/api/customers/:id` | Admin only | Delete a customer |
| GET | `/api/find-by-account` | Admin, Employee | Look up a customer by account number |

### Transactions

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/transaction` | Admin, Employee | Paginated transaction list |
| GET | `/api/transaction/pagination` | All roles | Paginated transactions (role-filtered) |
| GET | `/api/transaction/summary` | All roles | Credit/debit summary per account or branch |
| POST | `/api/transaction` | Admin, Employee | Record a new credit or debit transaction |
| POST | `/api/transaction/filter` | All roles | Filter transactions by date, type, account, branch |
| PUT | `/api/transaction/:id` | Admin, Employee | Update a transaction record |
| DELETE | `/api/transaction/:id` | Admin only | Delete a transaction |

### Branch

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/branch` | Authenticated | List all branches |
| POST | `/api/branch` | Admin | Create a branch |
| PUT | `/api/branch/:id` | Admin | Update a branch |
| DELETE | `/api/branch/:id` | Admin | Delete a branch |

### Currency

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/currency` | Authenticated | List all currencies |
| POST | `/api/currency` | Admin | Create a currency |
| PUT | `/api/currency/:id` | Admin | Update a currency |
| DELETE | `/api/currency/:id` | Admin | Delete a currency |

### Branding

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/branding` | Authenticated | Get bank branding settings |
| POST | `/api/branding` | Admin | Create branding record |
| PUT | `/api/branding/:id` | Admin | Update branding |
| DELETE | `/api/branding/:id` | Admin | Delete branding record |

### File Upload

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/upload?folderName=<folder>` | Authenticated | Upload a file to Cloudinary; returns secure URL |

### Email

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/email` | Authenticated | Send a transactional email via SendGrid |

---

## Authentication & Authorization

JWT-based auth is enforced via three middleware guards defined in `middlewares/midddleware.js`:

- **`verifyToken`** — validates the Bearer token on every protected route.
- **`isAdmin`** — restricts the route to users with `userType === "admin"`.
- **`isAdminEmployee`** — allows `admin` and `employee` roles.
- **`isAdminEmployeeCustomer`** — allows all authenticated roles.

Tokens are issued on login and contain the user's ID, email, and `userType`. The JWT secret is set via `JWT_SECRET` in `.env`.

---

## Data Models

### User
Fields: `fullName`, `mobile`, `email` (unique), `password` (bcrypt-hashed on save), `profile`, `address`, `branch`, `userType` (`admin | employee | customer`), `isActive`.

### Customer
Fields: `accountNo`, `fullName`, `mobile`, `email` (unique), `password`, `fatherName`, `dob`, `gender`, `currency`, `profile`, `signature`, `document`, `finalBalance`, `address`, `branch`, `userType`, `createdBy`, `customerLoginId`, `isActive`.

### Transaction
Fields: `transactionType` (`cr | dr`), `transactionAmount`, `category` (`salary | deposit | withdrawal | transfer | loan | fee | other`), `notes`, `refrence`, `currentBalance`, `accountNo`, `branch`, `customerId`.

### Branch
Fields: `branchName` (unique), `key`, `branchAddress`.

### Currency
Fields: `currencyName` (unique), `key`, `currencyDesc`.

### Branding
Fields: `bankName`, `bankTagline`, `bankLogo`, `bankAccountNo`, `bankTransactionId`, `bankAddress`, `bankLinkedIn`, `bankTwitter`, `bankFacebook`, `bankDesc`.

All models include Mongoose `timestamps` (`createdAt`, `updatedAt`).

---

## Caching Strategy

Redis is used to cache read-heavy, slowly changing data. TTLs are defined in `controller.js`:

| Data | TTL |
|---|---|
| Branch list | 5 minutes |
| Currency list | 5 minutes |
| Branding | 10 minutes |
| Transaction summary | 60 seconds |

Cache is **automatically invalidated** on any create, update, or delete operation for that resource. The MongoDB connection pool is configured with `maxPoolSize: 20` and `minPoolSize: 5` for production throughput.

---

## File Uploads

Files are uploaded to **Cloudinary** via the `POST /api/upload` endpoint. The `folderName` query parameter determines the Cloudinary folder (e.g., `profiles`, `signatures`, `documents`). Multer handles the `multipart/form-data` parsing before the file is streamed to Cloudinary.

The endpoint returns a `{ secure_url, public_id }` object which should be stored in the relevant customer or user record.

---

## Email Service

Transactional emails are sent via **SendGrid**. The `POST /api/email` endpoint accepts `to`, `subject`, and `html` body fields. The `SENDGRID_API_KEY` environment variable must be set for emails to dispatch successfully.
