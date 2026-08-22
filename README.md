# PalmTask

A real-time chat and user management application built with React, Express, Socket.IO, and MongoDB.

## Overview

- **Authentication & Roles**: User registration and login are fully handled via the client interface and backend API (`/api/auth/register` and `/api/auth/login`). All self-registered users are assigned the standard `user` role by default.
- **Admin Access**: User roles (`admin` / `user`) are managed directly within MongoDB. There is no separate code or route for admin registration; administrators sign in through the standard login form. To elevate a user to admin status or seed an admin account, set the user's `role` field to `"admin"` directly in the database.
- **Real-Time Chat**: Authenticated users connect via Socket.IO for real-time messaging, with full user management privileges available to admin users.

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

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run dev server:

```bash
npm run dev
```

---

### 2. Client

```bash
cd Client
npm install
```

Create a `.env` file in the `Client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run dev app:

```bash
npm run dev
```

---

## App URLs

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
