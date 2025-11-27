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

        // ⭐ NEW — detect mode & attach to metadata
        const detectedMode = detectMode(textParts);
        if (detectedMode) {
            latestUserMessage.metadata = {
                ...(latestUserMessage.metadata || {}),
                mode: detectedMode
            };
        }

        // existing moderation logic
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

    // ⭐ NEW — Pass mode metadata forward to model
    const modelMessages = convertToModelMessages(messages).map(msg => {
        if (msg.role === "assistant") {
            const lastUser = messages.filter(m => m.role === "user").pop();
            if (lastUser?.metadata?.mode) {
                msg.metadata = { mode: lastUser.metadata.mode };
            }
        }
        return msg;
    });

    const result = streamText({
        model: MODEL,
        system: SYSTEM_PROMPT,
        messages: modelMessages,
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

    // ⭐ FIX — no transform
    return result.toUIMessageStreamResponse({
        sendReasoning: true
    });
}
