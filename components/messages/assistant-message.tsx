import React, { useEffect, useState } from "react";
import { UIMessage } from "ai";

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

  useEffect(() => {
    if (isLastMessage && status === "streaming") {
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        onDurationChange?.(id, elapsed);
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isLastMessage, status, startTime, id, onDurationChange]);

  return (
    <div className="w-full flex justify-start my-2">
      <div className="assistant-bubble">
        {message.parts?.map((part, index) =>
          part.type === "text" ? (
            <p
              key={index}
              className="whitespace-pre-line leading-relaxed"
            >
              {part.text}
            </p>
          ) : null
        )}
      </div>
    </div>
  );
}
