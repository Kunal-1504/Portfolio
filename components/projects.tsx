"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { projectStories } from "@/data/project-stories";
import { ProjectArt } from "@/components/project-art";
import { ProjectDetail } from "@/components/project-detail";
import { GitHubActivity } from "@/components/github-activity";
import { useLiveData } from "@/components/live-data";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
export function Projects() {
  const { snapshot } = useLiveData();
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
        <button
          className="gallery-arrow gallery-arrow-left"
          aria-label="Previous projects"
          aria-controls={id}
          disabled={!position.previous}
          onClick={() => scroll(-1)}
        >
          <ArrowLeft size={19} />
        </button>
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
            const repo = snapshot.repositories.find(
              (repo) => repo.url.toLowerCase() === project.github.toLowerCase(),
            );
            return (
              <Dialog key={project.id}>
                <DialogTrigger asChild>
                  <button
                    className={`project-card ${project.id === "dms" ? "flagship-card" : ""}`}
                    aria-label={`View ${project.title} details`}
                  >
                    <ProjectArt project={project} />
                    <div className="project-copy">
                      <span className="eyebrow">{project.category}</span>
                      <h3>{project.title}</h3>
                      <p className="project-tagline">{project.shortTitle}</p>
                      <span className="project-status">{project.status}</span>
                      <div className="project-card-finding">
                        {projectStories[project.id].findings[0].title}
                      </div>
                      {repo?.pushedAt && (
                        <span className="project-live-note">
                          Updated{" "}
                          {new Date(repo.pushedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            timeZone: "UTC",
                          })}
                        </span>
                      )}
                      <div className="project-card-cta">
                        <span>Explore project</span>
                        <ArrowUpRight size={17} />
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
        <button
          className="gallery-arrow gallery-arrow-right"
          aria-label="Next projects"
          aria-controls={id}
          disabled={!position.next}
          onClick={() => scroll(1)}
        >
          <ArrowRight size={19} />
        </button>
      </div>
      <div className="gallery-footer">
        <span>{projects.length} projects · Swipe or use the arrows</span>
        <div className="gallery-progress" aria-hidden="true">
          {projects.map((project, index) => (
            <span key={project.id} data-active={index === position.active} />
          ))}
        </div>
      </div>
      <GitHubActivity />
    </section>
  );
}
