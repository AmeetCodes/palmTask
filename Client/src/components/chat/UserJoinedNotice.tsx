import React from "react";
import { UserCheck, Info } from "lucide-react";

interface UserJoinedNoticeProps {
  text: string;
  timestamp?: string;
}

export const UserJoinedNotice: React.FC<UserJoinedNoticeProps> = ({ text, timestamp }) => {
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="my-3 flex justify-center">
      <div className="flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-[11px] font-medium text-indigo-300 backdrop-blur-md shadow-sm">
        <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
        <span>{text}</span>
        {formattedTime && <span className="text-[10px] text-indigo-400/60">• {formattedTime}</span>}
      </div>
    </div>
  );
};