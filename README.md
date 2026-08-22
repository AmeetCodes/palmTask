# PalmTask

A real-time chat and user management application built with React, Express, Socket.IO, and MongoDB.

## Overview

- **Authentication & Roles**: User registration and login are handled via `/api/auth/register` and `/api/auth/login`. Self-registered users are assigned the standard `user` role by default.
- **Admin Access**: User roles (`admin` / `user`) are stored in MongoDB. To elevate a user to admin status, set the user's `role` field to `"admin"` in MongoDB. Admin users can create, edit, and delete users.
- **Tokens & Expiration**: JWT tokens (`token` and `refreshToken`) expire in **7 days**.
- **Real-Time Chat**: Authenticated users connect via Socket.IO for live 2-way messaging with database persistence.

---

## Project Structure

```text
PalmTask/
├── Client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── AuthModal.tsx
│   │   │   └── chat/
│   │   │       ├── ChatHeader.tsx
│   │   │       ├── ChatSidebar.tsx
│   │   │       ├── MessageBubble.tsx
│   │   │       ├── MessageInput.tsx
│   │   │       ├── MessageList.tsx
│   │   │       ├── TypingIndicator.tsx
│   │   │       ├── UserJoinedNotice.tsx
│   │   │       └── UserManageModal.tsx
│   │   ├── hooks/
│   │   │   └── useChat.ts
│   │   ├── pages/
│   │   │   └── ChatPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── socket.service.ts
│   │   │   └── sound.service.ts
│   │   ├── types/
│   │   │   └── chat.ts
│   │   ├── app.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
├── server/                     # Backend (Node.js + Express + TypeScript + Socket.IO + Mongoose)
│   ├── Src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── controller/
│   │   │   ├── auth.controller.ts
│   │   │   ├── chat.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── role.middleware.ts
│   │   ├── models/
│   │   │   ├── chat.model.ts
│   │   │   └── user.model.ts
│   │   ├── routes/
│   │   │   ├── auth.router.ts
│   │   │   ├── chat.router.ts
│   │   │   └── user.router.ts
│   │   ├── service/
│   │   │   ├── auth.service.ts
│   │   │   ├── chat.service.ts
│   │   │   └── user.service.ts
│   │   ├── socket/
│   │   │   ├── chat.socket.ts
│   │   │   ├── socket.auth.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── cleanup-users.js
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## API Summary

### Public Routes
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user or admin (returns 7-day token)

### Protected User Routes (Requires `Authorization: Bearer <TOKEN>`)
- `GET /api/users/profile` — Verify current user session
- `GET /api/users` — Get all users list
- `GET /api/users/count` — Get total user count
- `GET /api/users/:id` — Get single user by ID
- `GET /api/chat/count` — Get total message count
- `GET /api/chat/history/:userId` — Get 2-way chat history with a specific user

### Admin-Only Routes (Requires `Authorization: Bearer <ADMIN_TOKEN>`)
- `POST /api/users` — Admin create user
- `PUT /api/users/:id` — Admin update user
- `DELETE /api/users/:id` — Admin delete user

---

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (Local or MongoDB Atlas)

---

## Setup & Running

### 1. Server

```bash
cd server
npm install
```

Create `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run server:

```bash
npm run dev
```

---

### 2. Client

```bash
cd Client
npm install
```

Create `.env` file in `Client/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run client:

```bash
npm run dev
```

---

## App URLs

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
