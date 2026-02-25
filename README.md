# Buyer Management Dashboard

A full‑stack web application for managing buyer data. The backend is built with Node.js, Express, and MySQL (hosted on Aiven), while the frontend is a React (Vite) dashboard. Features include JWT authentication, CSV upload of buyer records, search, pagination, and a clean, responsive UI.

---

## 🚀 Live Demo

- **Frontend:** https://technical-assignment-c5yv.vercel.app/login
- **Backend API:** https://technical-assignment-847k.onrender.com


---

## ✨ Features

- User registration and login (JWT based)
- Protected dashboard route
- Upload CSV files containing buyer data
- List buyers with search (by name, email, or mobile)
- Pagination (5 buyers per page)
- Responsive, modern UI matching the provided design
- Secure SSL connection to Aiven MySQL

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express
- MySQL (Aiven cloud) with SSL
- JSON Web Tokens (JWT) for authentication
- Multer for file uploads
- dotenv for configuration

**Frontend**
- React (Vite)
- React Router DOM
- Axios for API calls
- Plain CSS (no external UI library)

**DevOps / Deployment**
- Render (backend & frontend)
- Aiven for MySQL

### Users Table
Stores registered application users.

| Column        | Type           | Description              |
|--------------|--------------|--------------------------|
| id           | INT (PK)     | Unique user identifier   |
| name         | VARCHAR(100) | User full name           |
| email        | VARCHAR(150) | Unique email             |
| mobile       | VARCHAR(15)  | Unique phone number      |
| password_hash| TEXT         | Encrypted password       |
| created_at   | TIMESTAMP    | Account creation time    |
---
### Buyers Table
| Column         | Type           | Description                         |
|--------------|--------------|-------------------------------------|
| id           | INT (PK)     | Unique buyer identifier             |
| name         | VARCHAR(100) | Buyer name                          |
| email        | VARCHAR(150) | Buyer email                         |
| mobile       | VARCHAR(15)  | Buyer phone number                  |
| address      | TEXT         | Buyer address                       |
| invoice_total| DECIMAL(10,2)| Total invoice amount                |
| amount_paid  | DECIMAL(10,2)| Amount paid by buyer                |
| amount_due   | DECIMAL(10,2)| Remaining amount (calculated)       |
| created_at   | TIMESTAMP    | Record creation time                |
---
### Session Table
| Column        | Type        | Description                          |
|-------------|-----------|--------------------------------------|
| id          | INT (PK)  | Session identifier                   |
| user_id     | INT (FK)  | Linked user                          |
| refresh_token| TEXT     | Stored refresh token                 |
| expires_at  | DATETIME  | Token expiration time                |
| created_at  | TIMESTAMP | Session creation time                |
---
## 📦 Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- MySQL client (optional, for testing)
- Aiven account (or any MySQL host)
- Render account (for deployment)

---
### Create .env
- PORT=5000
- DB_HOST=your_host
- DB_PORT=your_port
- DB_USER=your_user
- DB_PASS=your_password
- DB_NAME=your_db

- JWT_SECRET=your_secret
- JWT_ACCESS_EXPIRE=10m
- JWT_REFRESH_EXPIRE=7d

- CLIENT_URL=http://localhost:5173

---
## 🔧 Local Setup

### 1. Clone the repository

```bash
Important:
Download the CA certificate from your Aiven console and place it at server/certs/ca.pem.
If your local network appends a DNS suffix (e.g., .domain.name), you may need to add an entry in your hosts file to resolve the original hostname correctly. See Troubleshooting below.

Project Structure
Technical-Assignment
│
├── client (React Frontend)
│   ├── src
│   │   ├── api
│   │   ├── context
│   │   ├── pages
│   │   └── styles
│
├── server (Express Backend)
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   ├── utils
│   │   └── config
Setup Instructions
1. Clone Repository
git clone https://github.com/MaheshSriramula033/Technical-Assignment.git
cd Technical-Assignment
Backend Setup
Install dependencies
cd server
npm install

Run server
npm run dev

Server runs on:

http://localhost:5000
Frontend Setup
Install dependencies
cd client
npm install
Create .env
VITE_API_URL=http://localhost:5000/api
Run frontend
npm run dev

Frontend runs on:

http://localhost:5173
