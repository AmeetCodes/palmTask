import React, { useState, FormEvent, KeyboardEvent, useRef, useEffect } from "react";
import { Send, CornerDownLeft } from "lucide-react";

interface MessageInputProps {
  onSend: (message: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  disabled?: boolean;
  activeUserName?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled = false,
  activeUserName,
}) => {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const stopTyping = () => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTypingStop?.();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMessage(val);

    if (disabled) return;

    if (val.trim().length > 0) {
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        onTypingStart?.();
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    } else {
      stopTyping();
    }
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || disabled) return;

    stopTyping();
    onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, []);

  return (
    <div className="border-t border-zinc-800 bg-zinc-900 p-3.5 shrink-0 select-none">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl items-end gap-2.5">
        <div className="relative flex-1">
          <textarea
            value={message}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            placeholder={
              disabled
                ? "Select a conversation to start messaging..."
                : `Message ${activeUserName || "user"}...`
            }
            className="w-full max-h-32 min-h-[44px] resize-none rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-zinc-800"
          title="Send Message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <div className="mx-auto mt-2 flex max-w-4xl items-center justify-between px-1 text-[11px] text-zinc-500 font-medium">
        <span className="flex items-center gap-1">
          <CornerDownLeft className="h-3 w-3" /> Press Enter to send, Shift + Enter for newline
        </span>
        <span className="hidden sm:inline text-zinc-400">PalmTask Live Socket</span>
      </div>
    </div>
  );
};
