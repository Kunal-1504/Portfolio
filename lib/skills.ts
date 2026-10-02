import { portfolio } from "@/data/portfolio";
export const skillCategories = Object.keys(
  portfolio.skills,
) as (keyof typeof portfolio.skills)[];
export type SkillCategory = (typeof skillCategories)[number];
export const categoryDetails: Record<
  SkillCategory,
  { title: string; description: string; color: string; symbol: string }
> = {
  Languages: {
    title: "The foundation",
    description:
      "The languages behind the systems, queries, and interfaces I build.",
    color: "blue",
    symbol: "</>",
  },
  "Agentic AI": {
    title: "Systems that reason",
    description:
      "Connecting models, retrieval, and tools to turn a question into useful action.",
    color: "violet",
    symbol: "✧",
  },
  "Computer Vision": {
    title: "Making motion meaningful",
    description: "Understanding movement and form from pixels and live video.",
    color: "peach",
    symbol: "◎",
  },
  "ML & Forecasting": {
    title: "From data to decisions",
    description:
      "Learning patterns, forecasting outcomes, and explaining the result.",
    color: "green",
    symbol: "∿",
  },
  "Backend / Frontend": {
    title: "Models meet products",
    description: "APIs and interfaces that make technical systems usable.",
    color: "blue",
    symbol: "{ }",
  },
  Tools: {
    title: "From build to delivery",
    description: "The environment and tools around a working AI product.",
    color: "amber",
    symbol: "⌘",
  },
};
export const allSkills = skillCategories.flatMap((category) =>
  portfolio.skills[category].map((name) => ({ name, category })),
);
const aliases: Record<string, string[]> = {
  SQL: ["SQL", "PostgreSQL"],
  "Pose estimation": ["Pose estimation", "MediaPipe"],
  "Tool calling": ["Tool calling"],
  "GPT-4 / Gemini": ["GPT-4", "Gemini"],
};
export function projectsForSkill(skill: string) {
  const names = aliases[skill] || [skill];
  return portfolio.projects.filter((project) =>
    names.some((name) =>
      project.stack.some((item) => item.toLowerCase() === name.toLowerCase()),
    ),
  );
}
export function filterSkills(query: string, category: SkillCategory) {
  const search = query.trim().toLowerCase();
  return allSkills.filter((skill) =>
    search
      ? `${skill.name} ${skill.category}`.toLowerCase().includes(search)
      : skill.category === category,
  );
}
