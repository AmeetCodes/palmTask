import { Server, Socket } from "socket.io";
import { saveMessage } from "../service/chat.service";

export const registerChatSocket = (io: Server, socket: Socket) => {
  const { userId, name } = socket.data.user;

  socket.join(userId);

  socket.broadcast.emit("user_joined", { userId, name });

  socket.on("send_message", async (data) => {
    try {
      const { receiverId, message } = data;

      if (!receiverId || !message) {
        return socket.emit("error", { message: "receiverId and message are required" });
      }

      const savedMessage = await saveMessage(userId, receiverId, message);

      io.to(receiverId).emit("receive_message", savedMessage);
      socket.emit("message_sent", savedMessage);
    } catch {
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("typing_start", ({ receiverId }: { receiverId: string }) => {
    io.to(receiverId).emit("user_typing", { userId, name, isTyping: true });
  });

  socket.on("typing_stop", ({ receiverId }: { receiverId: string }) => {
    io.to(receiverId).emit("user_typing", { userId, name, isTyping: false });
  });

  socket.on("disconnect", () => {});
};