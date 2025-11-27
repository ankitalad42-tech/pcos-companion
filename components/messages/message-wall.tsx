import { UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";

export function MessageWall({
  messages,
  status,
  durations,
  onDurationChange,
}: {
  messages: UIMessage[];
  status?: string;
  durations?: Record<string, number>;
  onDurationChange?: (key: string, duration: number) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full px-5">
      {/* ⭐ FIX: Add w-full so messages can split left + right */}
      <div className="flex flex-col gap-4 max-w-2xl w-full">

        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;

          return (
            <div key={m.id} className="w-full">
              {/* Divider */}
              {i !== 0 && <div className="message-divider"></div>}

              {m.role === "user" ? (
                <UserMessage message={m} />
              ) : (
                <AssistantMessage
                  message={m}
                  status={status}
                  isLastMessage={isLast}
                  durations={durations}
                  onDurationChange={onDurationChange}
                />
              )}
            </div>
          );
        })}

        {/* Typing animation */}
        {status === "streaming" && (
          <div className="typing-dots">
            <span></span><span></span><span></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
