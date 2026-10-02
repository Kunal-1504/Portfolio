import { getChatMode } from "@/lib/chat-config";
export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json(
    { mode: getChatMode() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
