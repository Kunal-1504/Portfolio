"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Github,
  RefreshCw,
  Star,
  GitBranch,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLiveData } from "@/components/live-data";
import { portfolio } from "@/data/portfolio";
export function GitHubActivity({ compact = false }: { compact?: boolean }) {
  const { snapshot, refreshing, refresh } = useLiveData();
  const [open, setOpen] = useState(!compact);
  const reduced = useReducedMotion();
  const repos = snapshot.repositories;
  const known = new Set(
    portfolio.projects.map((project) => project.github.toLowerCase()),
  );
  const extra = repos.filter(
    (repo) =>
      !known.has(repo.url.toLowerCase()) &&
      repo.name.toLowerCase() !== "portfolio",
  );
  const shown = compact ? repos.slice(0, 3) : extra;
  return (
    <section
      className={`github-activity ${compact ? "github-compact" : ""}`}
      aria-label="GitHub updates"
    >
      <div className="github-activity-heading">
        <button
          className="github-toggle"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Github size={14} />
          <span>
            {refreshing && !repos.length
              ? "Connecting to GitHub…"
              : snapshot.status === "live"
                ? `${repos.length} public repositories · GitHub connected`
                : "GitHub updates unavailable"}
          </span>
          <ChevronDown
            size={13}
            style={{ transform: open ? "rotate(180deg)" : undefined }}
          />
        </button>
        <button
          className="github-refresh"
          aria-label="Refresh GitHub updates"
          disabled={refreshing}
          onClick={refresh}
        >
          <motion.span
            animate={refreshing && !reduced ? { rotate: 360 } : { rotate: 0 }}
            transition={{
              duration: 1,
              repeat: refreshing ? Infinity : 0,
              ease: "linear",
            }}
          >
            <RefreshCw size={12} />
          </motion.span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="github-activity-body"
          >
            {!compact && <p>New public projects appear here automatically.</p>}
            {shown.map((repo) => (
              <a
                className="github-repo-row"
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
              >
                <GitBranch size={14} />
                <div>
                  <strong>{repo.name.replace(/-/g, " ")}</strong>
                  {!compact && (
                    <p>
                      {repo.description || "Explore the repository on GitHub."}
                    </p>
                  )}
                  <span>
                    {repo.language || "Repository"}
                    {repo.pushedAt &&
                      ` · Pushed ${new Date(repo.pushedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`}
                  </span>
                </div>
                <span className="repo-stars">
                  <Star size={11} />
                  {repo.stars}
                </span>
                <ArrowUpRight size={13} />
              </a>
            ))}
            {!shown.length && snapshot.status === "live" && (
              <p>Your public projects are already in the gallery above.</p>
            )}
            {snapshot.status !== "live" && (
              <p role="status">
                {snapshot.message || "Waiting for GitHub."}
                {repos.length > 0 && " Showing the last successful snapshot."}
              </p>
            )}
            <small>
              Public metadata refreshes every 5 minutes.
              {snapshot.fetchedAt &&
                ` Last checked ${new Date(snapshot.fetchedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })} IST.`}
            </small>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
