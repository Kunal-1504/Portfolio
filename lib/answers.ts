import { type PortfolioToolName } from "@/data/portfolio";
export function previewAnswer(question: string): {
  text: string;
  tool?: PortfolioToolName;
} {
  const q = question.toLowerCase().trim();
  if (/document[ -]*management|\bdms\b|largest project|flagship/.test(q))
    return {
      text: "My Document Management System is my largest project: a multi-tenant platform that turns uploaded documents into searchable knowledge and cited answers. It brings together Next.js, FastAPI, background workers, and a layered RAG pipeline. Open the first card for the architecture highlights.",
      tool: "getProjects",
    };
  if (
    /project|built|portfolio|cloud|midc|workout|society|compliance|cognitive|guardian|doomscroll/.test(
      q,
    )
  )
    return {
      text: "I like turning AI into something useful. Explore my work across cloud forecasting, autonomous agents, document intelligence, on-device AI, and computer vision. Pick one to explore the details.",
      tool: "getProjects",
    };
  if (/resume|résumé|\bcv\b/.test(q))
    return {
      text: "Here’s the classic version of my story. You can download my résumé below.",
      tool: "getResume",
    };
  if (/contact|reach you|email|phone|linkedin|github|connect/.test(q))
    return {
      text: "Have something in mind? I’d love to hear about it. Here’s where you can find me.",
      tool: "getContact",
    };
  if (
    /available|availability|hire|hiring|full.time|freelance|remote|opportunit/.test(
      q,
    )
  )
    return {
      text: "I’m open to full-time AI/ML roles and select freelance or contract work. Interesting problems are a great place to start.",
      tool: "getAvailability",
    };
  if (/skill|stack|technolog|language|framework/.test(q))
    return {
      text: "My toolkit covers the full journey: from data and models to agents, APIs, and interfaces.",
      tool: "getSkills",
    };
  if (/fun|hobb|record|guinness|outside|anecdote/.test(q))
    return {
      text: "Here’s a fact that doesn’t usually fit into a GitHub README: I’m a Guinness World Record contributor!",
      tool: "getCrazy",
    };
  if (
    /who are you|about|introduce|education|degree|university|where.*(from|based|live)|^(hi|hello|hey)[!. ]*$/.test(
      q,
    )
  )
    return {
      text: "Hey, I’m Kunal! I’m an AI/ML engineer based in Pune, specializing in agentic systems and computer vision. I build AI that’s useful, explainable, and ready for the real world.",
      tool: "getPresentation",
    };
  return {
    text: "I don’t know, ask me directly. This is a portfolio preview with prepared answers; try the questions below to explore my work, skills, or story.",
    tool: "getContact",
  };
}

// Prepared responses are available only when demo mode is explicitly enabled.
// Every live-mode question, including quick questions, goes to the AI provider.
export function getInstantAnswer(question: string, demo: boolean) {
  if (!demo || !question.trim() || question.trim().length > 2000) return null;
  return previewAnswer(question);
}
