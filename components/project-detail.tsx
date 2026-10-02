"use client";
import { useId, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  Layers,
  Database,
  Sparkles,
  ShieldCheck,
  ChartNoAxesCombined,
  Eye,
  Smartphone,
  Github,
  Mail,
  LockKeyhole,
  BookOpen,
} from "lucide-react";
import { portfolio, type Project } from "@/data/portfolio";
import { projectStories } from "@/data/project-stories";
import { ProjectArt } from "@/components/project-art";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const icons = {
  file: FileText,
  layers: Layers,
  database: Database,
  sparkles: Sparkles,
  shield: ShieldCheck,
  chart: ChartNoAxesCombined,
  eye: Eye,
  phone: Smartphone,
};
export function ProjectDetail({ project }: { project: Project }) {
  const story = projectStories[project.id];
  const [stage, setStage] = useState(0);
  const panelId = useId();
  const current = story.flow[stage];
  const Icon = icons[current.icon];
  return (
    <article className={`case-study case-${project.theme}`}>
      <header className="case-header">
        <span className="eyebrow">PROJECT DEEP DIVE</span>
        <span className="case-evidence">
          <BookOpen size={12} />
          {story.evidence}
        </span>
        <DialogTitle>{project.title}</DialogTitle>
        <p>{story.summary}</p>
        <span className="project-status">{project.status}</span>
      </header>
      <div className="case-overview">
        <ProjectArt project={project} />
        <dl className="case-facts">
          {story.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <section className="case-section" aria-label="Project architecture">
        <div className="case-section-heading">
          <div>
            <span className="eyebrow">FOLLOW THE FLOW</span>
            <h3>How it works</h3>
          </div>
          <span>Select a step to explore</span>
        </div>
        <div className="case-flow" role="group" aria-label="Architecture steps">
          {story.flow.map((step, index) => {
            const StepIcon = icons[step.icon];
            return (
              <div className="case-step-wrap" key={step.label}>
                <button
                  className="case-step"
                  aria-pressed={stage === index}
                  aria-controls={panelId}
                  onClick={() => setStage(index)}
                >
                  <span className="case-step-number">0{index + 1}</span>
                  <StepIcon size={25} strokeWidth={1.5} />
                  <strong>{step.label}</strong>
                </button>
                {index < story.flow.length - 1 && (
                  <ArrowRight
                    className="case-flow-arrow"
                    size={16}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div
          id={panelId}
          className="case-step-description"
          aria-live="polite"
          aria-atomic="true"
        >
          <Icon size={22} />
          <div>
            <strong>{current.label}</strong>
            <p>{current.detail}</p>
          </div>
        </div>
      </section>
      <section className="case-section" aria-label="Key project findings">
        <div className="case-section-heading">
          <div>
            <span className="eyebrow">THE DETAILS THAT MATTER</span>
            <h3>What’s inside</h3>
          </div>
        </div>
        <ul className="case-findings">
          {story.findings.map((finding, index) => (
            <li key={finding.title}>
              <span className="case-finding-index">0{index + 1}</span>
              <div>
                <h4>{finding.title}</h4>
                <p>{finding.text}</p>
              </div>
              <Check size={14} aria-hidden="true" />
            </li>
          ))}
        </ul>
      </section>
      <section className="case-section" aria-label="Technology stack">
        <h3>Built with</h3>
        <div className="badges">
          {project.stack.map((tech) => (
            <span className="badge" key={tech}>
              {tech}
            </span>
          ))}
        </div>
      </section>
      <section className="case-sources" aria-label="Evidence and project scope">
        <h3>Build status & sources</h3>
        <p>{story.scope}</p>
        <div className="case-source-links">
          {story.sources.map((source) =>
            source.url ? (
              <a
                key={source.label}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <Github size={13} />
                {source.label}
                <ArrowUpRight size={12} />
              </a>
            ) : (
              <span key={source.label}>
                <BookOpen size={13} />
                {source.label}
              </span>
            ),
          )}
        </div>
        <small>
          Reviewed 1 October 2026 · Diagrams summarize the implementation; they
          are not performance benchmarks.
        </small>
      </section>
      <footer className="case-footer">
        {project.id === "dms" ? (
          <>
            <span>
              <LockKeyhole size={14} />
              Private source · walkthrough available
            </span>
            <Button asChild>
              <a
                href={`mailto:${portfolio.email}?subject=${encodeURIComponent("Document Management System walkthrough")}`}
              >
                <Mail size={14} />
                Discuss this project
              </a>
            </Button>
          </>
        ) : project.id === "workout" ? (
          <Button asChild>
            <a
              href={`mailto:${portfolio.email}?subject=Workout%20tracker%20walkthrough`}
            >
              <Mail size={14} />
              Ask for a walkthrough
            </a>
          </Button>
        ) : (
          <Button asChild>
            <a href={project.github} target="_blank" rel="noreferrer">
              <Github size={15} />
              Explore the repository
              <ArrowUpRight size={14} />
            </a>
          </Button>
        )}
      </footer>
    </article>
  );
}
