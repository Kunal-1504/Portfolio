import type { UIMessage } from "ai";
import { getInstantAnswer } from "@/lib/answers";
export type PortfolioMessage = UIMessage<{ source?: "portfolio" }>;
export function createInstantExchange(
  question: string,
  demo: boolean,
): PortfolioMessage[] | null {
  const text = question.trim();
  const answer = getInstantAnswer(text, demo);
  if (!answer) return null;
  const id = crypto.randomUUID();
  const parts: PortfolioMessage["parts"] = [
    { type: "text", text: answer.text },
  ];
  if (answer.tool)
    parts.push({
      type: "dynamic-tool",
      toolName: answer.tool,
      toolCallId: `${id}-card`,
      state: "output-available",
      input: {},
      output: { source: "portfolio" },
    });
  return [
    { id: `${id}-user`, role: "user", parts: [{ type: "text", text }] },
    {
      id: `${id}-answer`,
      role: "assistant",
      metadata: { source: "portfolio" },
      parts,
    },
  ];
}
