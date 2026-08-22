import React from "react";
import type { TypingUser } from "../../hooks/useChat";

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const names = typingUsers.map((u) => u.name).join(", ");

  return (
    <div className="flex items-center gap-2 px-3.5 py-2 my-1 text-xs text-zinc-300 bg-zinc-800/90 border border-zinc-700/60 rounded-2xl rounded-bl-xs w-fit shadow-sm">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" />
      </div>
      <span className="font-medium text-[11px] text-zinc-300">
        {names} {typingUsers.length === 1 ? "is" : "are"} typing...
      </span>
    </div>
  );
};
