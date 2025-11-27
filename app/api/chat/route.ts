import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";

import { MODEL } from "@/config";
import { SYSTEM_PROMPT } from "@/prompts";
import { isContentFlagged } from "@/lib/moderation";
import { webSearch } from "./tools/web-search";
import { vectorDatabaseSearch } from "./tools/search-vector-database";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // ⭐ Detect latest user message
  const latestUserMessage = messages.filter(m => m.role === "user").pop();

  if (latestUserMessage) {
    const textParts = latestUserMessage.parts
      .filter(p => p.type === "text")
      .map(p => ("text" in p ? p.text : ""))
      .join("");

    // Moderation block unchanged
    if (textParts) {
      const moderationResult = await isContentFlagged(textParts);

      if (moderationResult.flagged) {
        const stream = createUIMessageStream({
          execute({ writer }) {
            const id = "moderation-denial";

            writer.write({ type: "start" });
            writer.write({ type: "text-start", id });
            writer.write({
              type: "text-delta",
              id,
              delta:
                moderationResult.denialMessage ||
                "Your message violates our guidelines.",
            });
            writer.write({ type: "text-end", id });
            writer.write({ type: "finish" });
          },
        });

        return createUIMessageStreamResponse({ stream });
      }
    }
  }

  // ⭐ MAIN AI CALL
  const result = streamText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: { webSearch, vectorDatabaseSearch },
    stopWhen: stepCountIs(10),
    providerOptions: {
      openai: {
        reasoningSummary: "auto",
        reasoningEffort: "low",
        parallelToolCalls: false,
      },
    },
  });

  // ⭐ FIX: Convert to async iterable safely
  const asyncStream = result.toAIStream();

  // ⭐ STREAM WRAPPER WITH MODE INJECTION
  const stream = createUIMessageStream({
    async execute({ writer }) {
      writer.write({ type: "start" });

      for await (const msg of asyncStream) {
        if (msg.role === "assistant") {
          const lastUser = messages.filter(m => m.role === "user").pop();
          const mode = (lastUser as any)?.metadata?.mode;

          if (mode) {
            msg.metadata = { mode };
          }
        }

        writer.write(msg);
      }

      writer.write({ type: "finish" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
