import test from "node:test";
import assert from "node:assert/strict";
import { getGitHubSnapshot, parseRepositories } from "../lib/github";
import { filterSkills, projectsForSkill } from "../lib/skills";
const repo = {
  id: 1,
  name: "new-project",
  full_name: "Kunal-1504/new-project",
  owner: { login: "Kunal-1504" },
  private: false,
  fork: false,
  archived: false,
  description: "A new project",
  language: "TypeScript",
  stargazers_count: 2,
  pushed_at: "2026-10-01T00:00:00Z",
};
test("automatic discovery accepts public owned repositories and filters private, forked, archived, foreign, and malformed entries", () => {
  const result = parseRepositories([
    repo,
    { ...repo, id: 2, private: true },
    { ...repo, id: 3, fork: true },
    { ...repo, id: 4, archived: true },
    { ...repo, id: 5, owner: { login: "other" } },
    { id: 6 },
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].url, "https://github.com/Kunal-1504/new-project");
  assert.equal(result[0].stars, 2);
});
test("GitHub outages return explicit unavailable state without invented metadata", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response("", { status: 403 });
  try {
    const result = await getGitHubSnapshot();
    assert.equal(result.status, "unavailable");
    assert.deepEqual(result.repositories, []);
    assert.equal(result.fetchedAt, null);
  } finally {
    globalThis.fetch = original;
  }
});
test("GitHub snapshot includes newly discovered projects and uses bounded cached requests", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.match(String(url), /users\/Kunal-1504\/repos/);
    assert.equal(
      (options as RequestInit & { next: { revalidate: number } }).next
        .revalidate,
      300,
    );
    assert.ok(options?.signal);
    return Response.json([repo]);
  };
  try {
    const result = await getGitHubSnapshot();
    assert.equal(result.status, "live");
    assert.equal(result.repositories[0].name, "new-project");
    assert.ok(result.fetchedAt);
  } finally {
    globalThis.fetch = original;
  }
});
test("skills search crosses categories and project evidence follows actual stack data", () => {
  assert.deepEqual(
    filterSkills("python", "Agentic AI").map((skill) => skill.name),
    ["Python"],
  );
  assert.equal(filterSkills("no such skill", "Tools").length, 0);
  assert.ok(projectsForSkill("SQL").some((project) => project.id === "dms"));
  assert.ok(
    projectsForSkill("LangGraph").some((project) => project.id === "midc"),
  );
  assert.equal(projectsForSkill("Claude Code").length, 0);
});
