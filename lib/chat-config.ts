export function getChatMode(): "live" | "demo" | "unconfigured" {
  if (process.env.CHAT_DEMO_MODE === "true") return "demo";
  return process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY
    ? "live"
    : "unconfigured";
}
