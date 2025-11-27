import { streamText, UIMessage, convertToModelMessages, stepCountIs, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { MODEL } from '@/config';
import { SYSTEM_PROMPT } from '@/prompts';
import { isContentFlagged } from '@/lib/moderation';
import { webSearch } from './tools/web-search';
import { vectorDatabaseSearch } from './tools/search-vector-database';

export const maxDuration = 30;

// ⭐ NEW — simple keyword-based mode detector
function detectMode(text: string): string | undefined {
    const lower = text.toLowerCase();

    if (lower.includes("sleep") || lower.includes("relax")) return "sleep";
    if (lower.includes("stress") || lower.includes("anxiety")) return "stress";
    if (lower.includes("coach") || lower.includes("motivate")) return "coach";
    if (lower.includes("food") || lower.includes("meal") || lower.includes("diet")) return "nutrition";
    if (lower.includes("hormone") || lower.includes("pcos symptoms")) return "hormones";
    if (lower.includes("skin") || lower.includes("hair")) return "skincare";

    return undefined;
}

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const latestUserMessage = messages
        .filter(msg => msg.role === 'user')
        .pop();

    if (latestUserMessage) {
        const textParts = latestUserMessage.parts
            .filter(part => part.type === 'text')
            .map(part => 'text' in part ? part.text : '')
            .join('');

        // ⭐ NEW — detect the user's mode
        const detectedMode = detectMode(textParts);

        // ⭐ NEW — attach mode to the *user* message metadata (so it flows forward)
        if (detectedMode) {
            latestUserMessage.metadata = { ...(latestUserMessage.metadata || {}), mode: detectedMode };
        }

        if (textParts) {
            const moderationResult = await isContentFlagged(textParts);

            if (moderationResult.flagged) {
                const stream = createUIMessageStream({
                    execute({ writer }) {
                        const textId = 'moderation-denial-text';

                        writer.write({ type: 'start' });
                        writer.write({ type: 'text-start', id: textId });
                        writer.write({
                            type: 'text-delta',
                            id: textId,
                            delta: moderationResult.denialMessage || "Your message violates our guidelines. I can't answer that.",
                        });
                        writer.write({ type: 'text-end', id: textId });
                        writer.write({ type: 'finish' });
                    },
                });

                return createUIMessageStreamResponse({ stream });
            }
        }
    }

    const result = streamText({
        model: MODEL,
        system: SYSTEM_PROMPT,
        messages: convertToModelMessages(messages),
        tools: {
            webSearch,
            vectorDatabaseSearch,
        },
        stopWhen: stepCountIs(10),
        providerOptions: {
            openai: {
                reasoningSummary: 'auto',
                reasoningEffort: 'low',
                parallelToolCalls: false,
            }
        }
    });

    // ⭐ NEW — after model responds, attach mode metadata to assistant messages
    return result.toUIMessageStreamResponse({
        sendReasoning: true,
        transform: (msg) => {
            if (msg.role === "assistant") {
                const lastUserMsg = messages.filter(m => m.role === "user").pop();
                const mode = lastUserMsg?.metadata?.mode;

                if (mode) {
                    msg.metadata = { ...(msg.metadata || {}), mode };
                }
            }
            return msg;
        }
    });
}
