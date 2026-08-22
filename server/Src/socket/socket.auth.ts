import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

export interface SocketUser {
  userId: string;
  role: string;
  name: string;
}

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SocketUser;
    socket.data.user = decoded;
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
};