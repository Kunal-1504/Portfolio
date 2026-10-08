import {
  FileText,
  Database,
  LockKeyhole,
  Bot,
  Workflow,
  BookOpen,
  Check,
  Smartphone,
  ShieldCheck,
  Mic,
  MessageSquare,
  Search,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";
import type { Project } from "@/data/portfolio";
export function ProjectArt({ project }: { project: Project }) {
  return (
    <div className={`project-art ${project.theme}`} aria-hidden="true">
      <span className="art-label">
        <span className="status-dot" />
        {project.artLabel}
      </span>
      {project.theme === "platform" ? (
        <div className="platform-art">
          <div className="platform-docs">
            <FileText size={21} />
            <FileText size={21} />
            <FileText size={21} />
          </div>
          <span className="platform-line" />
          <div className="platform-core">
            <Database size={29} />
            <span>
              <LockKeyhole size={11} />
            </span>
          </div>
          <span className="platform-caption">
            INGEST · RETRIEVE · UNDERSTAND
          </span>
        </div>
      ) : project.id === "lakshya" ? (
        <div className="lakshya-art">
          <div className="lakshya-search">
            <Search size={13} />
            <span>Your next opportunity</span>
          </div>
          <div className="lakshya-pipeline">
            <span>
              <BriefcaseBusiness size={20} />
              <small>Discover</small>
            </span>
            <ArrowRight size={13} />
            <span>
              <FileText size={20} />
              <small>Tailor</small>
            </span>
            <ArrowRight size={13} />
            <span>
              <ShieldCheck size={20} />
              <small>Review</small>
            </span>
          </div>
          <div className="lakshya-evidence">
            <Check size={11} />
            Built from your evidence
          </div>
        </div>
      ) : project.id === "interview" ? (
        <div className="interview-art">
          <div className="interview-context">
            <FileText size={15} />
            <span>Résumé + role</span>
          </div>
          <div className="interview-conversation">
            <span>
              <Mic size={22} />
            </span>
            <div>
              <MessageSquare size={15} />
              <i />
              <i />
            </div>
          </div>
          <div className="interview-rubric">
            {["Relevance", "Evidence", "Structure", "Clarity"].map((label) => (
              <span key={label}>
                <Check size={10} />
                {label}
              </span>
            ))}
          </div>
        </div>
      ) : project.id === "cloud" ? (
        <svg className="chart-art" viewBox="0 0 240 100">
          <path
            className="chart-area"
            d="M0 75 C20 78 25 62 40 60 S65 70 80 60 S100 33 120 35 S145 50 160 38 S185 30 200 17 S225 5 240 8 V100 H0Z"
          />
          <path d="M0 75 C20 78 25 62 40 60 S65 70 80 60 S100 33 120 35 S145 50 160 38 S185 30 200 17 S225 5 240 8" />
          <path
            d="M0 91H240M0 52H240M0 13H240"
            style={{ stroke: "#ffffff80", strokeWidth: 1 }}
          />
        </svg>
      ) : project.id === "midc" ? (
        <div className="agent-nodes">
          <span>
            <Bot size={19} />
          </span>
          <span>
            <Workflow size={28} />
          </span>
          <span>
            <Bot size={19} />
          </span>
        </div>
      ) : project.theme === "documents" ? (
        <div className="document-art">
          <div className="document-page">
            <FileText size={29} />
            <span />
            <span />
            <span />
          </div>
          <div className="document-answer">
            <BookOpen size={19} />
            <span>
              Every answer,
              <br />a source.
            </span>
            <Check size={14} />
          </div>
        </div>
      ) : project.theme === "guardian" ? (
        <div className="guardian-art">
          <div className="guardian-orbit" />
          <Smartphone size={74} strokeWidth={1} />
          <span className="guardian-shield">
            <ShieldCheck size={29} strokeWidth={1.5} />
          </span>
        </div>
      ) : (
        <svg className="pose-art" viewBox="0 0 240 120">
          <path d="M120 30v35m0-22-36 10-20-24m56 14 33 10 24-24m-57 36-29 19-21 29m50-48 30 18 20 30" />
          <circle cx="120" cy="18" r="10" />
          {[
            [120, 43],
            [84, 53],
            [153, 53],
            [120, 65],
            [91, 84],
            [150, 83],
            [64, 29],
            [177, 29],
            [70, 113],
            [170, 113],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" />
          ))}
        </svg>
      )}
    </div>
  );
}
