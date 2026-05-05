# Team Task Manager (Full-Stack)

A robust, production-ready Full-Stack Team Task Manager designed to help teams organize projects, assign tasks, and track progress through a dynamic interface. It features a secure Role-Based Access Control (RBAC) system, drag-and-drop task management, and a unified monolith architecture for seamless deployment.

---

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Secure separation between `ADMIN` and `MEMBER` roles.
  - **Admins** can create projects, assign tasks to any global member, and manage the team.
  - **Members** can view projects they are assigned to, update their tasks, and leave comments.
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing.
- **Drag & Drop Task Board**: Interactive Kanban-style board for managing task states.
- **Project & Task Management**: Create detailed projects, assign due dates, and track task progress.
- **Activity & Comments**: Real-time comment system on tasks to keep communication contextualized.
- **PWA Support**: Built-in Progressive Web App capabilities for offline-ready and installable experiences.
- **Unified Monolith Deployment**: Frontend and backend are bundled together to run securely on a single port (perfect for Railway/Heroku/Vercel).

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** (UI Library)
- **Vite** (Next Generation Frontend Tooling)
- **TailwindCSS** (Utility-first styling)
- **React Router v6** (Client-side routing)
- **React Hook Form** (Performant form validation)
- **React Beautiful DnD** (Drag and drop interactions)
- **Headless UI** (Unstyled, fully accessible UI components)

### Backend
- **Node.js & Express.js** (REST API framework)
- **Sequelize ORM** (Promise-based Node.js ORM)
- **MySQL / PostgreSQL** (Relational database support)
- **JSON Web Tokens (JWT)** (Stateless secure authentication)
- **Bcrypt.js** (Password hashing)

---

## 💻 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- A local or cloud SQL Database (MySQL/PostgreSQL)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/sameer-bagde/Assignment-Team-Task-Manager-Full-Stack.git

# Navigate to the project root
cd Assignment-Team-Task-Manager-Full-Stack

# Install all dependencies (Frontend & Backend)
npm install
```

### 2. Environment Variables
Create two `.env` files.

**Backend (`server/.env`):**
```env
PORT=5000
DATABASE_URL=mysql://username:password@localhost:3306/task_manager
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
ADMIN_SECRET=supersecret
```

**Frontend Root (`.env`):**
```env
VITE_API_ENDPOINT=/api
```

### 3. Initialize Database
Before running the application, sync the database tables:
```bash
# From the root directory, run the DB reset script
npm run db:reset --prefix server
```

### 4. Start Development Server
This project is configured to run both the Vite frontend and Express backend concurrently with a single command:
```bash
# Run both client and server in development mode
npm run dev
```
- **Frontend** will be available at: `http://localhost:5173`
- **Backend API** will be available at: `http://localhost:5000/api`

---

## 📡 API Routes Reference

### Authentication & Users (`/api/users`)
| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/api/users` | Register a new user (Member or Admin via key) | Public |
| POST | `/api/users/sign_in` | Authenticate user & get JWT token | Public |
| GET | `/api/users` | List all global members | Admin |
| DELETE | `/api/users/:id` | Delete a specific user | Admin |

### Projects (`/api/projects`)
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/projects` | List projects (all for Admin, assigned for Member) | Authenticated |
| POST | `/api/projects` | Create a new project | Admin |
| GET | `/api/projects/:id` | Get project details | Authenticated |
| PUT | `/api/projects/:id` | Update project details | Admin |
| DELETE | `/api/projects/:id` | Delete a project | Admin |
| POST | `/api/projects/:id/members` | Add user to project | Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove user from project | Admin |

### Tasks (`/api/projects/:id/tasks`)
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/projects/:id/tasks` | Get all tasks for a project | Authenticated |
| POST | `/api/projects/:id/tasks` | Create a new task | Admin |
| GET | `/api/projects/:id/tasks/:tid` | Get task details | Authenticated |
| PUT | `/api/projects/:id/tasks/:tid` | Update task (Title, Status, Assignee, etc) | Authenticated (Members can update status) |
| DELETE | `/api/projects/:id/tasks/:tid` | Delete a task | Admin |

### Comments (`/api/projects/:id/tasks/:tid/comments`)
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `.../comments` | List all comments on a specific task | Authenticated |
| POST | `.../comments` | Add a comment to a task | Authenticated |

### Dashboard (`/api/dashboard`)
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/dashboard` | Fetch high-level statistics for dashboard metrics | Authenticated |

---

## 📦 Production Deployment

This app is structured as a **Unified Monolith** to simplify deployment on platforms like Railway, Heroku, or Render. 

When deployed, `npm run build` compiles the React frontend into static files inside the `/dist` folder. The Express backend then intercepts all non-API traffic and serves the React `/dist/index.html` file, bypassing CORS issues and allowing the application to run entirely on a single domain and port.

### Build Command
```bash
npm run build
```

### Start Command (Production)
```bash
npm start
```
