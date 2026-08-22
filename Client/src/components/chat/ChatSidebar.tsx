import React, { useState } from "react";
import type { User } from "../../types/chat";
import { UserManageModal } from "./UserManageModal";
import {
  MessageSquare,
  Search,
  LogOut,
  Shield,
  Users,
  Hash,
  UserPlus,
  Edit2,
  Trash2,
} from "lucide-react";

interface ChatSidebarProps {
  currentUser: User | null;
  users: User[];
  activeUserId: string | null;
  totalUsersCount: number;
  totalChatsCount: number;
  token: string;
  onSelectUser: (user: User) => void;
  onLogout: () => void;
  onRefreshUsers: () => void;
  onUpdateCurrentUser?: (user: User) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  currentUser,
  users,
  activeUserId,
  totalUsersCount,
  totalChatsCount,
  token,
  onSelectUser,
  onLogout,
  onRefreshUsers,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState<{
    mode: "create" | "edit" | "delete" | null;
    targetUser?: User | null;
  }>({ mode: null });

  const isAdmin = currentUser?.role === "admin";

  const contacts = users.filter(
    (u) =>
      u._id !== currentUser?._id &&
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleModalSuccess = () => {
    onRefreshUsers();
    if (modalState.mode === "delete" && modalState.targetUser?._id === currentUser?._id) {
      onLogout();
    }
  };

  return (
    <>
      <aside className="flex h-full w-80 flex-col border-r border-zinc-800/80 bg-zinc-900 shrink-0 text-zinc-300 select-none">
        
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-zinc-100 text-sm tracking-tight">PalmTask Chat</h1>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Sockets
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-zinc-800/60 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2.5 rounded-lg bg-zinc-800/50 border border-zinc-800 px-3 py-2">
            <Users className="h-3.5 w-3.5 text-blue-400" />
            <div className="leading-tight">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">Users</span>
              <span className="text-xs font-bold text-zinc-100">{totalUsersCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg bg-zinc-800/50 border border-zinc-800 px-3 py-2">
            <Hash className="h-3.5 w-3.5 text-zinc-400" />
            <div className="leading-tight">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">Chats</span>
              <span className="text-xs font-bold text-zinc-100">{totalChatsCount}</span>
            </div>
          </div>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contacts..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
            />
          </div>
        </div>

        <div className="px-4 pt-2 pb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Direct Messages
          </span>
          <div className="flex items-center gap-1.5">
            {isAdmin && (
              <button
                onClick={() => setModalState({ mode: "create" })}
                title="Add New User (Admin)"
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded transition"
              >
                <UserPlus className="h-3 w-3" />
                <span>Add</span>
              </button>
            )}
            <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
              {contacts.length}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {contacts.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-500">
              No contacts found
            </div>
          ) : (
            contacts.map((user) => {
              const isActive = user._id === activeUserId;
              const initials = user.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={user._id}
                  className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white font-medium shadow-sm"
                      : "hover:bg-zinc-800/70 text-zinc-300 hover:text-zinc-100"
                  }`}
                >
                  <button
                    onClick={() => onSelectUser(user)}
                    className="flex flex-1 items-center gap-3 min-w-0"
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold text-xs ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-zinc-800 text-zinc-200 border border-zinc-700/50"
                        }`}
                      >
                        {initials}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 bg-emerald-500" />
                    </div>

                    <div className="min-w-0 flex-1 leading-snug">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`truncate text-xs font-semibold ${isActive ? "text-white" : "text-zinc-200"}`}>
                          {user.name}
                        </p>
                        {user.role === "admin" && (
                          <span className={`text-[9px] font-bold px-1 py-0.2 rounded shrink-0 ${isActive ? "bg-white/20 text-white" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                            Admin
                          </span>
                        )}
                      </div>
                      <p className={`truncate text-[11px] ${isActive ? "text-blue-100" : "text-zinc-400"}`}>
                        {user.email}
                      </p>
                    </div>
                  </button>

                  {isAdmin && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalState({ mode: "edit", targetUser: user });
                        }}
                        title="Edit User (Admin)"
                        className={`p-1.5 rounded-md transition ${
                          isActive
                            ? "hover:bg-blue-700 text-white"
                            : "hover:bg-zinc-700 text-zinc-300 hover:text-white"
                        }`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalState({ mode: "delete", targetUser: user });
                        }}
                        title="Delete User (Admin)"
                        className={`p-1.5 rounded-md transition ${
                          isActive
                            ? "hover:bg-rose-700 text-white"
                            : "hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400"
                        }`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {currentUser && (
          <div className="border-t border-zinc-800/80 bg-zinc-950 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-xs text-white">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-zinc-100 flex items-center gap-1">
                    {currentUser.name}
                    {currentUser.role === "admin" && (
                      <Shield className="h-3 w-3 text-amber-400 shrink-0" />
                    )}
                  </p>
                  <p className="truncate text-[10px] text-zinc-400">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {isAdmin && (
                  <button
                    onClick={() => setModalState({ mode: "edit", targetUser: currentUser })}
                    title="Edit Profile"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400 transition"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {modalState.mode && (
        <UserManageModal
          mode={modalState.mode}
          targetUser={modalState.targetUser}
          token={token}
          onClose={() => setModalState({ mode: null })}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  );
};
