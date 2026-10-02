"use client";
import { publicPath } from "@/lib/hosting";
import Link from "next/link";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { portfolio } from "@/data/portfolio";
import { BuildPortfolio } from "@/components/build-portfolio";
const subscribe = (callback: () => void) => {
  window.addEventListener("theme-change", callback);
  return () => window.removeEventListener("theme-change", callback);
};
export function SiteHeader() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    window.dispatchEvent(new Event("theme-change"));
  }
  return (
    <header className="site-header">
      <div className="header-brand-group">
        <Link href="/" className="brand" aria-label="Kunal home">
          <span className="brand-mark">
            k<span>↗</span>
          </span>
          <span>
            Kunal<span className="brand-period">.</span>
          </span>
        </Link>
        <BuildPortfolio />
      </div>
      <div className="header-actions">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </Button>
        <span className="header-divider" />
        <Button variant="outline" size="sm" asChild>
          <a href={publicPath(portfolio.resume)} download>
            Résumé <ArrowUpRight size={14} />
          </a>
        </Button>
      </div>
    </header>
  );
}
