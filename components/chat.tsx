"use client";
import { apiPath, hasChatBackend, isPages, publicPath } from "@/lib/hosting";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart, getToolName } from "ai";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Markdown from "react-markdown";
import {
  createInstantExchange,
  type PortfolioMessage,
} from "@/lib/instant-chat";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/chat-input";
import { QuickQuestions } from "@/components/quick-questions";
import { previewAnswer } from "@/lib/answers";
import { hideProjectNarration } from "@/lib/project-presentation";
import { ToolCard } from "@/components/tool-cards";
import { portfolio, toolNames, type PortfolioToolName } from "@/data/portfolio";
const transport = new DefaultChatTransport({
  api: apiPath("/api/chat"),
  prepareSendMessagesRequest: ({ messages }) => ({
    body: { messages: messages.slice(-40) },
  }),
});
export function Chat({
  initialMode,
}: {
  initialMode: "live" | "demo" | "unconfigured";
}) {
  const [mode, setMode] = useState(initialMode);
  const demo = mode === "demo";
  const params = useSearchParams();
  const router = useRouter();
  const [exploreTool, setExploreTool] = useState<PortfolioToolName>(
    () =>
      previewAnswer(params.get("query") || "Who are you?").tool ||
      "getPresentation",
  );
  useEffect(() => {
    if (mode !== "unconfigured" || !hasChatBackend) return;
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch(apiPath("/api/status"), {
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.ok) {
          const result = await response.json();
          if (["live", "demo", "unconfigured"].includes(result.mode))
            setMode(result.mode);
        }
      } catch {}
    };
    void refresh();
    const timer = setInterval(() => void refresh(), 15000);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [mode]);
  const [initialMessages] = useState(
    () =>
      createInstantExchange((params.get("query") || "").slice(0, 2000), demo) ||
      [],
  );
  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    regenerate,
    setMessages,
    clearError,
  } = useChat<PortfolioMessage>({ transport, messages: initialMessages });
  const busy = status === "submitted" || status === "streaming";
  const initialSent = useRef(initialMessages.length > 0);
  const bottom = useRef<HTMLDivElement>(null);
  const shouldScroll = useRef(true);
  const reduced = useReducedMotion();
  useEffect(() => {
    const query = params.get("query");
    if (mode !== "unconfigured" && query && !initialSent.current) {
      initialSent.current = true;
      void sendMessage({ text: query.slice(0, 2000) });
    }
  }, [params, sendMessage, mode]);
  useEffect(() => {
    const track = () => {
      shouldScroll.current =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 280;
    };
    window.addEventListener("scroll", track, { passive: true });
    return () => window.removeEventListener("scroll", track);
  }, []);
  useEffect(() => {
    if (shouldScroll.current)
      bottom.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
  }, [messages, status, reduced]);
  function ask(text: string) {
    if (busy) return;
    if (mode === "unconfigured") {
      setExploreTool(previewAnswer(text).tool || "getPresentation");
      shouldScroll.current = true;
      return;
    }
    clearError();
    shouldScroll.current = true;
    const instant = createInstantExchange(text, demo);
    if (instant) setMessages((previous) => [...previous, ...instant]);
    else void sendMessage({ text });
  }
  function reset() {
    void stop();
    setMessages([]);
    setExploreTool("getPresentation");
    clearError();
    initialSent.current = true;
    shouldScroll.current = true;
    router.replace("/chat", { scroll: false });
  }
  return (
    <main id="main" className="chat-shell">
      <div className="chat-topbar">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft size={14} />
            Back home
          </Link>
        </Button>
        <div className="chat-identity">
          <Avatar small thinking={busy} />
          <span className="identity-title">Kunal’s AI twin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="chat-mode">
            <span className="status-dot" />
            {mode === "unconfigured"
              ? "Portfolio explorer"
              : demo
                ? "Demo mode"
                : "Live AI"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            aria-label="New conversation"
          >
            <RotateCcw size={15} />
          </Button>
        </div>
      </div>
      {mode === "unconfigured" && (
        <div className="ai-connection-notice" role="status">
          <Sparkles size={17} />
          <div>
            <strong>
              {isPages && hasChatBackend
                ? "Connecting to live AI…"
                : "Live AI isn’t connected yet."}
            </strong>
            <p>
              You can still explore the interactive cards. Chat activates when
              the server’s AI connection is configured.
            </p>
          </div>
        </div>
      )}
      <div
        className="conversation"
        role="log"
        aria-label="Conversation with Kunal"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {mode === "unconfigured" && (
          <ToolCard key={exploreTool} name={exploreTool} onAsk={ask} />
        )}
        {messages.length === 0 && mode !== "unconfigured" && (
          <div className="chat-empty">
            <Sparkles className="mx-auto text-[#a493bc]" size={29} />
            <h1>Curiosity looks good on you.</h1>
            <p>Ask about my projects, my skills, or the person behind them.</p>
          </div>
        )}
        {messages.map((message, messageIndex) => (
          <motion.div
            initial={
              message.metadata?.source === "portfolio"
                ? false
                : { opacity: 0, y: 6 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            key={message.id}
            className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}
          >
            {message.role === "assistant" && (
              <div className="assistant-label">
                <Sparkles size={12} />
                Kunal<span>·</span>
                {message.metadata?.source === "portfolio"
                  ? "From my portfolio"
                  : demo
                    ? "Portfolio preview"
                    : "AI twin"}
              </div>
            )}
            {message.role === "user" ? (
              <p>
                {message.parts
                  .filter((p) => p.type === "text")
                  .map((p) => p.text)
                  .join("")}
              </p>
            ) : (
              <div>
                {message.parts.map((part, index) => {
                  if (
                    part.type === "text" &&
                    hideProjectNarration(
                      message.parts,
                      messages
                        .slice(0, messageIndex)
                        .findLast((item) => item.role === "user")
                        ?.parts.filter((part) => part.type === "text")
                        .map((part) => part.text)
                        .join(" ") || "",
                    )
                  )
                    return null;
                  if (part.type === "text")
                    return (
                      <div className="response-text" key={index}>
                        <Markdown
                          components={{
                            a: ({ children, href }) => (
                              <a
                                href={
                                  href?.startsWith("/")
                                    ? publicPath(href)
                                    : href
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {part.text}
                        </Markdown>
                      </div>
                    );
                  if (isToolUIPart(part)) {
                    const name = getToolName(part);
                    if (!toolNames.includes(name as PortfolioToolName))
                      return null;
                    if (part.state === "output-available")
                      return (
                        <ToolCard
                          name={name as PortfolioToolName}
                          onAsk={busy ? undefined : ask}
                          key={index}
                        />
                      );
                    if (part.state === "output-error")
                      return (
                        <p className="error-card" key={index}>
                          That card couldn’t load. Try asking again.
                        </p>
                      );
                    return (
                      <div className="tool-loading" key={index}>
                        Pulling that together…
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </motion.div>
        ))}
        {status === "submitted" && (
          <div
            role="status"
            aria-label="Kunal is thinking"
            className="thinking"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={
                  reduced ? {} : { opacity: [0.3, 1, 0.3], y: [0, -3, 0] }
                }
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.18,
                }}
              />
            ))}
          </div>
        )}
        {error && (
          <div className="error-card" role="alert">
            <p>
              My AI connection is taking a break. Try again, start a new
              conversation, or reach me directly.
            </p>
            <button
              onClick={() => {
                clearError();
                void regenerate();
              }}
            >
              Try again
            </button>
            <a className="underline" href={`mailto:${portfolio.email}`}>
              Email Kunal
            </a>
          </div>
        )}
        <div ref={bottom} className="chat-scroll-anchor" />
      </div>
      <nav className="chat-side-scroll" aria-label="Scroll conversation">
        <button
          aria-label="Scroll to top"
          onClick={() => {
            shouldScroll.current = false;
            window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
          }}
        >
          <ArrowUp size={17} />
        </button>
        <button
          aria-label="Scroll to latest message"
          onClick={() => {
            shouldScroll.current = true;
            bottom.current?.scrollIntoView({
              behavior: reduced ? "auto" : "smooth",
              block: "end",
            });
          }}
        >
          <ArrowDown size={17} />
        </button>
      </nav>
      <div className="chat-dock">
        <div className="chat-dock-inner">
          <div className="dock-explore">
            <QuickQuestions compact onSelect={ask} disabled={busy} />
            <div className="extra-questions">
              <button
                disabled={busy}
                onClick={() => ask("Can I download your resume?")}
              >
                Résumé
              </button>
              <button
                disabled={busy}
                onClick={() => ask("Are you available for work?")}
              >
                Availability
              </button>
            </div>
          </div>
          <ChatInput
            onSend={ask}
            busy={busy}
            disabled={mode === "unconfigured"}
            placeholder={
              mode === "unconfigured"
                ? "Explore the cards above · live chat not connected"
                : undefined
            }
            onStop={() => void stop()}
          />
          <p className="chat-disclaimer">
            {mode === "unconfigured"
              ? "Interactive portfolio · AI answers require a connected provider."
              : demo
                ? "Demo mode · Prepared answers, not live AI."
                : "Live AI grounded in my portfolio and current GitHub data. "}
            {mode === "live" && (
              <a className="underline" href={`mailto:${portfolio.email}`}>
                say hello
              </a>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
