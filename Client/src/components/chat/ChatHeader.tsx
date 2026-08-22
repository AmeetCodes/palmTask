import React from "react";
import type { User } from "../../types/chat";
import { Menu, Shield, Wifi, WifiOff } from "lucide-react";

interface ChatHeaderProps {
  activeUser: User | null;
  isConnected: boolean;
  onToggleSidebar?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  activeUser,
  isConnected,
  onToggleSidebar,
}) => {
  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 select-none">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white transition md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        {activeUser ? (
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-xs bg-blue-600 text-white">
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 ${
                  isConnected ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none mb-1">
                <h2 className="text-sm font-bold text-zinc-100">{activeUser.name}</h2>
                {activeUser.role === "admin" && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">{activeUser.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-400 font-medium">Select a conversation to start messaging</p>
        )}
      </div>

      <div
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
          isConnected
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-amber-500/30 bg-amber-500/10 text-amber-400"
        }`}
      >
        {isConnected ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3 animate-pulse" />
        )}
        <span>{isConnected ? "Connected" : "Connecting..."}</span>
      </div>
    </header>
  );
};
