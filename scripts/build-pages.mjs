import { cp, mkdir, rm, symlink, writeFile, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
const root = process.cwd();
const stage = path.join(root, ".pages-build");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Portfolio";
const backend = process.env.NEXT_PUBLIC_API_BASE_URL || "";
if (backend && new URL(backend).protocol !== "https:")
  throw new Error("The public AI backend must use HTTPS.");
await rm(stage, { recursive: true, force: true });
await mkdir(stage);
// Isolated export: never move live routes, read local key files, or alter the
// regular .next output used by the local Next.js server.
for (const item of [
  "app",
  "components",
  "data",
  "lib",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next-env.d.ts",
  "next.config.ts",
  "postcss.config.mjs",
]) {
  await cp(path.join(root, item), path.join(stage, item), {
    recursive: true,
    filter: (source) => source !== path.join(root, "app", "api"),
  });
}
await mkdir(path.join(stage, "public"));
for (const item of ["assets", "avatar-kunal-selected.png"])
  await cp(path.join(root, "public", item), path.join(stage, "public", item), {
    recursive: true,
  });
await symlink(
  path.join(root, "node_modules"),
  path.join(stage, "node_modules"),
  "dir",
);
await writeFile(
  path.join(stage, "app", "page.tsx"),
  'import { Landing } from "@/components/landing";\nexport default function HomePage() { return <Landing />; }\n',
);
await writeFile(
  path.join(stage, "app", "chat", "page.tsx"),
  'import { Suspense } from "react";\nimport { Chat } from "@/components/chat";\nexport default function ChatPage() { return <Suspense fallback={<main>Opening the portfolio…</main>}><Chat initialMode="unconfigured" /></Suspense>; }\n',
);
const social = path.join(stage, "app", "opengraph-image.tsx");
await writeFile(
  social,
  'export const dynamic = "force-static";\n' + (await readFile(social, "utf8")),
);
const env = {
  ...process.env,
  NEXT_PUBLIC_DEPLOY_TARGET: "github-pages",
  NEXT_PUBLIC_BASE_PATH: basePath,
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ||
    `https://kunal-1504.github.io${basePath}`,
  NEXT_PUBLIC_API_BASE_URL: backend,
};
for (const key of [
  "OPENAI_API_KEY",
  "GROQ_API_KEY",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "OPENAI_BASE_URL",
  "CHAT_DEMO_MODE",
])
  delete env[key];
const result = spawnSync(
  process.execPath,
  [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"],
  { cwd: stage, env, stdio: "inherit" },
);
if (result.status !== 0) process.exit(result.status || 1);
await rm(path.join(root, "out"), { recursive: true, force: true });
await cp(path.join(stage, "out"), path.join(root, "out"), { recursive: true });
await writeFile(path.join(root, "out", ".nojekyll"), "");
console.log(`GitHub Pages export ready at out/ (base path: ${basePath}).`);
