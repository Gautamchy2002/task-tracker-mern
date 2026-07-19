# Multi-Tenant Task Tracker

> Full Stack Multi-Tenant Task Tracker built using **React + TypeScript + Express + Prisma + PostgreSQL + Docker**.

## Project Overview

This project allows multiple organizations (tenants) to manage their own users and tasks while maintaining complete tenant data isolation.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Axios
- Formik
- Yup
- TanStack Table

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT
- bcrypt

### Database

- PostgreSQL

### DevOps

- Docker & Docker Compose

## Folder Structure

```text
task-tracker
├── backend
├── frontend
├── compose.yaml
└── README.md
```

## Prerequisites

Install:

- Git: https://git-scm.com/downloads
- Node.js (20+): https://nodejs.org
- Docker Desktop: https://www.docker.com/products/docker-desktop
- VS Code: https://code.visualstudio.com

Verify:

```bash
git --version
node -v
npm -v
docker --version
docker compose version
```

These commands verify that Git, Node.js, npm, Docker and Docker Compose are installed.

## Clone Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd task-tracker
```

Downloads the repository and enters the project folder.

## Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
DATABASE_URL=postgresql://task_tracker_user:task_tracker_password@localhost:5432/task_tracker_db
JWT_SECRET=your_secret_key
```

DATABASE_URL format:

- Protocol → postgresql://
- Username → task_tracker_user
- Password → task_tracker_password
- Host → localhost
- Port → 5432
- Database → task_tracker_db

Run backend:

```bash
npm run dev
```

## Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

## Docker

Start:

```bash
docker compose up --build
```

This builds images and starts PostgreSQL, backend and frontend.

Background:

```bash
docker compose up --build -d
```

View running containers:

```bash
docker ps
```

Stop:

```bash
docker compose down
```

## Manual PostgreSQL (Optional)

If Docker is not used:

- Install PostgreSQL
- Create database: task_tracker_db
- Create user: task_tracker_user
- Set password: task_tracker_password

Update DATABASE_URL accordingly.

## Prisma

Generate client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate deploy
```

Open Prisma Studio

```bash
npx prisma studio
```

Usually opens at http://localhost:5555

## Build

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

## Roles

### Admin

- Manage users
- Assign roles
- CRUD tasks

### Manager

- Create and assign tasks
- Manage team tasks

### Member

- View assigned tasks
- Update task status
- Add comments

## API Summary

Authentication:

- POST /api/auth/register
- POST /api/auth/login

Users:

- GET /api/users
- POST /api/users
- PUT /api/users/:id

Tasks:

- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

Comments:

- POST /api/tasks/:id/comments
- GET /api/tasks/:id/comments

## Troubleshooting

Check Docker logs:

```bash
docker compose logs
```

Check containers:

```bash
docker ps
```

If Prisma has issues:

```bash
npx prisma generate
npx prisma migrate deploy
```

## Future Improvements

- Email notifications
- File attachments
- Activity logs
- Dashboard analytics

## Author

**Gautam Kumar Choudhary**
