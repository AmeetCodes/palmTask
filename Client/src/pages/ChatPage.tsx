import React, { useState, useEffect, useCallback } from "react";
import { AuthModal } from "../components/auth/AuthModal";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageList } from "../components/chat/MessageList";
import { MessageInput } from "../components/chat/MessageInput";
import { useChat } from "../hooks/useChat";
import { disconnectSocket } from "../services/socket.service";
import { api } from "../services/api";
import type { User } from "../types/chat";

const normalizeUser = (u: any): User | null => {
  if (!u) return null;
  return {
    _id: u._id || u.id || "",
    name: u.name || "",
    email: u.email || "",
    role: u.role || "user",
  };
};

export default function ChatPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return normalizeUser(saved ? JSON.parse(saved) : null);
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalChatsCount, setTotalChatsCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!token) return;
    try {
      const [fetchedUsers, uCount, cCount] = await Promise.all([
        api.getUsers(token),
        api.getUserCount(token),
        api.getChatCount(token),
      ]);
      setUsers(fetchedUsers);
      setTotalUsersCount(uCount);
      setTotalChatsCount(cCount);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }, [token]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  const {
    items,
    sendMessage,
    emitTypingStart,
    emitTypingStop,
    typingUsers,
    isConnected,
    isLoading,
  } = useChat(
    token,
    activeUser ? activeUser._id : null,
    currentUser ? currentUser._id : null
  );

  const handleAuthSuccess = (newToken: string, user: User) => {
    const normalized = normalizeUser(user)!;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(normalized));
    setToken(newToken);
    setCurrentUser(normalized);
    setActiveUser(null);
  };

  const handleLogout = () => {
    disconnectSocket();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentUser(null);
    setActiveUser(null);
    setUsers([]);
  };

  if (!token || !currentUser || !currentUser._id) {
    return <AuthModal onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-blue-600 selection:text-white">
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:static md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <ChatSidebar
          currentUser={currentUser}
          users={users}
          activeUserId={activeUser ? activeUser._id : null}
          totalUsersCount={totalUsersCount}
          totalChatsCount={totalChatsCount}
          token={token}
          onSelectUser={(u) => {
            setActiveUser(u);
            setIsSidebarOpen(false);
          }}
          onLogout={handleLogout}
          onRefreshUsers={loadData}
        />
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-zinc-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      <main className="flex flex-1 flex-col h-full overflow-hidden bg-zinc-950">
        <ChatHeader
          activeUser={activeUser}
          isConnected={isConnected}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <MessageList
          items={items}
          currentUserId={currentUser._id}
          activeUser={activeUser}
          typingUsers={typingUsers}
          isLoading={isLoading}
        />

        <MessageInput
          onSend={(msg) => {
            sendMessage(msg);
            api.getChatCount(token).then((cnt) => setTotalChatsCount(cnt));
          }}
          onTypingStart={emitTypingStart}
          onTypingStop={emitTypingStop}
          disabled={!activeUser || !isConnected}
          activeUserName={activeUser?.name}
        />
      </main>
    </div>
  );
}
