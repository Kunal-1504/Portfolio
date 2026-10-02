import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  hasProjectGallery,
  hideProjectNarration,
  isProjectGalleryRequest,
} from "../lib/project-presentation";
import { projectStories } from "../data/project-stories";
import { portfolio } from "../data/portfolio";
import type { PortfolioMessage } from "../lib/instant-chat";
import { ProjectDetail } from "../components/project-detail";
import { Dialog } from "../components/ui/dialog";
const projectTool: PortfolioMessage["parts"][number] = {
  type: "dynamic-tool",
  toolName: "getProjects",
  toolCallId: "projects",
  state: "output-available",
  input: {},
  output: {},
};

test("project gallery replaces the screenshot's raw table and catalog narration", () => {
  const parts: PortfolioMessage["parts"] = [
    {
      type: "text",
      text: "| Project | What it does | Core stack | Status | |---|---|---|---|",
    },
    projectTool,
  ];
  assert.equal(hideProjectNarration(parts, "Tell me about your work"), true);
  assert.equal(
    hideProjectNarration(
      [{ type: "text", text: "Here are all the projects." }, projectTool],
      "What are your projects?",
    ),
    true,
  );
  assert.equal(
    hasProjectGallery([
      {
        type: "dynamic-tool",
        toolName: "getProjects",
        toolCallId: "loading",
        state: "input-streaming",
        input: undefined,
      },
    ]),
    true,
  );
});

test("specific live AI follow-ups and non-project answers remain visible", () => {
  assert.equal(
    hideProjectNarration(
      [
        {
          type: "text",
          text: "DMS uses PostgreSQL row-level security for tenant separation.",
        },
        projectTool,
      ],
      "How does DMS isolate tenants?",
    ),
    false,
  );
  assert.equal(
    hideProjectNarration(
      [{ type: "text", text: "My skills include Python." }],
      "What are your skills?",
    ),
    false,
  );
  for (const q of [
    "Projects",
    "Show me your projects",
    "What are your projects?",
  ])
    assert.equal(isProjectGalleryRequest(q), true);
  assert.equal(
    isProjectGalleryRequest("Compare DMS and MIDC architectures"),
    false,
  );
});

test("each project opens a complete sourced case study with navigable architecture", () => {
  for (const project of portfolio.projects) {
    const story = projectStories[project.id];
    const html = renderToStaticMarkup(
      createElement(Dialog, null, createElement(ProjectDetail, { project })),
    );
    assert.ok(html.includes(project.title));
    assert.match(html, /Architecture steps/);
    assert.match(html, /aria-controls=/);
    assert.match(html, /aria-pressed="true"/);
    for (const step of story.flow)
      assert.ok(html.includes(step.label.replace(/&/g, "&amp;")));
    assert.match(html, /Build status &amp; sources/);
    assert.ok(story.sources.length > 0);
    if (project.id === "dms")
      assert.doesNotMatch(
        html,
        /href="https:\/\/github.com\/Kunal-1504\/Document-management-system-/,
      );
  }
});
