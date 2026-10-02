"use client";
import { publicPath } from "@/lib/hosting";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Trophy,
} from "lucide-react";
import { portfolio, type PortfolioToolName } from "@/data/portfolio";
import { SkillsExplorer } from "@/components/skills-explorer";
import { Projects } from "@/components/projects";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
function Badges({ items }: { items: readonly string[] }) {
  return (
    <div className="badges">
      {items.map((item) => (
        <span className="badge" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}
function Presentation() {
  return (
    <section className="rich-card">
      <div className="about-header">
        <Avatar small />
        <div>
          <h2>{portfolio.name}</h2>
          <p>
            {portfolio.role} · {portfolio.specialty}
          </p>
        </div>
      </div>
      <p>{portfolio.bio}</p>
      <div className="location-line">
        <MapPin size={13} />
        {portfolio.location}
      </div>
      <div className="education-row">
        <GraduationCap size={22} />
        <div>
          {portfolio.education.degree}
          <span>
            {portfolio.education.institution} · Class of{" "}
            {portfolio.education.year} · {portfolio.education.grade}
          </span>
        </div>
      </div>
    </section>
  );
}
function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("failed");
    }
  }
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={copy}
        aria-label={`Copy ${label}`}
      >
        {state === "copied" ? <Check size={14} /> : <Copy size={14} />}
      </Button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? `${label} copied`
          : state === "failed"
            ? "Copy unavailable. Select and copy the text manually."
            : ""}
      </span>
      {state === "failed" && (
        <span className="text-[10px]">Select text to copy</span>
      )}
    </>
  );
}
function Contact() {
  return (
    <section className="rich-card">
      <span className="eyebrow">GOOD THINGS START WITH HELLO</span>
      <h2>Let’s build something.</h2>
      <p>
        Have an interesting problem, a role, or just a question? My inbox is
        open.
      </p>
      <div className="contact-row">
        <Mail size={16} />
        <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
        <CopyButton value={portfolio.email} label="email" />
      </div>
      <div className="contact-row">
        <Phone size={16} />
        <a href={`tel:${portfolio.phone.replace(/\s/g, "")}`}>
          {portfolio.phone}
        </a>
        <CopyButton value={portfolio.phone} label="phone number" />
      </div>
      <div className="contact-row">
        <Github size={16} />
        <a href={portfolio.github} target="_blank" rel="noreferrer">
          GitHub · Kunal-1504
        </a>
        <CopyButton value={portfolio.github} label="GitHub link" />
      </div>
      <div className="contact-row">
        <Linkedin size={16} />
        <a href={portfolio.linkedin} target="_blank" rel="noreferrer">
          LinkedIn · Kunal Deshmukh
        </a>
        <CopyButton value={portfolio.linkedin} label="LinkedIn link" />
      </div>
    </section>
  );
}
function Resume() {
  return (
    <section className="rich-card resume-card">
      <div className="resume-icon">
        <FileText size={32} strokeWidth={1.4} />
      </div>
      <div>
        <span className="eyebrow">THE CLASSIC VERSION</span>
        <h2>{portfolio.name}</h2>
        <p>My experience, education, and skills in one place. DOCX.</p>
        <Button asChild size="sm">
          <a href={publicPath(portfolio.resume)} download>
            <Download size={14} />
            Download résumé
          </a>
        </Button>
      </div>
    </section>
  );
}
function Availability() {
  return (
    <section className="rich-card availability-card">
      <span className="eyebrow">
        <span className="status-dot mr-2" />
        OPEN TO OPPORTUNITIES
      </span>
      <h2>Let’s make something matter.</h2>
      <p>{portfolio.availability}</p>
      <div className="availability-options">
        <Badges
          items={["Full-time AI / ML", "Freelance & contract", "Remote-first"]}
        />
      </div>
      <Button size="sm" asChild>
        <a href={`mailto:${portfolio.email}`}>
          Let’s talk
          <ArrowUpRight size={14} />
        </a>
      </Button>
    </section>
  );
}
function Fun() {
  return (
    <section className="rich-card fun-card">
      <div className="fun-icon">
        <Trophy size={25} />
      </div>
      <span className="eyebrow">BEYOND THE CODE</span>
      <h2>{portfolio.fun.title}</h2>
      <p>{portfolio.fun.fact}</p>
      <p>{portfolio.fun.aside}</p>
    </section>
  );
}
const cards = {
  getPresentation: Presentation,
  getProjects: Projects,
  getSkills: SkillsExplorer,
  getResume: Resume,
  getContact: Contact,
  getAvailability: Availability,
  getCrazy: Fun,
};
export function ToolCard({
  name,
  onAsk,
}: {
  name: PortfolioToolName;
  onAsk?: (question: string) => void;
}) {
  if (name === "getSkills") return <SkillsExplorer onAsk={onAsk} />;
  const Card = cards[name];
  return Card ? <Card /> : null;
}
