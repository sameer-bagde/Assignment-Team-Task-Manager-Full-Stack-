# Team Task Manager (Full-Stack)

A premium, modern task management application built with **React, TypeScript, Vite, Node.js, Express, and MySQL**.

## Features

- **Authentication**: JWT-based sign up & login
- **Role-Based Access Control (RBAC)**: `ADMIN` and `MEMBER` roles
  - *Note: The first registered user automatically becomes the `ADMIN`.*
- **Projects & Tasks**: Create projects, add members, and manage tasks with a Kanban-style drag-and-drop board.
- **Dynamic Dashboard**: View personal or team-wide analytics (Total Tasks, Completed, Pending, Overdue).
- **Premium UI**: Modern dark-mode ready design with smooth animations and gradients.
- **PWA Support**: Installable as a Progressive Web App.

## Prerequisites

- Node.js (v18+ recommended)
- MySQL (Make sure it's running locally for development)

## Local Development Setup

1. **Clone the repository** (if you haven't already).

2. **Database Setup**
   Ensure MySQL is running. Create a database named `task_manager` (or update the `.env` file accordingly).

3. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server/` directory based on `server/.env.example`:
   ```env
   PORT=5000
   DATABASE_URL=mysql://root:yourpassword@localhost:3306/task_manager
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   NODE_ENV=development
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

4. **Frontend Setup**
   Open a new terminal in the root directory (`Team Task Manager (Full-Stack)/`):
   ```bash
   npm install
   ```
   The `.env` file in the root should have:
   ```env
   VITE_API_ENDPOINT=http://localhost:5000/api
   ```
   Start the frontend dev server:
   ```bash
   npm run dev
   ```

5. **Access the App**
   Open your browser and navigate to `http://localhost:5173`.
   - Sign up a new user (this first user will be an `ADMIN`).
   - Create a project.
   - Go to Members and add a second user (sign up in an incognito window to create them).
   - Assign tasks and explore!

## Deployment (Railway)

This repository is configured for easy deployment on [Railway](https://railway.app/).

1. Create a new project on Railway.
2. Add a **MySQL** database plugin.
3. Link your GitHub repository.
4. Add the following environment variables to your web service:
   - `DATABASE_URL` (Railway sets this automatically for the MySQL plugin)
   - `JWT_SECRET` (Generate a secure random string)
   - `NODE_ENV=production`
   - `VITE_API_ENDPOINT=/api` (In production, the Node server will serve the API directly)

The provided `railway.json` takes care of building the frontend and starting the Node.js backend.
