import { openai } from "@ai-sdk/openai";
import { fireworks } from "@ai-sdk/fireworks";
import { wrapLanguageModel, extractReasoningMiddleware } from "ai";

export const MODEL = openai('gpt-4.1');

// If you want to use a Fireworks model, uncomment the following code and set the FIREWORKS_API_KEY in Vercel
// NOTE: Use middleware when the reasoning tag is different than think. (Use ChatGPT to help you understand the middleware)
// export const MODEL = wrapLanguageModel({
//     model: fireworks('fireworks/deepseek-r1-0528'),
//     middleware: extractReasoningMiddleware({ tagName: 'think' }), // Use this only when using Deepseek
// });


function getDateAndTime(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    });
    return `The day today is ${dateStr} and the time right now is ${timeStr}.`;
}

export const DATE_AND_TIME = getDateAndTime();

export const AI_NAME = "PCOS Companion";
export const OWNER_NAME = "Ankita Lad (BITSoM MBA ’25)";

export const WELCOME_MESSAGE = `Hi, I’m ${Pcos_Companion} — an educational assistant for people living with PCOS.

I can:
- explain PCOS in simple language
- help you build gentle weekly movement plans
- suggest PCOS-friendly food patterns
- talk about sleep, stress and emotional health
- summarise reliable guidelines and patient information

I **cannot** diagnose you, interpret lab tests, or replace your doctor. 
Always talk to a qualified health professional before changing medication, diet, or exercise.
`;

export const CLEAR_CHAT_TEXT = "New PCOS chat";

export const MODERATION_DENIAL_MESSAGE_SEXUAL = "I can't discuss explicit sexual content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS = "I can't discuss content involving minors in a sexual context. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_HARASSMENT = "I can't engage with harassing content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING = "I can't engage with threatening or harassing content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HATE = "I can't engage with hateful content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HATE_THREATENING = "I can't engage with threatening hate speech. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_ILLICIT = "I can't discuss illegal activities. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT = "I can't discuss violent illegal activities. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM = "I can't discuss self-harm. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT = "I can't discuss self-harm intentions. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS = "I can't provide instructions related to self-harm. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_VIOLENCE = "I can't discuss violent content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC = "I can't discuss graphic violent content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_DEFAULT = "Your message violates our guidelines. I can't answer that.";
export const MODERATION_DENIAL_MESSAGE_SEXUAL = `
I’m not able to engage in explicit sexual content.
If you have concerns about sexual health or intimacy with PCOS,
please speak with a gynecologist, endocrinologist, or therapist.
`;

export const MODERATION_DENIAL_MESSAGE_HARASSMENT = `
I’m here to be a supportive, non-judgmental space.
I can’t respond to abusive or harassing language. 
Let’s keep this focused on your health and wellbeing.
`;

export const MODERATION_DENIAL_MESSAGE_HATE = `
I can’t participate in hateful or discriminatory content.
I’m designed to support people with PCOS respectfully, regardless of background.
`;

export const MODERATION_DENIAL_MESSAGE_VIOLENCE = `
I can’t assist with violent content.
If you’re feeling unsafe, please contact local emergency services or a trusted person.
`;

export const MODERATION_DENIAL_MESSAGE_SELF_HARM = `
I’m really glad you reached out. I can’t help with self-harm instructions,
but you deserve real support from a human right now.

If you are in immediate danger, please contact local emergency services.
If possible, reach out to a trusted friend, family member, or mental health professional.
`;

export const MODERATION_DENIAL_MESSAGE_ILLEGAL = `
I’m not able to help with illegal activities.
I can provide general educational information about PCOS, lifestyle, and wellbeing instead.
`;


export const PINECONE_TOP_K = 40;
export const PINECONE_INDEX_NAME = "pcos-companion";
