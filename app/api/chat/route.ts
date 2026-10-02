import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
} from "ai";
import { z } from "zod";
import { chatRequestSchema, systemPrompt, toolData } from "@/lib/chat";
import { getGitHubSnapshot } from "@/lib/github";
import { getChatMode } from "@/lib/chat-config";
import { getInstantAnswer } from "@/lib/answers";
import { isProjectGalleryRequest } from "@/lib/project-presentation";
import { toolNames } from "@/data/portfolio";
export const maxDuration = 30;
export const runtime = "nodejs";
const descriptions = {
  getPresentation:
    "Show Kunal’s bio, employment experience, responsibilities, education, location and introduction card.",
  getProjects:
    "Show interactive project cards with results, stacks, and GitHub links.",
  getSkills: "Show skills grouped into technical categories.",
  getResume: "Show a downloadable résumé card.",
  getContact: "Show email, phone, GitHub and LinkedIn contact details.",
  getAvailability:
    "Show full-time and freelance availability and remote preference.",
  getCrazy: "Show the personal Guinness World Record contribution fact.",
};
const tools = Object.fromEntries(
  toolNames.map((name) => [
    name,
    tool({
      description: descriptions[name],
      inputSchema: z.object({}),
      execute: async () =>
        name === "getProjects"
          ? {
              curatedProjects: toolData.getProjects,
              github: await getGitHubSnapshot(),
            }
          : toolData[name],
    }),
  ]),
);
export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") || 0) > 100000)
    return Response.json(
      { error: "Conversation is too large. Start a new chat." },
      { status: 413 },
    );
  let parsed;
  try {
    const body = await req.text();
    if (body.length > 100000)
      return Response.json(
        { error: "Conversation is too large. Start a new chat." },
        { status: 413 },
      );
    parsed = chatRequestSchema.safeParse(JSON.parse(body));
  } catch {
    return Response.json({ error: "Invalid JSON request." }, { status: 400 });
  }
  if (!parsed.success)
    return Response.json(
      {
        error:
          "Please send a question of up to 2,000 characters and no more than 40 messages.",
      },
      { status: 400 },
    );
  const { messages } = parsed.data;
  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const mode = getChatMode();
  if (mode === "unconfigured")
    return Response.json(
      {
        error:
          "Live AI is not connected. Explore the portfolio cards or contact Kunal directly.",
        code: "AI_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  const demo = mode === "demo";
  const question = messages
    .at(-1)!
    .parts.filter((p) => p.type === "text")
    .map((p) => p.text)
    .join(" ");
  const answer = getInstantAnswer(question, demo);
  if (answer) {
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({
          type: "start",
          messageId: crypto.randomUUID(),
          messageMetadata: { source: "portfolio" },
        });
        writer.write({ type: "text-start", id: "preview" });
        writer.write({ type: "text-delta", id: "preview", delta: answer.text });
        writer.write({ type: "text-end", id: "preview" });
        if (answer.tool) {
          const toolCallId = crypto.randomUUID();
          writer.write({
            type: "tool-input-available",
            toolCallId,
            toolName: answer.tool,
            input: {},
          });
          writer.write({
            type: "tool-output-available",
            toolCallId,
            output: toolData[answer.tool],
          });
        }
        writer.write({ type: "finish" });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
  try {
    const isGroq = !process.env.OPENAI_API_KEY && !!process.env.GROQ_API_KEY;
    const isGemini =
      !process.env.OPENAI_API_KEY &&
      !isGroq &&
      !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const provider = createOpenAICompatible({
      name: "portfolio",
      apiKey,
      // Groq GPT-OSS uses `reasoning`, while the compatible adapter replays
      // it as unsupported `reasoning_content` on the next tool step.
      transformRequestBody: (body) =>
        isGroq && String(body.model).startsWith("openai/gpt-oss-")
          ? { ...body, include_reasoning: false, reasoning_effort: "low" }
          : body,
      baseURL:
        process.env.OPENAI_BASE_URL ||
        (isGroq
          ? "https://api.groq.com/openai/v1"
          : isGemini
            ? "https://generativelanguage.googleapis.com/v1beta/openai"
            : "https://api.openai.com/v1"),
    });
    const result = streamText({
      model: provider(
        process.env.AI_MODEL ||
          (isGroq
            ? "openai/gpt-oss-20b"
            : isGemini
              ? "gemini-2.5-flash"
              : "gpt-4o-mini"),
      ),
      system: systemPrompt,
      messages: messages
        .map((m) => ({
          role: m.role,
          content: m.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text || "")
            .join("\n"),
        }))
        .filter((m) => m.content.trim()),
      tools,
      prepareStep: ({ stepNumber }) => ({
        toolChoice:
          stepNumber === 0 && isProjectGalleryRequest(question)
            ? { type: "tool", toolName: "getProjects" }
            : "auto",
      }),
      // The project gallery is the complete answer; another generation would
      // duplicate its content and delay the ready-to-use cards.
      stopWhen: [
        stepCountIs(2),
        ({ steps }) =>
          isProjectGalleryRequest(question) &&
          (steps
            .at(-1)
            ?.toolCalls.some((call) => call.toolName === "getProjects") ??
            false),
      ],
      maxOutputTokens: 600,
      abortSignal: AbortSignal.any([req.signal, AbortSignal.timeout(25000)]),
      maxRetries: 1,
    });
    return result.toUIMessageStreamResponse({
      sendReasoning: false,
      onError: () =>
        "My AI connection is taking a break. Please retry or email me directly.",
    });
  } catch {
    return Response.json(
      {
        error:
          "Chat is unavailable right now. Please retry or contact Kunal directly.",
      },
      { status: 503 },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
