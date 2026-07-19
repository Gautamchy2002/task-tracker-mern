# Multi-Tenant Task Tracker

> A Full Stack Multi-Tenant Task Tracker built using **React, TypeScript, Express.js, Prisma ORM, PostgreSQL, Docker, Render and Vercel**.

---

# Live Demo

### Frontend

https://task-tracker-mern-roan.vercel.app/

### Backend

https://task-tracker-backend-rwf9.onrender.com/

### GitHub Repository

https://github.com/Gautamchy2002/task-tracker-mern

---

# Project Overview

This project is a **Multi-Tenant Task Tracker** where multiple organizations (tenants) can manage their own users and tasks while ensuring complete tenant data isolation.

The application provides secure authentication, role-based authorization, task assignment, comments, and tenant-specific data access using JWT authentication and Prisma ORM.

---

# Features

- Multi-Tenant Architecture
- JWT Authentication
- Role-Based Authorization
- Tenant Data Isolation
- Admin / Manager / Member Roles
- Task CRUD Operations
- Task Assignment
- Task Status Management
- Comments on Tasks
- Responsive UI
- Docker Support
- Prisma ORM
- PostgreSQL Database
- Live Deployment

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Axios
- Formik
- Yup
- TanStack Table

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT Authentication
- bcrypt

## Database

- PostgreSQL

## DevOps

- Docker
- Docker Compose
- Render
- Vercel

---

# Folder Structure

```text
task-tracker
│
├── backend
│
├── frontend
│
├── compose.yaml
│
└── README.md
```

---

# Multi-Tenant Architecture

The application uses a **Shared Database + Tenant ID Isolation** approach.

Every authenticated request contains the tenant context through JWT.

All database queries are filtered using the authenticated tenant ID to ensure complete tenant isolation.

A user from one tenant cannot access users, tasks, or comments belonging to another tenant.

The backend architecture is designed so it can be extended later to support:

- Schema per Tenant
- Database per Tenant

---

# User Roles

## Admin

- Register Tenant
- Manage Users
- Create Users
- Update User Roles
- Create Tasks
- Assign Tasks
- Update Any Task
- Delete Any Task
- View All Tasks

---

## Manager

- View Team Members
- Create Tasks
- Assign Tasks
- Update Team Tasks
- Delete Team Tasks
- Add Comments

> Managers can fetch Member users only for task assignment within their own tenant.

---

## Member

- View Assigned Tasks
- Update Assigned Task Status
- Add Comments

---

# Prerequisites

Install the following:

- Git
- Node.js (20+)
- Docker Desktop
- VS Code

Verify installation:

```bash
git --version
node -v
npm -v
docker --version
docker compose version
```

---

# Clone Repository

```bash
git clone https://github.com/Gautamchy2002/task-tracker-mern.git

cd task-tracker
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

DATABASE_URL=postgresql://task_tracker_user:task_tracker_password@localhost:5432/task_tracker_db?schema=public

JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

Backend will start on:

```
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Frontend will start on:

```
http://localhost:5173
```

---

# Docker Setup

Build and start all services

```bash
docker compose up --build
```

Run in background

```bash
docker compose up --build -d
```

Stop containers

```bash
docker compose down
```

View running containers

```bash
docker ps
```

---

# Manual PostgreSQL (Optional)

If Docker is not used:

- Install PostgreSQL
- Create Database

```
task_tracker_db
```

- Create User

```
task_tracker_user
```

- Configure password

Update `.env` with your PostgreSQL connection string.

---

# Prisma Commands

Generate Prisma Client

```bash
npx prisma generate
```

Apply Migrations

```bash
npx prisma migrate deploy
```

Open Prisma Studio

```bash
npx prisma studio
```

---

# Build Project

Backend

```bash
cd backend

npm run build
```

Frontend

```bash
cd frontend

npm run build
```

---

# API Summary

## Authentication

```
POST /api/auth/register
POST /api/auth/login
```

## Users

```
GET    /api/users
POST   /api/users
PUT    /api/users/:id/role
```

## Tasks

```
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

## Comments

```
POST /api/tasks/:id/comments
GET  /api/tasks/:id/comments
```

---

# Environment Variables

## Backend

```env
PORT=5000

DATABASE_URL=<PostgreSQL Connection String>

JWT_SECRET=<Secret Key>
```

## Frontend

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# Sample Credentials

For security reasons, the application does not include seeded users.

To test the application:

1. Register a new tenant.
2. The first registered user becomes the Tenant Admin.
3. Login as Admin.
4. Create Manager and Member users.
5. Login using the created accounts to test role-based functionality.

---

# Assumptions

- First registered user becomes the Tenant Admin.
- Every tenant has isolated users, tasks, and comments.
- Managers can assign tasks only within their own tenant.
- Members can update only tasks assigned to them.
- Authentication is JWT-based.
- Tenant context is resolved from the authenticated JWT token.

---

# Troubleshooting

View Docker logs

```bash
docker compose logs
```

View containers

```bash
docker ps
```

If Prisma has issues

```bash
npx prisma generate

npx prisma migrate deploy
```

---

# Future Improvements

- Swagger / OpenAPI Documentation
- Unit Testing
- Email Notifications
- Activity Logs
- Dashboard Analytics
- File Attachments
- Real-Time Notifications

---

# Author

**Gautam Kumar Choudhary**

- GitHub: https://github.com/Gautamchy2002
- Email: gautamchy2002@gmail.com

---

## Notes

This project was developed as part of the **Goolluck Consulting LLP MERN Stack Technical Assignment**.

The implementation follows a clean architecture using:

- Controller
- Service
- Repository

along with Multi-Tenant Architecture, JWT Authentication, Prisma ORM, Docker support, and a fully deployed production environment.
