import React, { useEffect, useState } from "react";
import { UIMessage } from "ai";

export function UserMessage({
  message,
  status,
  isLastMessage,
}: {
  message: UIMessage;
  status?: string;
  isLastMessage?: boolean;
}) {
  const [timestamp, setTimestamp] = useState("");

  // Generate timestamp when message is created
  useEffect(() => {
    const time = new Date();
    const formatted = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setTimestamp(formatted);
  }, []);

  return (
    <div className="user-wrapper">
      {/* USER BUBBLE */}
      <div className="user-bubble animate-user-fade animate-user-pop ripple-effect">
        {message.parts?.map((part, i) =>
          part.type === "text" ? (
            <p key={i} className="user-text">
              {part.text}
            </p>
          ) : null
        )}

        <span className="user-timestamp">{timestamp}</span>
      </div>

      {/* TYPING DOTS BELOW BUBBLE */}
      {status === "submitted" && isLastMessage && (
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </div>
  );
}
