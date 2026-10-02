import { getToolName, isToolUIPart } from "ai";
import type { PortfolioMessage } from "@/lib/instant-chat";
import { portfolio } from "@/data/portfolio";

// A project tool renders a complete visual answer. Avoid duplicating it as prose
// or an unrendered Markdown table, including while the tool is still streaming.
export function hasProjectGallery(parts: PortfolioMessage["parts"]): boolean {
  return parts.some(
    (part) => isToolUIPart(part) && getToolName(part) === "getProjects",
  );
}

export function isProjectGalleryRequest(question: string): boolean {
  return /^(?:(?:what are|show(?: me)?|list|tell me about|explore|view)\s+)?(?:(?:all|some of)\s+)?(?:(?:your|the|kunal[’']s)\s+)?projects[?.!\s]*$/i.test(
    question.trim(),
  );
}

export function hideProjectNarration(
  parts: PortfolioMessage["parts"],
  question: string,
): boolean {
  if (!hasProjectGallery(parts)) return false;
  const text = parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");
  const isTable = /\|\s*(project|what it does|core stack|status)\s*\|/i.test(
    text,
  );
  const listedProjects = portfolio.projects.filter((project) =>
    text.includes(project.title),
  ).length;
  return isProjectGalleryRequest(question) || isTable || listedProjects >= 3;
}
