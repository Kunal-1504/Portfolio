"use client";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, MapPin } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { ChatInput } from "@/components/chat-input";
import { QuickQuestions } from "@/components/quick-questions";
import { portfolio } from "@/data/portfolio";
import { publicPath } from "@/lib/hosting";
const fade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
export function Landing() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    router.prefetch("/chat");
  }, [router]);
  function warmQuestion(question: string) {
    router.prefetch(`/chat?query=${encodeURIComponent(question)}`);
  }
  function ask(question: string) {
    startTransition(() =>
      router.push(`/chat?query=${encodeURIComponent(question)}`),
    );
  }
  return (
    <>
      <main id="main" className="landing">
        <div
          className="hero-liquid-background"
          style={{
            backgroundImage: `url("${publicPath("/assets/hero-liquid-smoke-v1.png")}")`,
          }}
          aria-hidden="true"
        />
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.055 } } }}
        >
          <motion.button
            variants={fade}
            className="availability-pill"
            onClick={() => ask("Are you available for work?")}
          >
            <span className="status-dot" />
            Open to opportunities
            <ArrowUpRight size={12} />
          </motion.button>
          <motion.p variants={fade} className="hero-greeting">
            Hey, I’m Kunal <span className="wave">👋</span>
          </motion.p>
          <motion.h1 variants={fade}>
            AI Engineer<span className="headline-dot">.</span>
          </motion.h1>
          <motion.p variants={fade} className="hero-description">
            A little human. A little AI. A lot of possibility.
          </motion.p>
          <motion.button
            variants={fade}
            className="current-role-link"
            disabled={pending}
            onClick={() =>
              ask(
                "Tell me about your experience at Stark Digital Media Services",
              )
            }
            onPointerEnter={() =>
              warmQuestion(
                "Tell me about your experience at Stark Digital Media Services",
              )
            }
            onFocus={() =>
              warmQuestion(
                "Tell me about your experience at Stark Digital Media Services",
              )
            }
          >
            At {portfolio.experience[0].company} · Since June 2026
            <ArrowUpRight size={12} />
          </motion.button>
          <motion.div variants={fade} className="hero-portrait">
            <Avatar />
          </motion.div>
          <motion.div variants={fade} className="hero-interaction">
            <ChatInput home onSend={ask} disabled={pending} />
            <div className="explore-caption">
              {pending
                ? "Opening our conversation…"
                : "Not sure where to start? Pick a little curiosity."}
            </div>
            <QuickQuestions
              onSelect={ask}
              onIntent={warmQuestion}
              disabled={pending}
            />
          </motion.div>
          <motion.p variants={fade} className="hero-footnote">
            <button
              className="flagship-link"
              disabled={pending}
              onPointerEnter={() =>
                warmQuestion("Tell me about your Document Management System")
              }
              onFocus={() =>
                warmQuestion("Tell me about your Document Management System")
              }
              onClick={() =>
                ask("Tell me about your Document Management System")
              }
            >
              <span className="status-dot" />
              Inside my biggest build: Document Management System
              <ArrowUpRight size={12} />
            </button>
          </motion.p>
        </motion.div>
      </main>
      <footer className="site-footer">
        <span>
          <MapPin size={13} />
          Pune, India <span className="footer-dot">·</span> Building for
          everywhere
        </span>
        <div>
          <span className="footer-label">Let’s connect</span>
          <a
            href={portfolio.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Kunal on GitHub"
          >
            <Github size={17} />
          </a>
          <a
            href={portfolio.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="Kunal on LinkedIn"
          >
            <Linkedin size={17} />
          </a>
          <span className="footer-divider" />
          <span>
            Made of code & curiosity<span className="footer-star">✳</span>
          </span>
        </div>
      </footer>
    </>
  );
}
