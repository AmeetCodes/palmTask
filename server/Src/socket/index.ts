import { Server } from "socket.io";
import { socketAuth } from "./socket.auth";
import { registerChatSocket } from "./chat.socket";

export const initializeSocket = (io: Server) => {
  io.use(socketAuth);
  io.on("connection", (socket) => {
    registerChatSocket(io, socket);
  });
};
