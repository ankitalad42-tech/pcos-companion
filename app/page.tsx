"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Loader2, Plus, Square } from "lucide-react";
import { MessageWall } from "@/components/messages/message-wall";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UIMessage } from "ai";
import { useEffect, useState, useRef } from "react";
import { AI_NAME, CLEAR_CHAT_TEXT, OWNER_NAME, WELCOME_MESSAGE } from "@/config";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  message: z.string().min(1).max(2000),
});

const STORAGE_KEY = "chat-messages";

const loadMessages = () => {
  if (typeof window === "undefined") return { messages: [], durations: {} };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {
      messages: [],
      durations: {},
    };
  } catch {
    return { messages: [], durations: {} };
  }
};

const saveMessages = (messages: UIMessage[], durations: Record<string, number>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, durations }));
};

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const welcomeMessageShownRef = useRef(false);

  const stored = loadMessages();
  const [initialMessages] = useState<UIMessage[]>(stored.messages);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: initialMessages,
  });

  useEffect(() => {
    setIsClient(true);
    setDurations(stored.durations);
    setMessages(stored.messages);
  }, []);

  useEffect(() => {
    if (isClient) saveMessages(messages, durations);
  }, [messages, durations, isClient]);

  const handleDurationChange = (key: string, duration: number) => {
    setDurations((prev) => ({ ...prev, [key]: duration }));
  };

  // Inject welcome message on first load
  useEffect(() => {
    if (isClient && initialMessages.length === 0 && !welcomeMessageShownRef.current) {
      const welcome: UIMessage = {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: WELCOME_MESSAGE }],
      };
      setMessages([welcome]);
      saveMessages([welcome], {});
      welcomeMessageShownRef.current = true;
    }
  }, [isClient, initialMessages.length]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  function onSubmit(values: any) {
    sendMessage({ text: values.message });
    form.reset();
  }

  function clearChat() {
    setMessages([]);
    setDurations({});
    saveMessages([], {});
    toast.success("Chat cleared");
  }

  return (
    <div className="flex h-screen items-center justify-center font-sans bg-white dark:bg-black">
      <main className="w-full h-screen relative">

        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white dark:bg-black shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/logo.png" />
              <AvatarFallback>
                <Image src="/logo.png" width={40} height={40} alt="logo" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-semibold text-pink-600">
              Chat with {AI_NAME}
            </h1>
          </div>

          <Button variant="outline" size="sm" onClick={clearChat}>
            <Plus className="size-4" /> {CLEAR_CHAT_TEXT}
          </Button>
        </header>

        {/* CHAT AREA */}
        <div className="h-screen overflow-y-auto px-5 py-4 w-full pt-[90px] pb-[150px]">
          <div className="flex flex-col items-center justify-end min-h-full">
            {isClient ? (
              <>
                <MessageWall
                  messages={messages}
                  status={status}
                  durations={durations}
                  onDurationChange={handleDurationChange}
                />

                {status === "submitted" && (
                  <div className="flex justify-start max-w-3xl w-full">
                    <Loader2 className="size-4 animate-spin text-gray-400" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center max-w-2xl w-full">
                <Loader2 className="size-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* INPUT BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black">
          <div className="w-full px-5 pt-5 pb-1 flex justify-center">
            <div className="max-w-3xl w-full">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel className="sr-only">Message</FieldLabel>

                        <div className="relative">
                          <Input
                            {...field}
                            className="h-14 pr-14 pl-5 rounded-2xl border border-gray-300 bg-white dark:bg-gray-900"
                            placeholder="Type your message here…"
                            disabled={status === "streaming"}
                            autoComplete="off"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                          />

                          {(status === "ready" || status === "error") && (
                            <Button
                              type="submit"
                              className="absolute right-3 top-3 rounded-full"
                              disabled={!field.value.trim()}
                              size="icon"
                            >
                              <ArrowUp className="size-4" />
                            </Button>
                          )}

                          {status !== "ready" && status !== "error" && (
                            <Button
                              size="icon"
                              className="absolute right-3 top-3 rounded-full"
                              onClick={stop}
                            >
                              <Square className="size-4" />
                            </Button>
                          )}
                        </div>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </div>
          </div>

          {/* FOOTER */}
          <div className="w-full px-5 py-3 flex justify-center text-xs text-gray-500">
            © {new Date().getFullYear()} {OWNER_NAME} •{" "}
            <Link href="/terms" className="underline">
              Terms of Use
            </Link>{" "}
            • Powered by{" "}
            <Link href="https://ringel.ai" className="underline">
              Ringel.AI
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
