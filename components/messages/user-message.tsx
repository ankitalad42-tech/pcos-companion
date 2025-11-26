import React from "react";
import { UIMessage } from "ai";

export function UserMessage({ message }: { message: UIMessage }) {
  return (
    <div className="w-full flex justify-end my-2">
      <div className="user-bubble">
        {message.parts?.map((part, index) =>
          part.type === "text" ? <p key={index}>{part.text}</p> : null
        )}
      </div>
    </div>
  );
}
