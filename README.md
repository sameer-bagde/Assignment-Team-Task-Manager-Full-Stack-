# 🚀 Team Task Manager (Full-Stack)

A modern, production-ready Full-Stack Team Task Manager built with **React**, **Node.js**, **Express**, and **Sequelize**. Organize projects, manage tasks via a Kanban board, and track progress with ease.

### 🌐 Live Demo
[Launch Application](https://inspiring-charisma-production-35f8.up.railway.app/signup)

> [!TIP]
> While using the live link, use the secret key **`supersecret`** during signup to register as an **Admin**.

---

## ✨ Features
- **Siloed Team Model**: Strict role-based visibility where Admins and Members only interact within their authorized scope.
- **Kanban Board**: Drag-and-drop task management for seamless workflow tracking.
- **Unified Architecture**: Frontend and Backend bundled as a single monolith for zero-CORS production stability.
- **Modern UI**: Fully responsive, dark-mode ready design with a sticky, translucent header.

---

## 🛠️ Quick Start

### 1. Installation
```bash
git clone https://github.com/sameer-bagde/Assignment-Team-Task-Manager-Full-Stack.git
cd Assignment-Team-Task-Manager-Full-Stack
npm install
```

### 2. Configuration
Create a `server/.env` file with your database credentials:
```env
DATABASE_URL=mysql://user:pass@localhost:3306/db
JWT_SECRET=your_jwt_key
ADMIN_SECRET=supersecret
```

> [!IMPORTANT]
> **Admin Secret Key**: Use `supersecret` during registration to claim the `ADMIN` role.

### 3. Execution
```bash
# Initialize Database
npm run db:reset --prefix server

# Start Development Mode
npm run dev
```

---

## 🏗️ Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Headless UI, Beautiful DnD.
- **Backend**: Node.js, Express, Sequelize (MySQL/PostgreSQL support).
- **Deployment**: Railway (Nixpacks builder).

---

## 📦 Production Command
The application is optimized for **Railway**.
- **Build**: `npm run build`
- **Start**: `npm start`
