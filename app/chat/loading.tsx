import { Sparkles } from "lucide-react";
export default function ChatLoading() {
  return (
    <main id="main" className="chat-shell" aria-busy="true">
      <div className="chat-topbar">
        <span className="text-xs text-muted-foreground">Kunal’s AI twin</span>
      </div>
      <div className="chat-empty" role="status">
        <Sparkles className="mx-auto text-[#a493bc]" size={28} />
        <h1>A little curiosity goes a long way.</h1>
        <p>Opening our conversation…</p>
      </div>
    </main>
  );
}
