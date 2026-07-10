# Waypoint — Full-Stack Todo App

A complete MERN (MongoDB, Express, React, Node) task manager with authentication, full CRUD, filters, and a responsive UI.

## Features

- **Auth**: Register / login with JWT, passwords hashed with bcrypt
- **Tasks**: Create, read, update, delete; toggle complete/pending
- **Categories**: Create colored categories, assign them to tasks, filter tasks by category, and manage them from a dedicated Categories page (linked in the navbar)
- **Filters**: All / Pending / Completed, with live counts
- **Task detail modal**: Click any card to view full details, edit, toggle, or delete
- **Dark / light mode**: Toggle in the navbar, persisted in localStorage, respects system preference on first visit
- **Responsive navbar**: Collapses to a hamburger menu on mobile, full nav links on desktop
- **1340px content container**: Page content is centered with a max width of 1340px and 20px side padding on laptop/desktop
- **Responsive design**: Works from small phones up through desktop
- **Momentum dial**: Visual ring showing daily completion progress

## Project structure

```
todo-app/
  backend/     Express API + MongoDB (Mongoose)
  frontend/    React app (Vite + Tailwind CSS)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local Mongo or MongoDB Atlas) and a strong JWT_SECRET
npm run dev
```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

### API endpoints

| Method | Route                     | Auth | Description                  |
|--------|---------------------------|------|-------------------------------|
| POST   | /api/auth/register        | No   | Create account                |
| POST   | /api/auth/login           | No   | Log in, returns JWT           |
| GET    | /api/auth/me              | Yes  | Get current user              |
| GET    | /api/tasks?status=        | Yes  | List tasks (all/pending/completed) |
| GET    | /api/tasks/:id            | Yes  | Get one task                  |
| POST   | /api/tasks                | Yes  | Create task                   |
| PUT    | /api/tasks/:id            | Yes  | Update task                   |
| PATCH  | /api/tasks/:id/toggle     | Yes  | Toggle completed              |
| DELETE | /api/tasks/:id            | Yes  | Delete task                   |
| GET    | /api/categories           | Yes  | List categories (with task counts) |
| POST   | /api/categories           | Yes  | Create category               |
| PUT    | /api/categories/:id       | Yes  | Update category               |
| DELETE | /api/categories/:id       | Yes  | Delete category (unlinks it from tasks, tasks are kept) |

Authenticated requests need header: `Authorization: Bearer <token>`.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your API isn't on localhost:5000
npm run dev
```

Visit `http://localhost:5173`.

## 3. MongoDB

Use a local MongoDB instance (`mongodb://127.0.0.1:27017/todo-app`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster — just paste its connection string into `backend/.env` as `MONGO_URI`.

## 4. Production build

```bash
cd frontend
npm run build
```

Serve the generated `dist/` folder with any static host (Vercel, Netlify, Nginx, or Express's `express.static`), and deploy the `backend/` folder to a Node host (Render, Railway, Fly.io, etc.) with your environment variables set.

## Notes

- JWTs are stored in `localStorage` on the client; each task is scoped to the logged-in user via the `user` field on the Task model, so users only ever see their own tasks.
- All destructive actions (delete) require confirmation in the UI.
