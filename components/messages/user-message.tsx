import React from "react";

export function UserMessage({ content }: { content: string }) {
  return (
    <div className="w-full flex justify-end my-2">
      <div
        className="
          max-w-[80%]
          bg-[#f1e8ff]
          text-[#2a1d3a]
          px-4 py-3
          rounded-2xl
          shadow-sm
          border border-[#e2d4ff]
        "
      >
        <p className="whitespace-pre-line leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
