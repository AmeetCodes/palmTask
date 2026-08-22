import React, { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { UserJoinedNotice } from "./UserJoinedNotice";
import { TypingIndicator } from "./TypingIndicator";
import type { TimelineItem, User } from "../../types/chat";
import type { TypingUser } from "../../hooks/useChat";
import { MessageSquare, Sparkles } from "lucide-react";

interface MessageListProps {
  items: TimelineItem[];
  currentUserId: string | null;
  activeUser: User | null;
  typingUsers?: TypingUser[];
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  items,
  currentUserId,
  activeUser,
  typingUsers = [],
  isLoading,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items, typingUsers]);

  if (!activeUser) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center select-none">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/10 border border-blue-600/20 text-blue-400 shadow-sm">
          <MessageSquare className="h-10 w-10 animate-bounce" />
        </div>
        <h3 className="text-lg font-bold text-zinc-100">Welcome to PalmTask Real-Time Chat</h3>
        <p className="mt-2 max-w-sm text-xs text-zinc-400">
          Select a contact from the sidebar to view chat history and start messaging live over Socket.IO.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-xs text-zinc-400">Loading conversation history...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0 && typingUsers.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center select-none">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400">
          <Sparkles className="h-7 w-7 text-blue-400" />
        </div>
        <h3 className="text-sm font-bold text-zinc-100">No messages yet</h3>
        <p className="mt-1 text-xs text-zinc-400">
          Send a message below to start chatting with <span className="text-blue-400 font-semibold">{activeUser.name}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 space-y-2 bg-zinc-950">
      {items.map((item) => {
        if (item.isNotice) {
          return (
            <UserJoinedNotice
              key={item.id}
              text={item.text}
              timestamp={item.timestamp}
            />
          );
        }

        const senderId =
          typeof item.sender === "string"
            ? item.sender
            : item.sender._id || (item.sender as any).id;

        const isMine = senderId === currentUserId;

        return (
          <MessageBubble
            key={item._id}
            message={item}
            isMine={isMine}
          />
        );
      })}

      <TypingIndicator typingUsers={typingUsers} />

      <div ref={bottomRef} />
    </div>
  );
};
