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

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const welcomeMessageShownRef = useRef(false);

  const load = () => {
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

  const stored = load();
  const [initialMessages] = useState<UIMessage[]>(stored.messages);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: initialMessages,
  });

  useEffect(() => {
    setIsClient(true);
    setDurations(stored.durations || {});
    setMessages(stored.messages || []);
  }, []);

  const save = (msgs: UIMessage[], dur: Record<string, number>) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages: msgs, durations: dur })
    );
  };

  useEffect(() => {
    if (isClient) save(messages, durations);
  }, [messages, durations, isClient]);

  useEffect(() => {
    if (isClient && initialMessages.length === 0 && !welcomeMessageShownRef.current) {
      const welcomeMsg: UIMessage = {
        id: "welcome-" + Date.now(),
        role: "assistant",
        parts: [{ type: "text", text: WELCOME_MESSAGE }],
      };
      setMessages([welcomeMsg]);
      save([welcomeMsg], {});
      welcomeMessageShownRef.current = true;
    }
  }, [isClient]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const onSubmit = (data: any) => {
    sendMessage({ text: data.message });
    form.reset();
  };

  const clearChat = () => {
    setMessages([]);
    setDurations({});
    save([], {});
    toast.success("Chat cleared");
  };

  return (
    <div
      className="flex h-screen items-center justify-center font-sans"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <main className="w-full h-screen relative">

        {/* HEADER */}
        <header
          className="fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-md flex items-center justify-between"
          style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/logo.png" alt="PCOS Companion" />
              <AvatarFallback>
                <Image src="/logo.png" alt="logo" width={40} height={40} />
              </AvatarFallback>
            </Avatar>

            <h1 className="text-xl font-semibold" style={{ color: "var(--primary)" }}>
              Chat with {AI_NAME}
            </h1>
          </div>

          <Button variant="outline" size="sm" onClick={clearChat}>
            <Plus className="size-4" />
            {CLEAR_CHAT_TEXT}
          </Button>
        </header>

        {/* CHAT SCROLL AREA */}
        <div
          className="h-screen overflow-y-auto px-5 py-4 w-full pt-[90px] pb-[150px]"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div className="flex flex-col items-center justify-end min-h-full">
            {isClient ? (
              <>
                <MessageWall
                  messages={messages}
                  status={status}
                  durations={durations}
                  onDurationChange={(k, d) => setDurations({ ...durations, [k]: d })}
                />
                {status === "submitted" && (
                  <div className="flex justify-start max-w-3xl w-full">
                    <Loader2 className="size-4 animate-spin" style={{ color: "var(--muted-foreground)" }} />
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center max-w-2xl w-full">
                <Loader2 className="size-4 animate-spin" style={{ color: "var(--muted-foreground)" }} />
              </div>
            )}
          </div>
        </div>

        {/* INPUT BOX */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{ backgroundColor: "var(--card)", borderTop: "1px solid var(--border)" }}
        >
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
                        <div className="relative h-13">
                          <Input
                            {...field}
                            className="h-15 pr-15 pl-5 rounded-2xl"
                            style={{
                              backgroundColor: "var(--card)",
                              border: "1px solid var(--input)",
                              color: "var(--foreground)",
                            }}
                            placeholder="Type your message here..."
                            autoComplete="off"
                          />

                          {/* SEND BUTTON */}
                          {status !== "streaming" && status !== "submitted" && (
                            <Button
                              className="absolute right-3 top-3 rounded-full"
                              type="submit"
                              disabled={!field.value.trim()}
                              size="icon"
                            >
                              <ArrowUp className="size-4" />
                            </Button>
                          )}

                          {/* STOP BUTTON */}
                          {(status === "streaming" || status === "submitted") && (
                            <Button
                              className="absolute right-2 top-2 rounded-full"
                              size="icon"
                              onClick={() => stop()}
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

          <div className="w-full px-5 py-3 flex justify-center text-xs">
            © {new Date().getFullYear()} {OWNER_NAME} —{" "}
            <Link href="/terms" className="underline">Terms of Use</Link> — Powered by{" "}
            <Link href="https://ringel.ai/" className="underline">Ringel.AI</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
