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
      const interval = setInterval(() => {
        onDurationChange?.(id, Date.now() - startTime);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isLastMessage, status, startTime, id, onDurationChange]);

  return (
    <div className="assistant-wrapper">
      {/* Avatar */}
      <div className="assistant-avatar">
        <Image
          src="/logo.png"
          alt="PCOS Companion"
          width={42}
          height={42}
          className="assistant-avatar-img"
        />
      </div>

      {/* Bubble */}
      <div className="assistant-bubble fancy-bubble animate-fade-in">
        {message.parts?.map((part, index) =>
          part.type === "text" ? (
            <p key={index} className="assistant-text">
              {part.text}
            </p>
          ) : null
        )}

        {/* Bubble tail */}
        <div className="bubble-tail" />
      </div>
    </div>
  );
}
