# Kunal — an AI-native portfolio

A conversational portfolio built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style Radix UI components, Framer Motion, Lucide, and the Vercel AI SDK. The landing page leads into a streaming conversation with inline interactive cards.

## Local setup

Requires Node.js 20.9+ (Node.js 22 recommended).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open the local address printed by Next.js (normally http://localhost:3000). Existing `.env` values are preserved; `.env.local` takes precedence.

Without a provider key, the app shows an **AI not connected** notice and a usable interactive portfolio explorer. It does not claim to generate AI answers. Add a key to enable real streamed conversation. Prepared answers are available only when `CHAT_DEMO_MODE=true` is explicitly set for development.

## Enable live AI

Set these server-side variables in `.env.local` or Vercel project settings:

```dotenv
OPENAI_API_KEY=your-key
OPENAI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
CHAT_DEMO_MODE=false
```

For Groq, use `GROQ_API_KEY`, set `AI_MODEL` to a supported tool-capable model such as `openai/gpt-oss-20b`, and remove `OPENAI_BASE_URL` or set it to `https://api.groq.com/openai/v1`.

For Gemini's OpenAI-compatible endpoint, use `GOOGLE_GENERATIVE_AI_API_KEY`, `OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`, and a supported model such as `gemini-2.5-flash`.

Credential precedence is OpenAI, Groq, then Gemini. An explicitly configured base URL or model overrides provider defaults. Never prefix provider keys with `NEXT_PUBLIC_`. Restart the development server after changing environment variables. `CHAT_DEMO_MODE=true` explicitly selects demo mode even with a key.

Live mode uses `streamText`, server-executed tools, up to two model steps, a 600-token response budget, one retry, and a 25-second request timeout. The system prompt supplies the portfolio facts, requires first-person responses, and instructs the model to acknowledge missing information. These are model instructions, not a guarantee that an external model will never make a mistake.

## Content and assets

- **`data/portfolio.ts`**: the single source for personal details, projects, metrics, skills, contact information, availability, and quick questions. Both cards and server tools read it.
- **`public/avatar-kunal.png`**: personalized transparent avatar, preserving the waving pose with balanced adult proportions. The previous avatar is retained as `public/avatar.png`.
- **`public/assets/Kunal_Deshmukh_AI_Engineer_Resume_Optimized.docx`**: the latest supplied résumé, already available for download.
- **`app/globals.css`**: warm neutral theme, responsive layout, and dark theme tokens. Inter is served locally through `@fontsource/inter`.
- **`app/opengraph-image.tsx`**: generated social sharing image.

The Guinness record detail comes from the original `public/content.json`: SPPU’s Meri Maati Mera Desh contribution in December 2024. Other personal content and the original three projects follow the supplied brief. The gallery now contains six projects. Project metrics are self-reported. The workout project points to the supplied GitHub profile because no project-specific repository was provided.

## App structure

```text
app/
  page.tsx                  Landing page
  layout.tsx                Metadata, theme bootstrapping, shared header
  chat/page.tsx             Dynamic chat page and preview/live status
  api/chat/route.ts         Validated streaming endpoint and seven server tools
  globals.css               Responsive light/dark styling
  opengraph-image.tsx       Social image
components/
  landing.tsx               Animated hero
  chat.tsx                  Streaming messages, tools, retry/stop/reset
  chat-input.tsx            Shared accessible composer
  quick-questions.tsx       Landing tiles and chat chips
  tool-cards.tsx            All rich cards and project detail dialogs
  avatar.tsx                Floating and thinking avatar
  site-header.tsx           Navigation, résumé and theme toggle
  providers.tsx             Reduced-motion support
  ui/                       shadcn-style Button and Radix Dialog primitives
lib/
  chat.ts                   Validation, grounded system prompt and tool data
  answers.ts                Explicit demo answers and explorer topic selection
  instant-chat.ts           Local typed message/card construction
  utils.ts                  Tailwind class merging
data/portfolio.ts          Shared portfolio content
tests/chat.test.ts         Validation and streaming API tests
```

Cards: `getPresentation`, `getProjects`, `getSkills`, `getResume`, `getContact`, `getAvailability`, and `getCrazy`. The project carousel supports buttons and native horizontal scrolling. Radix dialogs provide focus trapping, Escape dismissal, and focus restoration. Motion respects reduced-motion preferences. Contact links and copy buttons include accessible labels and copy failure feedback.

In live mode, **every question goes to the AI provider**, including quick questions and exact topic prompts. No canned-answer shortcut replaces a live answer. Project tools retrieve current public GitHub metadata alongside the curated portfolio facts. Unknown facts must be acknowledged; provider responses remain generative and should be checked for accuracy. In explicit demo mode only, prepared answers can render locally. Landing hover/focus prefetches chat routes, and `app/chat/loading.tsx` provides navigation feedback.

Chat history lives only in the current page's memory. New conversation clears it; reloads do not restore it. The first question remains in the `/chat?query=…` URL. Requests are capped at 40 messages, 2,000 characters for the new question, and roughly 100 KB per body. Client-provided tool results and system roles are never trusted: the server forwards only user/assistant text, and runs its own tools.

## Verify

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

The build/dev scripts use Next.js's supported webpack compiler for compatibility with constrained environments. CI runs type checking, lint, tests, and the production build. API tests include malformed input, request limits, preview tool output, and a mocked OpenAI-compatible streaming/tool round trip. No real API credentials are needed for tests.

Manual browser checks:

1. Check the hero at 320px, 390px, 768px, and desktop widths; try both themes.
2. Send a question from each of the five tiles and from the input.
3. Open a project, tab through its dialog, close with Escape, and try the carousel controls.
4. Ask for résumé and availability; download the DOCX and test contact copy controls.
5. In live mode, verify incremental text, tool cards, stop, retry, and follow-up questions.
6. Check reduced motion, keyboard focus, back-home navigation, and new conversation.

## Deploy to Vercel

1. Push this project to your GitHub repository, then import it in Vercel as a **Next.js** project. Use the repository root, `npm run build`, and the default Next.js output settings. Do not select a static export or `public` as the output folder.
2. Add the provider key, base URL/model if needed, and `NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app` in Vercel's environment settings. Use your custom domain when available. With no key, the deployed site shows the interactive explorer and a clear disconnected AI notice.
3. Deploy. Test `/`, `/chat?query=Who%20are%20you%3F`, the résumé download, `/opengraph-image`, and all seven card topics on the resulting URL.
4. Redeploy after environment changes. Use Vercel's firewall/rate-limit controls and your provider's spending limits for a publicly shared live endpoint; there is no persistent distributed rate limiter in this repository.

Alternatively, from an authenticated Vercel CLI session, run `npx vercel` for a preview and `npx vercel --prod` for production. Deployment requires access to your Vercel account; no deployment credentials are stored in this project.

## GitHub Pages frontend + Vercel AI backend

The complete site runs with a static frontend on GitHub Pages and the Next.js API routes on Vercel. Keep provider keys only in Vercel environment settings. The Pages build contains no API handlers or private environment files; live GitHub updates are fetched directly from GitHub in the browser.

1. Deploy the standard Next.js project to Vercel with the provider key/model settings above and `ALLOWED_WEB_ORIGIN=https://kunal-1504.github.io`.
2. Set the GitHub repository Actions variable `PORTFOLIO_API_URL` to the Vercel production origin (for example `https://your-project.vercel.app`, without `/api`). The backend must be publicly reachable without Vercel deployment protection.
3. Push `main` or run **Deploy portfolio to GitHub Pages**. It builds and publishes `out/` under `/Portfolio/`. The deploy job waits for a nonempty backend variable so an incomplete replacement is not published.

For local export verification, run `NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app npm run build:pages`. This builds an isolated copy in `.pages-build/`, preserving the normal `.next` output and local environment files. Avatar, résumé, navigation, and metadata URLs honor the Pages base path. The frontend verifies `/api/status` before activating live chat. The backend permits browser requests from the configured Pages origin through CORS.

## Migration notes

The existing `public/index.html`, `public/script.js`, and `public/style.css` (including pre-existing local edits), plus the old Express `server.js`, were preserved. They do not power the new `/` route. The new npm scripts run Next.js; the previous Express package dependencies and scripts have been replaced. The old services, configurator, arcade, slider, and contact form are absent from the new UI. The optional terminal easter egg remains only in the legacy files.

Design and interaction references: [aaabadcode.com](https://www.aaabadcode.com/) and [Toukoum’s portfolio](https://github.com/toukoum/portfolio). This implementation is written for Kunal's content; it does not copy another person's biography or avatar.

## Added project sources

Reviewed through the connected GitHub plugin on October 1, 2026:

- **Document Management System** — featured first at the owner's request as their largest project. Summary and architecture highlights are grounded in its private repository's README and `docs/AI_PIPELINE_AND_MODELS.md`. The public card identifies the code as private and offers email contact rather than an inaccessible source-code button. No deployment credentials, customer data, or performance claims were copied.
- **[Society Compliance Copilot](https://github.com/Kunal-1504/society-compliance-copilot)** — verified against `backend/api.py`, `requirements.txt`, and the repository structure. Includes FastAPI, React, pgvector, document retrieval, and language handling.
- **[Cognitive Guardian](https://github.com/Kunal-1504/cognitive-guardian)** — verified against README and `package.json` on its default `features/cognitive-guardian` branch. Explicitly presented as an experimental prototype, without claims of measured wellbeing outcomes.

The project gallery uses portrait artwork covers, category filters, swipe/keyboard navigation, and arrow controls. Each card opens an animated, scrollable case study with a pinned close button, a large implementation graphic, verified findings, and interactive architecture steps. Reduced-motion preferences disable the decorative transitions.

The cursor background batches pointer movement once per animation frame and interpolates fast strokes instead of discarding events. WebGL rendering uses a bounded display buffer and a 512/768 dye resolution. Browsers without WebGL use a low-resolution CPU fluid field with velocity projection and vorticity. Both paths stop when hidden or when reduced motion is requested.

## Live GitHub updates and skills explorer

`GET /api/github` discovers up to 300 owned, public, non-fork, non-archived repositories from GitHub. Repository names, descriptions, primary languages, stars, and push timestamps refresh through a shared five-minute Next.js cache. The client checks every five minutes while visible, on tab visibility changes, and on manual refresh. The AI project tool uses the same data source. Newly published repositories are available to AI answers; the visible gallery remains curated. Private repositories and unverified personal claims are never automatically published.

The homepage has an expandable GitHub activity panel. Known projects show their current push dates. Errors are labeled; the client retains its last successful snapshot rather than fabricating data. This public-data integration requires no GitHub token. The private flagship's reviewed description and personal profile facts remain curated in `data/portfolio.ts`.

The skills explorer includes six selectable disciplines, an animated connection map, a search across all skills, tool selection, and project evidence based on actual stack entries (plus explicit SQL/PostgreSQL and pose-estimation/MediaPipe aliases). It shows currently detected GitHub languages separately from declared skills. It uses no invented proficiency scores. Selecting a linked project starts a relevant AI question when connected, or navigates to the project explorer when disconnected.

`GET /api/status` exposes only the connection mode (`live`, `demo`, or `unconfigured`), never credentials. A disconnected chat checks it every 15 seconds so a restarted server can activate chat without a full page reload. Environment edits still require restarting the Node process; this endpoint does not read key files directly.


## Visual project case studies

The Projects quick question calls the live AI project tool and renders the gallery immediately after its result, without a second model pass to repeat the project catalog. The chat renderer also suppresses duplicate project tables/catalogs while preserving specific AI follow-ups. Side controls navigate the horizontal gallery, and separate up/down controls navigate the conversation. Gallery controls support keyboard navigation, disable at their boundaries, and respect reduced motion.

Each curated card opens a wider case-study dialog containing project-specific artwork, implementation facts, a selectable four-step architecture diagram, concise findings, stack tags, and source links. `data/project-stories.ts` stores the reviewed findings and their evidence level. These reviewed narratives are curated; repository activity continues to refresh automatically.

Source review corrected the Cloud Cost description to match its Prophet/linear-regression implementation and rule-based insights. MIDC explicitly identifies synthetic model training data. Cognitive Guardian identifies its current mock native-model bridges. A matching workout repository was not found, so that project uses the portfolio description and does not present unverified performance figures as measured results. Private DMS documentation is summarized without publishing inaccessible repository links.
