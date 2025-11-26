import React, { useEffect, useState } from "react";
import { UIMessage } from "ai";
import Image from "next/image";

export function AssistantMessage({
  message,
  status,
  isLastMessage,
  durations,
  onDurationChange,
}: {
  message: UIMessage;
  status?: string;
  isLastMessage?: boolean;
  durations?: Record<string, number>;
  onDurationChange?: (key: string, duration: number) => void;
}) {
  const [startTime] = useState(Date.now());
  const id = message.id;

  // Track streaming duration
  useEffect(() => {
    if (isLastMessage && status === "streaming") {
      const interval = setInterval(
        () => onDurationChange?.(id, Date.now() - startTime),
        200
      );
      return () => clearInterval(interval);
    }
  }, [isLastMessage, status, startTime, id, onDurationChange]);

  return (
    <div className="assistant-wrapper">
      {/* Avatar */}
      <Image
        src="/logo.png"
        width={40}
        height={40}
        alt="logo"
        className="assistant-avatar-img"
      />

      <div className="fancy-bubble">
        <div className="assistant-text">
          {message.parts?.map((p, i) =>
            p.type === "text" ? <p key={i}>{p.text}</p> : null
          )}
        </div>

        <div className="bubble-tail"></div>
      </div>
    </div>
  );
}
