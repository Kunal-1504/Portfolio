import { z } from "zod";
import { portfolio } from "@/data/portfolio";

export const githubOwner = new URL(portfolio.github).pathname.split("/")[1];
const repositorySchema = z.object({
  id: z.number(),
  name: z.string().max(200),
  full_name: z.string(),
  owner: z.object({ login: z.string() }),
  private: z.boolean(),
  fork: z.boolean(),
  archived: z.boolean(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number().nonnegative(),
  pushed_at: z.string().nullable(),
  topics: z.array(z.string()).optional(),
});
export type GitHubRepository = {
  id: number;
  name: string;
  url: string;
  description: string;
  language: string | null;
  stars: number;
  pushedAt: string | null;
  topics: string[];
};
export type GitHubSnapshot = {
  status: "live" | "unavailable";
  repositories: GitHubRepository[];
  fetchedAt: string | null;
  message?: string;
};

export function parseRepositories(input: unknown): GitHubRepository[] {
  const rows = z.array(z.unknown()).parse(input);
  return rows.flatMap((row) => {
    const parsed = repositorySchema.safeParse(row);
    if (!parsed.success) return [];
    const repo = parsed.data;
    if (
      repo.private ||
      repo.fork ||
      repo.archived ||
      repo.owner.login.toLowerCase() !== githubOwner.toLowerCase()
    )
      return [];
    return [
      {
        id: repo.id,
        name: repo.name,
        url: `https://github.com/${githubOwner}/${encodeURIComponent(repo.name)}`,
        description: (repo.description || "").slice(0, 600),
        language: repo.language,
        stars: repo.stargazers_count,
        pushedAt:
          repo.pushed_at && Number.isFinite(Date.parse(repo.pushed_at))
            ? repo.pushed_at
            : null,
        topics: (repo.topics || []).slice(0, 10),
      },
    ];
  });
}

// Public endpoint only. Private repositories never enter automatic discovery.
// Next.js shares a five-minute cache across the UI and AI tools.
export async function getGitHubSnapshot(
  signal?: AbortSignal,
): Promise<GitHubSnapshot> {
  try {
    const repositories: GitHubRepository[] = [];
    for (let page = 1; page <= 3; page++) {
      const response = await fetch(
        `https://api.github.com/users/${githubOwner}/repos?type=owner&sort=pushed&per_page=100&page=${page}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          next: { revalidate: 300 },
          signal: signal
            ? AbortSignal.any([signal, AbortSignal.timeout(4500)])
            : AbortSignal.timeout(4500),
        },
      );
      if (!response.ok) throw new Error("GitHub unavailable");
      const rows: unknown = await response.json();
      repositories.push(...parseRepositories(rows));
      if (!Array.isArray(rows) || rows.length < 100) break;
    }
    return {
      status: "live",
      repositories,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return {
      status: "unavailable",
      repositories: [],
      fetchedAt: null,
      message:
        "GitHub updates are temporarily unavailable. Curated project details are still available.",
    };
  }
}
