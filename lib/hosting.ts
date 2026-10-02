export const isPages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "github-pages";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const backend = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
export const hasChatBackend = !isPages || Boolean(backend);
export function publicPath(path: string): string {
  return `${basePath}${path}`;
}
export function apiPath(path: string): string {
  return backend ? `${backend}${path}` : publicPath(path);
}
