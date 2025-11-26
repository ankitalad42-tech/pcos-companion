import { openai } from "@ai-sdk/openai";
import { fireworks } from "@ai-sdk/fireworks";
import { wrapLanguageModel, extractReasoningMiddleware } from "ai";

export const MODEL = openai('gpt-4.1');

// ---------------------------------------------------------------------------
// Date & Time Helper
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Branding
// ---------------------------------------------------------------------------
export const AI_NAME = "PCOS Companion";
export const OWNER_NAME = "Ankita and Saba (BITSoM MBA ’26)";

export const WELCOME_MESSAGE = `
Hi there 💗

I’m your PCOS Companion — a judgment-free place to learn about PCOS and build supportive habits. I share simple, trustworthy information to help you take small steps each day.

You can ask things like:
• “Explain PCOS simply”
• “Easy PCOS-friendly meal?”
• “Light workout ideas?”
• “Tips for stress or sleep?”

I’m not a medical professional, but I’m here with reliable guidance 🌷
`;

export const CLEAR_CHAT_TEXT = "New PCOS chat";

// ---------------------------------------------------------------------------
// Moderation Messages — ONE SET ONLY (no duplicates)
// ---------------------------------------------------------------------------
export const MODERATION_DENIAL_MESSAGE_SEXUAL = `
I’m not able to engage in explicit sexual content.
If you have concerns about sexual health or intimacy with PCOS,
please speak with a gynecologist, endocrinologist, or therapist.
`;

export const MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS = `
I can't discuss any content involving minors in a sexual context.
`;

export const MODERATION_DENIAL_MESSAGE_HARASSMENT = `
I’m here to be a supportive, non-judgmental space.
I can’t respond to abusive or harassing language. 
Let’s keep this focused on your health and wellbeing.
`;

export const MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING = `
I can’t engage with threatening or harassing content.
`;

export const MODERATION_DENIAL_MESSAGE_HATE = `
I can’t participate in hateful or discriminatory content.
I’m designed to support people with PCOS respectfully, regardless of background.
`;

export const MODERATION_DENIAL_MESSAGE_HATE_THREATENING = `
I can't engage with threatening hate speech.
`;

export const MODERATION_DENIAL_MESSAGE_ILLICIT = `
I can't discuss illegal activities.
`;

export const MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT = `
I can't discuss violent illegal activities.
`;

export const MODERATION_DENIAL_MESSAGE_SELF_HARM = `
I’m really glad you reached out. I can’t help with self-harm instructions,
but you deserve real support from a human right now.

If you are in immediate danger, please contact local emergency services.
If possible, reach out to a trusted friend, family member, or mental health professional.
`;

export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT = `
I can't discuss self-harm intentions.
`;

export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS = `
I can't provide instructions related to self-harm.
`;

export const MODERATION_DENIAL_MESSAGE_VIOLENCE = `
I can’t assist with violent content.
If you’re feeling unsafe, please contact local emergency services or a trusted person.
`;

export const MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC = `
I can't discuss graphic violent content.
`;

export const MODERATION_DENIAL_MESSAGE_DEFAULT = `
Your message violates safety guidelines, so I can’t assist with that.
`;

// ---------------------------------------------------------------------------
// Pinecone Settings
// ---------------------------------------------------------------------------
export const PINECONE_TOP_K = 40;
export const PINECONE_INDEX_NAME = "pcos-companion";   // MUST MATCH THE ACTUAL INDEX
