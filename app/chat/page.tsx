import { Suspense } from "react";
import type { Metadata } from "next";
import { getChatMode } from "@/lib/chat-config";
import { Chat } from "@/components/chat";
export const metadata: Metadata = {
  title: "Chat with Kunal — AI Portfolio",
  alternates: { canonical: "/chat" },
  robots: { index: false, follow: true },
};
export const dynamic = "force-dynamic";
export default function ChatPage() {
  const mode = getChatMode();
  return (
    <Suspense
      fallback={
        <main id="main" className="chat-empty">
          Opening our conversation…
        </main>
      }
    >
      <Chat initialMode={mode} />
    </Suspense>
  );
}
