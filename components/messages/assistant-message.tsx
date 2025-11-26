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

  useEffect(() => {
    if (isLastMessage && status === "streaming") {
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        onDurationChange?.(id, elapsed);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isLastMessage, status, startTime, id, onDurationChange]);

  const isWelcome = message.id.startsWith("welcome");

  //
  // 🌸 SUPER-CUTE WELCOME MESSAGE
  //
  if (isWelcome) {
    return (
      <div className="w-full flex justify-start my-8">
        <div className="flex gap-4 items-start">

          {/* 💖 Cute glowing logo avatar */}
          <div className="relative">
            <div className="
              h-12 w-12 rounded-full 
              bg-white 
              border-2 border-pink-200 
              shadow-[0_0_12px_rgba(255,150,200,0.55)]
              overflow-hidden 
              flex items-center justify-center
            ">
              <Image
                src="/logo.png"
                alt="PCOS Companion Logo"
                width={48}
                height={48}
                className="object-contain p-1"
              />
            </div>

            {/* Soft halo glow */}
            <div className="
              absolute inset-0 
              rounded-full 
              blur-xl 
              bg-pink-300/40 
              -z-10
            "></div>
          </div>

          {/* 💗 Cute gradient bubble */}
          <div
            className="
              p-6 rounded-3xl max-w-2xl leading-relaxed text-[1.05rem]
              bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100
              border border-pink-200 shadow-md
              whitespace-pre-line
            "
          >
            {message.parts?.map((part, index) =>
              part.type === "text" ? (
                <p key={index} className="mb-3 last:mb-0 text-[#5a3c4d]">
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
  // 🌿 Default (non-welcome) assistant bubble – also cutified
  //
  return (
    <div className="w-full flex justify-start my-3">
      <div
        className="
          assistant-bubble 
          rounded-2xl 
          bg-pink-50 
          text-[#5a3c4d]
          border border-pink-200
          shadow-sm
        "
      >
        {message.parts?.map((part, index) =>
          part.type === "text" ? <p key={index}>{part.text}</p> : null
        )}
      </div>
    </div>
  );
}
