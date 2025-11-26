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
  // Track streaming time
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

  // Detect welcome message
  const isWelcome = message.id.startsWith("welcome");

  //
  // 🌸 WELCOME MESSAGE (with your logo avatar)
  //
  if (isWelcome) {
    return (
      <div className="w-full flex justify-start my-6">
        <div className="flex gap-3 items-start">

          {/* Avatar using your logo */}
          <div className="h-10 w-10 rounded-full border border-pink-200 shadow-sm overflow-hidden flex items-center justify-center bg-white">
            <Image
              src="/logo.png"
              alt="PCOS Companion Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          {/* Pretty welcome bubble */}
          <div className="p-5 rounded-2xl bg-[#F7E8FF] border border-pink-200 shadow-sm leading-relaxed max-w-2xl text-[1.05rem] whitespace-pre-line">
            {message.parts?.map((part, index) =>
              part.type === "text" ? (
                <p key={index} className="mb-3 last:mb-0">
                  {part.text}
                </p>
              ) : null
            )}
          </div>
        </div>
      </div>
    );
  }

  //
  // 🌿 DEFAULT ASSISTANT MESSAGES
  //
  return (
    <div className="w-full flex justify-start my-2">
      <div className="assistant-bubble">
        {message.parts?.map((part, index) =>
          part.type === "text" ? <p key={index}>{part.text}</p> : null
        )}
      </div>
    </div>
  );
}
