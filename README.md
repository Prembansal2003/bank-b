# 🏦 Trusted Bank — Backend

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

A secure, modular REST API for a banking system built with **Node.js**, **Express**, and **MongoDB**. Handles authentication, role-based access control, customer management, transactions, file uploads, and email notifications.

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Security Model](#-security-model)
- [Data Models](#-data-models)

---

## 🚀 Features

- **JWT Authentication** — Token-based login for Admin, Employee, and Customer roles
- **Role-Based Access Control** — Three middleware guards: `isAdmin`, `isAdminEmployee`, `isAdminEmployeeCustomer`
- **Customer Management** — Create, read, update, delete customer accounts with branch-level scoping
- **Staff Management** — Admin-controlled employee creation and management
- **Transaction Engine** — Credit/Debit entries with running balance, pagination, date filtering, and aggregation summaries
- **File Uploads** — Photo, signature, and document uploads via Multer + Cloudinary
- **Email Notifications** — Automated credential emails on account creation via SendGrid / Nodemailer
- **Bank Configuration** — Branch, currency, and branding management
- **Request Validation** — Dedicated validation middleware for all create endpoints
- **Password Security** — Bcrypt hashing with pre-save hooks on the User model

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js | JavaScript server environment |
| Framework | Express.js v4 | Routing & middleware |
| Database | MongoDB | NoSQL document storage |
| ODM | Mongoose v8 | Schema modeling & validation |
| Auth | jsonwebtoken + bcrypt | Token auth & password hashing |
| File Upload | Multer + Cloudinary v2 | Image & document storage |
| Email | SendGrid / Nodemailer | Transactional emails |
| Config | dotenv | Environment variable management |
| Dev Tool | nodemon | Auto-restart on file changes |

---

## 📂 Project Structure

```
bank-b/
├── app.js                        # Express app setup, routes registration
├── bin/
│   └── www                       # HTTP server entry point
├── controller/
│   ├── controller.js             # Generic CRUD handlers (getData, createData, updateData, deleteData)
│   ├── email.controller.js       # Email sending logic
│   ├── login.controller.js       # Login & JWT generation
│   └── upload.controller.js      # Cloudinary upload handler
├── middlewares/
│   ├── midddleware.js            # verifyToken, isAdmin, isAdminEmployee, isAdminEmployeeCustomer
│   └── validate.js               # Request body validators for each route
├── model/
│   ├── users.model.js            # User schema (Admin / Employee / Customer login)
│   ├── customer.model.js         # Customer profile schema
│   ├── transaction.model.js      # Transaction schema
│   ├── branch.model.js           # Branch schema
│   ├── branding.model.js         # Branding & bank account number schema
│   └── currency.model.js         # Currency schema
├── routes/
│   ├── users.routes.js           # /api/users
│   ├── customer.routes.js        # /api/customers
│   ├── transaction.routes.js     # /api/transaction
│   ├── login.routes.js           # /api/login
│   ├── verify.routes.js          # /api/verify-token
│   ├── upload.routes.js          # /api/upload
│   ├── email.routes.js           # /api/email
│   ├── branch.routes.js          # /api/branch
│   ├── branding.routes.js        # /api/branding
│   ├── currency.routes.js        # /api/currency
│   └── findByAccount.routes.js   # /api/find-by-account
├── services/
│   ├── db.service.js             # MongoDB connection & DB helpers
│   ├── token.services.js         # JWT sign/verify helpers
│   └── upload.service.js         # Cloudinary config & upload logic
├── public/
│   └── bankimages/               # Static assets
└── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- SendGrid account (or SMTP credentials for Nodemailer)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/bank-b.git
cd bank-b

# 2. Install dependencies
npm install

# 3. Create and configure .env (see section below)

# 4. Start development server
npx nodemon

# 5. Start production server
npm start
```

Server runs on **http://localhost:8080** by default.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
DB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/bank

# Admin seed account (created on first boot)
ADMIN_USER=admin@trustedbank.com

# JWT
JWT_SECRET=your_secure_jwt_secret_key

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

# SendGrid (for email notifications)
SENDGRID_API_KEY=your_sendgrid_api_key
```

---

## 📡 API Reference

### 🔑 Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/login` | Login and receive JWT token | ❌ |
| GET | `/api/verify-token` | Validate an existing JWT | ❌ |

---

### 👤 Users (Admin / Employee accounts)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/users` | List all staff | ✅ Admin |
| POST | `/api/users` | Create staff account | ✅ Admin + Employee |
| PUT | `/api/users/:id` | Update staff details | ✅ Admin + Employee |
| DELETE | `/api/users/:id` | Delete staff account | ✅ Admin + Employee |

---

### 🏦 Customers

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/customers` | List all customers | ✅ Admin + Employee |
| POST | `/api/customers` | Create new customer account | ✅ Admin + Employee |
| PUT | `/api/customers/:id` | Update customer details | ✅ Admin + Employee |
| DELETE | `/api/customers/:id` | Delete customer | ✅ Admin only |
| POST | `/api/find-by-account` | Find customer by account number | ✅ Admin + Employee |

---

### 💳 Transactions

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/transaction` | Get all transactions | ✅ All roles |
| POST | `/api/transaction` | Create Credit / Debit entry | ✅ Admin + Employee |
| GET | `/api/transaction/summary` | Aggregated financial summary | ✅ All roles |
| GET | `/api/transaction/pagination` | Paginated transaction list | ✅ All roles |
| POST | `/api/transaction/filter` | Filter by date range / account | ✅ All roles |

---

### ⚙️ Configuration & Utilities

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET/POST/PUT/DELETE | `/api/branch` | Manage bank branches | ❌ |
| GET/POST/PUT/DELETE | `/api/branding` | Manage branding & account number counter | ❌ |
| GET/POST/PUT/DELETE | `/api/currency` | Manage supported currencies | ❌ |
| POST | `/api/upload` | Upload file to Cloudinary (`file` field) | ❌ |
| POST | `/api/email` | Send credential email to customer | ❌ |

---

## 🛡 Security Model

All protected routes run `verifyToken` first, then a role guard:

```
Request → verifyToken → [isAdmin / isAdminEmployee / isAdminEmployeeCustomer] → Controller
```

| Middleware | Allowed Roles |
|---|---|
| `verifyToken` | Validates JWT, attaches `req.user` |
| `isAdmin` | `admin` only |
| `isAdminEmployee` | `admin`, `employee` |
| `isAdminEmployeeCustomer` | `admin`, `employee`, `customer` |

**Validation middleware** (`validate.js`) runs only on POST (create) routes — never on PUT or DELETE to avoid partial-update failures.

---

## 🗂 Data Models

### User (users.model.js)
| Field | Type | Notes |
|---|---|---|
| `fullName` | String | Required |
| `email` | String | Unique, required |
| `password` | String | Bcrypt hashed |
| `mobile` | String | 10 digits |
| `branch` | String | Required |
| `address` | String | Required |
| `userType` | String | `admin` / `employee` / `customer` |
| `isActive` | Boolean | Default: false |

### Customer (customer.model.js)
| Field | Type | Notes |
|---|---|---|
| `accountNo` | String | Auto-assigned |
| `fullName` | String | Required |
| `email` | String | Unique, required |
| `password` | String | Required |
| `mobile` | String | 10 digits |
| `fatherName` | String | Required |
| `dob` | String | Required |
| `gender` | String | `male` / `female` / `other` |
| `currency` | String | `inr` / `usd` |
| `profile` | String | Cloudinary URL |
| `signature` | String | Cloudinary URL |
| `document` | String | Cloudinary URL |
| `finalBalance` | Number | Default: 0 |
| `branch` | String | Required |
| `createdBy` | String | Staff email |
| `customerLoginId` | String | Ref to users._id |
| `isActive` | Boolean | Default: false |

### Transaction (transaction.model.js)
| Field | Type | Notes |
|---|---|---|
| `transactionType` | String | `cr` (credit) / `dr` (debit) |
| `transactionAmount` | Number | Must be positive |
| `accountNo` | String | Required |
| `branch` | String | Required |
| `category` | String | `salary`, `deposit`, `withdrawal`, `transfer`, `loan`, `fee`, `other` |
