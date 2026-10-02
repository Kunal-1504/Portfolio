"use client";

import { ArrowUpRight, Code2, GitFork } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BuildPortfolio() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="build-portfolio-trigger">
          <Code2 size={15} />
          <span>Build your AI portfolio</span>
          <ArrowUpRight size={12} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <span className="eyebrow">MAKE IT YOURS</span>
        <DialogTitle className="mt-3 text-2xl font-semibold">
          Your story. Your AI portfolio.
        </DialogTitle>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Start with this portfolio’s source code, add your own work, and give
          visitors a new way to meet you.
        </p>
        <ol className="portfolio-build-steps">
          <li>
            <strong>1. Make a copy</strong>
            <span>Fork the repository into your GitHub account.</span>
          </li>
          <li>
            <strong>2. Add your story</strong>
            <span>
              Replace the profile, projects, avatar, and résumé with yours.
            </span>
          </li>
          <li>
            <strong>3. Bring it online</strong>
            <span>
              Follow the setup guide to connect an AI provider and deploy your
              site.
            </span>
          </li>
        </ol>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a
              href="https://github.com/Kunal-1504/Portfolio/fork"
              target="_blank"
              rel="noreferrer"
            >
              <GitFork size={15} /> Start on GitHub <ArrowUpRight size={14} />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://github.com/Kunal-1504/Portfolio#readme"
              target="_blank"
              rel="noreferrer"
            >
              Setup guide <ArrowUpRight size={14} />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
