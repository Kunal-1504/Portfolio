"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  BrainCircuit,
  Code2,
  Eye,
  Layers3,
  Search,
  Terminal,
  Workflow,
  X,
} from "lucide-react";
import {
  allSkills,
  categoryDetails,
  filterSkills,
  projectsForSkill,
  skillCategories,
  type SkillCategory,
} from "@/lib/skills";
import { portfolio } from "@/data/portfolio";
import { useLiveData } from "@/components/live-data";
const icons = {
  Languages: Code2,
  "Agentic AI": BrainCircuit,
  "Computer Vision": Eye,
  "ML & Forecasting": Workflow,
  "Backend / Frontend": Layers3,
  Tools: Terminal,
};
export function SkillsExplorer({
  onAsk,
}: {
  onAsk?: (question: string) => void;
}) {
  const [category, setCategory] = useState<SkillCategory>("Agentic AI");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("LangGraph");
  const reduced = useReducedMotion();
  const id = useId();
  const { snapshot } = useLiveData();
  const detail = categoryDetails[category];
  const Icon = icons[category];
  const skills = filterSkills(query, category);
  const matches = projectsForSkill(selected);
  const nodes = portfolio.skills[category].slice(0, 6);
  function selectCategory(next: SkillCategory) {
    setCategory(next);
    setQuery("");
    setSelected(portfolio.skills[next][0]);
  }
  const languages = [
    ...new Set(
      snapshot.repositories
        .map((repo) => repo.language)
        .filter((name): name is string => !!name),
    ),
  ];
  return (
    <section
      className={`skills-explorer skill-tone-${detail.color}`}
      aria-label="Interactive skills explorer"
    >
      <div className="skills-heading">
        <div>
          <span className="eyebrow">THE TOOLKIT, CONNECTED</span>
          <h2>
            Not just a stack.
            <br />
            <span>A system of possibilities.</span>
          </h2>
        </div>
        <span className="skills-count">
          <strong>{allSkills.length}</strong>skills · {skillCategories.length}{" "}
          disciplines
        </span>
      </div>
      <div className="skill-category-tabs" aria-label="Skill categories">
        {skillCategories.map((name) => {
          const CategoryIcon = icons[name];
          return (
            <button
              key={name}
              aria-pressed={category === name}
              onClick={() => selectCategory(name)}
            >
              <CategoryIcon size={15} />
              <span>{name}</span>
              <small>{portfolio.skills[name].length}</small>
            </button>
          );
        })}
      </div>
      <div className="skills-stage">
        <div className="skill-network" aria-hidden="true">
          <svg viewBox="0 0 360 240" className="network-lines">
            <defs>
              <radialGradient id={id}>
                <stop stopColor="currentColor" stopOpacity=".13" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="180" cy="120" r="116" fill={`url(#${id})`} />
            <circle
              cx="180"
              cy="120"
              r="84"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".1"
              strokeDasharray="3 5"
            />
            {nodes.map((skill, index) => {
              const angle = (index * Math.PI * 2) / nodes.length - Math.PI / 2;
              const x = 180 + Math.cos(angle) * 127;
              const y = 120 + Math.sin(angle) * 82;
              return (
                <motion.path
                  key={`${category}-${skill}`}
                  d={`M180 120 Q${180 + (x - 180) * 0.2} ${y} ${x} ${y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={skill === selected ? 1.6 : 1}
                  opacity={skill === selected ? 0.6 : 0.18}
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.035 }}
                />
              );
            })}
          </svg>
          <motion.div
            key={category}
            className="network-core"
            initial={reduced ? false : { scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Icon size={29} strokeWidth={1.4} />
          </motion.div>
          {nodes.map((skill, index) => {
            const angle = (index * Math.PI * 2) / nodes.length - Math.PI / 2;
            return (
              <motion.span
                className={`network-node ${selected === skill ? "is-selected" : ""}`}
                key={`${category}-${skill}`}
                style={{
                  left: `${50 + Math.cos(angle) * 35}%`,
                  top: `${50 + Math.sin(angle) * 34}%`,
                }}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                {skill}
              </motion.span>
            );
          })}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="skill-stage-copy"
            key={category}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span className="eyebrow">{category}</span>
            <h3>{detail.title}</h3>
            <p>{detail.description}</p>
            <span className="stage-instruction">
              <Boxes size={13} />
              Select a tool to see where I use it.
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="skills-search">
        <Search size={16} />
        <label className="sr-only" htmlFor={`${id}-search`}>
          Search all skills
        </label>
        <input
          id={`${id}-search`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a skill across my toolkit…"
        />
        {query && (
          <button aria-label="Clear skill search" onClick={() => setQuery("")}>
            <X size={14} />
          </button>
        )}
      </div>
      <div className="skill-tiles" aria-label="Select a skill">
        {skills.map((skill) => {
          const SkillIcon = icons[skill.category];
          return (
            <motion.button
              key={skill.name}
              whileHover={reduced ? {} : { y: -3 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={selected === skill.name}
              onClick={() => {
                setSelected(skill.name);
                setCategory(skill.category);
              }}
            >
              <span className="skill-tile-icon">
                <SkillIcon size={17} strokeWidth={1.6} />
              </span>
              <span>{skill.name}</span>
              <ArrowUpRight size={12} />
            </motion.button>
          );
        })}
        {skills.length === 0 && (
          <p className="skills-empty" role="status">
            No skill matches “{query}”. Try Python, RAG, or React.
          </p>
        )}
      </div>
      <div className="skill-evidence" aria-live="polite">
        <div>
          <span className="eyebrow">{selected} IN PRACTICE</span>
          <span className="evidence-count">
            {matches.length
              ? `${matches.length} linked ${matches.length === 1 ? "project" : "projects"}`
              : "Part of my toolkit"}
          </span>
        </div>
        {matches.length ? (
          <div className="skill-project-links">
            {matches.map((project) => (
              <button
                key={project.id}
                onClick={() =>
                  onAsk?.(`Tell me how you use ${selected} in ${project.title}`)
                }
                disabled={!onAsk}
              >
                <span>{project.title}</span>
                <ArrowUpRight size={13} />
              </button>
            ))}
          </div>
        ) : (
          <p>
            This skill is listed in my toolkit; no specific project stack is
            linked yet.
          </p>
        )}
      </div>
      {languages.length > 0 && (
        <div className="github-languages">
          <span className="status-dot" />
          <span>
            Languages currently detected on GitHub: {languages.join(" · ")}
          </span>
        </div>
      )}
    </section>
  );
}
