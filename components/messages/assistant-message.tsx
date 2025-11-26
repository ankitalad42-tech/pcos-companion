import { AIMessage } from "ai";
import React from "react";

export function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="w-full flex justify-start my-2">
      <div
        className="
          max-w-[80%]
          bg-[#ffe5ef]
          text-[#3d1f2d]
          px-4 py-3
          rounded-2xl
          shadow-sm
          border border-[#ffcee0]
        "
      >
        <p className="whitespace-pre-line leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
