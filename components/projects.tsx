"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";

import { ProjectArt } from "@/components/project-art";
import { ProjectDetail } from "@/components/project-detail";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [filter, setFilter] = useState("All");
  const [position, setPosition] = useState({
    previous: false,
    next: true,
    active: 0,
  });
  const projects = portfolio.projects.filter(
    (project) => filter === "All" || project.group === filter,
  );
  const groups = [
    "All",
    ...new Set(portfolio.projects.map((project) => project.group)),
  ];
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      const card = node.querySelector<HTMLElement>(".project-card");
      const step = (card?.offsetWidth || 266) + 14;
      setPosition({
        previous: node.scrollLeft > 3,
        next: node.scrollLeft + node.clientWidth < node.scrollWidth - 3,
        active: Math.min(
          projects.length - 1,
          Math.round(node.scrollLeft / step),
        ),
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(node);
    node.addEventListener("scroll", update, { passive: true });
    const frame = requestAnimationFrame(update);
    return () => {
      observer.disconnect();
      node.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, [projects.length]);
  function scroll(direction: number) {
    const node = ref.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>(".project-card");
    node.scrollBy({
      left: direction * ((card?.offsetWidth || 266) + 14),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }
  return (
    <section className="projects-section" aria-label="Project gallery">
      <div className="project-header">
        <div>
          <span className="eyebrow">
            SELECTED WORK · {portfolio.projects.length} PROJECTS
          </span>
          <h2>Ideas, put to work.</h2>
        </div>
        <span className="gallery-hint">
          Open a card.
          <br />
          Explore the story.
        </span>
      </div>
      <div className="project-filters" aria-label="Filter projects">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => {
              setFilter(group);
              ref.current?.scrollTo({ left: 0, behavior: "instant" });
            }}
            aria-pressed={filter === group}
          >
            {group}
          </button>
        ))}
      </div>
      <div className="project-gallery-frame">
        <div
          id={id}
          className="project-carousel"
          ref={ref}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${filter} projects`}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              scroll(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          {projects.map((project) => {
            return (
              <Dialog key={project.id}>
                <DialogTrigger asChild>
                  <button
                    className={`project-card project-cover cover-${project.theme}`}
                    aria-label={`View ${project.title} details`}
                  >
                    <div className="cover-heading">
                      <span>{project.category}</span>
                      <h3>{project.title}</h3>
                    </div>
                    <ProjectArt project={project} />
                    <div className="cover-bottom">
                      <p>{project.shortTitle}</p>
                      <div className="cover-link">
                        <span>
                          {project.id === "dms"
                            ? "Flagship project"
                            : "Explore the story"}
                        </span>
                        <span className="cover-open">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent wide>
                  <ProjectDetail project={project} />
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </div>
      <div className="gallery-footer">
        <span>
          {projects.length} {projects.length === 1 ? "project" : "projects"} ·
          Swipe or use the arrows
        </span>
        <div className="gallery-controls">
          <div className="gallery-progress" aria-hidden="true">
            {projects.map((project, index) => (
              <span key={project.id} data-active={index === position.active} />
            ))}
          </div>
          <button
            className="gallery-arrow"
            aria-label="Previous projects"
            aria-controls={id}
            disabled={!position.previous}
            onClick={() => scroll(-1)}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            className="gallery-arrow"
            aria-label="Next projects"
            aria-controls={id}
            disabled={!position.next}
            onClick={() => scroll(1)}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
