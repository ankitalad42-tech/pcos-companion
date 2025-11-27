import React, { useEffect, useState } from "react";
import { UIMessage } from "ai";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

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

  // 🌸 MODE MECHANISM — TYPE-SAFE VERSION
  const mode = (message as any)?.metadata?.mode as string | undefined;

  const modeStyles: Record<string, string> = {
    wellness: "bg-pink-100 text-pink-700 border-pink-200",
    nutrition: "bg-rose-100 text-rose-700 border-rose-200",
    fitness: "bg-purple-100 text-purple-700 border-purple-200",
    stress: "bg-blue-100 text-blue-700 border-blue-200",
    coach: "bg-amber-100 text-amber-700 border-amber-200",
    hormones: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    cycle: "bg-violet-100 text-violet-700 border-violet-200",
    skincare: "bg-neutral-200 text-neutral-700 border-neutral-300",
    cravings: "bg-rose-50 text-rose-700 border-rose-200",
    mealplan: "bg-teal-100 text-teal-700 border-teal-200",
    beginner: "bg-green-100 text-green-700 border-green-200",
    emotional: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const modeLabels: Record<string, string> = {
    wellness: "Wellness Mode",
    nutrition: "Nutrition Mode",
    fitness: "Fitness Mode",
    stress: "Stress & Sleep Mode",
    coach: "Coach Mode",
    hormones: "Hormone Balance Mode",
    cycle: "Cycle Tracking Mode",
    skincare: "Skin & Hair Mode",
    cravings: "Craving Help Mode",
    mealplan: "Meal Planning Mode",
    beginner: "Beginner Mode",
    emotional: "Emotional Support Mode",
  };

  return (
    <div className="assistant-wrapper">
      {/* 🌸 MODE LABEL */}
      {mode && (
        <div
          className={`
            mode-label mb-1 ml-12 px-3 py-1 rounded-full text-sm font-medium border
            ${modeStyles[mode] || "bg-pink-50 text-pink-700 border-pink-200"}
          `}
        >
          {modeLabels[mode] || "Mode"}
        </div>
      )}

      {/* Avatar */}
      <Image
        src="/logo.png"
        width={40}
        height={40}
        alt="logo"
        className="assistant-avatar-img"
      />

      <div className="fancy-bubble">
        <div className="assistant-text markdown-content">
          {message.parts?.map((p, i) =>
            p.type === "text" ? (
              // ⭐ ADDED className="markdown-table"
              <ReactMarkdown key={i} className="markdown-table">
                {p.text}
              </ReactMarkdown>
            ) : null
          )}
        </div>

        <div className="bubble-tail"></div>
      </div>
    </div>
  );
}
