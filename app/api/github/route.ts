import { getGitHubSnapshot } from "@/lib/github";
export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json(await getGitHubSnapshot(), {
    headers: { "Cache-Control": "no-store" },
  });
}
