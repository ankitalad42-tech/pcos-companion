import React from "react";
import { UIMessage } from "ai";

export function UserMessage({
  message,
  showTimestamp,
}: {
  message: UIMessage;
  showTimestamp?: boolean;
}) {
  return (
    <div className="w-full flex justify-end pr-2 my-2">
      <div className="user-bubble animate-pop">
        {message.parts?.map((part, index) =>
          part.type === "text" ? <p key={index}>{part.text}</p> : null
        )}
      </div>

      {/* OPTIONAL TIMESTAMP */}
      {showTimestamp && (
        <div className="text-xs text-pink-600 mt-auto ml-2 opacity-70">
          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
    </div>
  );
}
