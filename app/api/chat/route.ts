import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse
} from "ai";

import { MODEL } from "@/config";
import { SYSTEM_PROMPT } from "@/prompts";
import { isContentFlagged } from "@/lib/moderation";
import { webSearch } from "./tools/web-search";
import { vectorDatabaseSearch } from "./tools/search-vector-database";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // ⭐ Extract latest user message safely
  const latestUserMessage = messages.filter(m => m.role === "user").pop();

  if (latestUserMessage) {
    const textParts = latestUserMessage.parts
      .filter(p => p.type === "text")
      .map(p => ("text" in p ? p.text : ""))
      .join("");

    if (textParts) {
      const moderationResult = await isContentFlagged(textParts);

      if (moderationResult.flagged) {
        const stream = createUIMessageStream({
          execute({ writer }) {
            const textId = "moderation-denial-text";

            writer.write({ type: "start" });
            writer.write({ type: "text-start", id: textId });
            writer.write({
              type: "text-delta",
              id: textId,
              delta:
                moderationResult.denialMessage ||
                "Your message violates our guidelines. I can't answer that."
            });
            writer.write({ type: "text-end", id: textId });
            writer.write({ type: "finish" });
          }
        });

        return createUIMessageStreamResponse({ stream });
      }
    }
  }

  // ⭐ MAIN LLM CALL
  const result = streamText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: {
      webSearch,
      vectorDatabaseSearch
    },
    stopWhen: stepCountIs(10),
    providerOptions: {
      openai: {
        reasoningSummary: "auto",
        reasoningEffort: "low",
        parallelToolCalls: false
      }
    }
  });

  // ⭐ FIXED METADATA MODE INJECTION FOR ASSISTANT
  return result.toUIMessageStreamResponse({
    sendReasoning: true,

    // ⭐ THIS IS THE ONLY PART WE PATCHED SAFELY
    transform: (msg) => {
      if (msg.role === "assistant") {
        const lastUser = messages.filter(m => m.role === "user").pop();

        // FIX: Type-safe metadata extraction
        const userMeta = (lastUser as any)?.metadata as any;

        if (userMeta?.mode) {
          msg.metadata = { mode: userMeta.mode };
        }
      }

      return msg;
    }
  });
}
