import { useEffect, useState, useCallback, useRef } from "react";
import { connectSocket } from "../services/socket.service";
import { api } from "../services/api";
import {
  playSend, playReceive, playUserJoined, playConnected, playTypingStart,
} from "../services/sound.service";
import type { Message, TimelineItem, SystemNotice } from "../types/chat";

const extractId = (field: string | { _id?: string; id?: string } | any): string => {
  if (typeof field === "string") return field;
  return field?._id?.toString() || field?.id?.toString() || "";
};

export interface TypingUser {
  userId: string;
  name: string;
}

export const useChat = (
  token: string | null,
  activeUserId: string | null,
  currentUserId: string | null
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notices, setNotices] = useState<SystemNotice[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  const activeUserIdRef = useRef(activeUserId);
  const currentUserIdRef = useRef(currentUserId);
  const wasConnectedRef = useRef(false);

  useEffect(() => { activeUserIdRef.current = activeUserId; }, [activeUserId]);
  useEffect(() => { currentUserIdRef.current = currentUserId; }, [currentUserId]);

  useEffect(() => {
    setMessages([]);
    setNotices([]);
    setTypingUsers([]);

    if (!token || !activeUserId) return;

    let cancelled = false;
    setIsLoading(true);

    api.getChatHistory(token, activeUserId)
      .then((history) => { if (!cancelled) setMessages(history); })
      .catch((err) => console.error("History fetch failed:", err))
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [token, activeUserId]);

  useEffect(() => {
    if (!token) {
      setIsConnected(false);
      return;
    }

    const socket = connectSocket(token);

    const onConnect = () => {
      setIsConnected(true);
      if (!wasConnectedRef.current) {
        playConnected();
        wasConnectedRef.current = true;
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
      wasConnectedRef.current = false;
    };

    const onReceiveMessage = (msg: Message) => {
      const senderId = extractId(msg.sender);
      const receiverId = extractId(msg.receiver);
      const activeId = activeUserIdRef.current;
      const meId = currentUserIdRef.current;

      const belongsToConversation =
        (senderId === activeId && receiverId === meId) ||
        (senderId === meId && receiverId === activeId);

      if (belongsToConversation) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        setTypingUsers((prev) => prev.filter((u) => u.userId !== senderId));
        if (senderId !== meId) playReceive();
      }
    };

    const onMessageSent = (msg: Message) => {
      const receiverId = extractId(msg.receiver);
      if (receiverId === activeUserIdRef.current) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        playSend();
      }
    };

    const onUserJoined = (data: { name: string; userId: string }) => {
      if (data.userId === currentUserIdRef.current) return;
      const notice: SystemNotice = {
        id: `join-${Date.now()}-${data.userId}`,
        isNotice: true,
        type: "user_joined",
        text: `${data.name || "A user"} joined the chat`,
        timestamp: new Date().toISOString(),
      };
      setNotices((prev) => [...prev, notice]);
      playUserJoined();
    };

    const onUserTyping = (data: { userId: string; name: string; isTyping: boolean }) => {
      if (data.userId !== activeUserIdRef.current) return;

      setTypingUsers((prev) => {
        const exists = prev.some((u) => u.userId === data.userId);
        if (data.isTyping) {
          if (!exists) {
            playTypingStart();
            return [...prev, { userId: data.userId, name: data.name }];
          }
          return prev;
        }
        return prev.filter((u) => u.userId !== data.userId);
      });
    };

    if (socket.connected) setIsConnected(true);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onReceiveMessage);
    socket.on("message_sent", onMessageSent);
    socket.on("user_joined", onUserJoined);
    socket.on("user_typing", onUserTyping);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onReceiveMessage);
      socket.off("message_sent", onMessageSent);
      socket.off("user_joined", onUserJoined);
      socket.off("user_typing", onUserTyping);
    };
  }, [token]);

  const sendMessage = useCallback((text: string) => {
    if (!token || !activeUserId) return;
    connectSocket(token).emit("send_message", { receiverId: activeUserId, message: text });
  }, [token, activeUserId]);

  const emitTypingStart = useCallback(() => {
    if (!token || !activeUserId) return;
    connectSocket(token).emit("typing_start", { receiverId: activeUserId });
  }, [token, activeUserId]);

  const emitTypingStop = useCallback(() => {
    if (!token || !activeUserId) return;
    connectSocket(token).emit("typing_stop", { receiverId: activeUserId });
  }, [token, activeUserId]);

  const items: TimelineItem[] = [
    ...messages.map((m) => ({ ...m, isNotice: false as const })),
    ...notices,
  ].sort((a, b) => {
    const ta = a.isNotice ? a.timestamp : (a as Message).createdAt;
    const tb = b.isNotice ? b.timestamp : (b as Message).createdAt;
    return new Date(ta).getTime() - new Date(tb).getTime();
  });

  return { items, sendMessage, emitTypingStart, emitTypingStop, typingUsers, isConnected, isLoading };
};
