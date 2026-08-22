import React from "react";
import type { Message, User } from "../../types/chat";
import { CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine }) => {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const senderName =
    typeof message.sender === "object"
      ? (message.sender as User).name
      : isMine
      ? "You"
      : "User";

  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"} my-1`}>
      <div
        className={`group relative max-w-[85%] sm:max-w-[70%] md:max-w-[60%] px-4 py-2.5 shadow-sm transition-all ${
          isMine
            ? "rounded-2xl rounded-br-xs bg-blue-600 text-white"
            : "rounded-2xl rounded-bl-xs bg-zinc-800/90 border border-zinc-700/60 text-zinc-100"
        }`}
      >
        {!isMine && (
          <p className="mb-0.5 text-[11px] font-bold text-blue-400">
            {senderName}
          </p>
        )}

        <p className="break-words text-xs sm:text-sm leading-relaxed font-normal">
          {message.message}
        </p>

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] font-medium ${
            isMine ? "text-blue-100/90" : "text-zinc-400"
          }`}
        >
          <span>{formattedTime}</span>
          {isMine && <CheckCheck className="h-3.5 w-3.5 text-blue-200" />}
        </div>
      </div>
    </div>
  );
};
