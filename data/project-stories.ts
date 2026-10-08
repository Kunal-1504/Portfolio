import type { Project } from "@/data/portfolio";

export type ProjectStory = {
  reviewedAt?: string;
  summary: string;
  facts: { value: string; label: string }[];
  findings: { title: string; text: string }[];
  flow: {
    label: string;
    detail: string;
    icon:
      | "file"
      | "layers"
      | "database"
      | "sparkles"
      | "shield"
      | "chart"
      | "eye"
      | "phone";
  }[];
  scope: string;
  sources: { label: string; url?: string }[];
  evidence:
    | "Source code reviewed"
    | "Repository docs reviewed"
    | "Portfolio description";
};
const root = "https://github.com/Kunal-1504";
export const projectStories: Record<Project["id"], ProjectStory> = {
  dms: {
    summary:
      "An entire document lifecycle: upload, understand, retrieve, and ask—with each tenant’s workspace kept separate.",
    facts: [
      { value: "4 layers", label: "retrieval architecture" },
      { value: "Async", label: "document processing" },
      { value: "RLS", label: "tenant isolation" },
    ],
    findings: [
      {
        title: "One ingestion path, many formats",
        text: "Parses PDFs, Word files, spreadsheets, and presentations; preserves page references and extracts searchable metadata.",
      },
      {
        title: "Work continues in the background",
        text: "Celery workers consume Redis jobs for parsing, chunking, and embedding while the frontend tracks document status.",
      },
      {
        title: "Search that combines signals",
        text: "Vector and full-text search are fused, optionally reranked, then used to generate answers with document and page citations.",
      },
      {
        title: "Isolation across layers",
        text: "JWT tenant context, PostgreSQL row-level security, and tenant-scoped object storage separate document access.",
      },
    ],
    flow: [
      {
        label: "Upload & parse",
        icon: "file",
        detail:
          "Next.js sends files to FastAPI. Raw documents go to S3-compatible storage and processing jobs enter the Redis queue.",
      },
      {
        label: "Index knowledge",
        icon: "database",
        detail:
          "Celery extracts text, creates overlapping chunks, attaches metadata, and writes embeddings to PostgreSQL/pgvector.",
      },
      {
        label: "Find & rerank",
        icon: "layers",
        detail:
          "The documented search pipeline checks a cache, combines vector and keyword results, and optionally reranks candidate chunks. Query expansion and HyDE support harder queries.",
      },
      {
        label: "Answer & cite",
        icon: "sparkles",
        detail:
          "The model synthesizes an answer from retrieved context and returns source snippets with page references. AI providers can be swapped through configuration.",
      },
    ],
    scope:
      "Flagship private project. This breakdown is based on its architecture and AI-pipeline documentation; deployment performance has not been independently benchmarked.",
    sources: [
      { label: "README · private repository" },
      { label: "System architecture · private repository" },
      { label: "AI pipeline & models · private repository" },
    ],
    evidence: "Repository docs reviewed",
  },
  lakshya: {
    reviewedAt: "8 October 2026",
    summary:
      "A job-search workspace that turns your existing experience into focused applications—from finding relevant openings to preparing checked documents and tracking what happens next.",
    facts: [
      { value: "10", label: "LangGraph workflow stages" },
      { value: "PDF + DOCX", label: "tailored résumé exports" },
      { value: "4", label: "supported auto-apply platforms" },
    ],
    findings: [
      {
        title: "A workflow that can pause and resume",
        text: "Ten LangGraph stages cover profile, discovery, deduplication, matching, tailoring, criticism, approval, application, tracking, and follow-up drafts. SQLite checkpoints retain progress, and source failures are recorded independently.",
      },
      {
        title: "Match the role before tailoring",
        text: "Combines semantic or lexical similarity, required-skill overlap, title similarity, and fit judgment. Role, location, required experience, and posting freshness are checked separately from the score. Docker supports MiniLM; cloud mode defaults to lexical matching.",
      },
      {
        title: "Tailoring without invented experience",
        text: "Selects existing evidence IDs and reorders relevant skills and sections. The renderer copies résumé facts verbatim into PDF and DOCX. An independent critic checks unsupported claims, one-page layout, and consistency between the two files, with bounded revision attempts.",
      },
      {
        title: "Applications with explicit controls",
        text: "Opt-in automation targets supported Greenhouse, Lever, Ashby, and Recruitee forms. Eligibility checks include a fit score of at least 80, fresh postings, checked documents, and configured caps. Login, CAPTCHA, consent, and missing answers require help; only confirmed submissions are marked applied.",
      },
      {
        title: "Searches continue in the cloud",
        text: "Vercel Queues process pipeline stages and delayed searches. PostgreSQL stores encrypted account workspace snapshots and pending commands, while locks and idempotent processing coordinate account work. The React dashboard exposes jobs, application status, and workflow activity.",
      },
    ],
    flow: [
      {
        label: "Discover roles",
        icon: "eye",
        detail:
          "Import a résumé and choose search preferences. Public feeds and configured employer boards supply openings; the pipeline deduplicates results and records source availability.",
      },
      {
        label: "Check the fit",
        icon: "layers",
        detail:
          "The matcher applies role, location, experience, and freshness gates before scoring. Local MiniLM or cloud lexical similarity combines with skill and title signals; optional Gemini adds structured model reasoning.",
      },
      {
        label: "Tailor & review",
        icon: "file",
        detail:
          "An evidence-only plan selects existing résumé facts. PDF and DOCX renderers generate the bundle, and the critic checks content and format before a persistent approval step.",
      },
      {
        label: "Apply & track",
        icon: "chart",
        detail:
          "Review prepared documents or enable bounded automatic applications on supported forms. Artifact hashes and submission reservations prevent stale bundles and duplicate retries; outcomes and follow-up drafts remain in the workspace.",
      },
    ],
    scope:
      "Reviewed source commit e18e7ad on 8 October 2026. Job feeds have incomplete coverage; matching scores are heuristics, not hiring probabilities. Cloud mode uses lexical matching, while the Docker setup supports MiniLM. Automatic applications cover selected hosted forms; LinkedIn and Naukri remain manual. Account workspace and provider limits apply. No job-placement results or production performance benchmarks are claimed.",
    sources: [
      { label: "Open Lakshya", url: "https://lakshya-job-search.vercel.app" },
      {
        label: "LangGraph workflow",
        url: "https://github.com/Kunal-1504/Lakshya-AI-Job-search/blob/e18e7adf5b2eed56595fe59ba45413c8a5085396/backend/lakshya/pipeline.py",
      },
      {
        label: "Matching & eligibility",
        url: "https://github.com/Kunal-1504/Lakshya-AI-Job-search/blob/e18e7adf5b2eed56595fe59ba45413c8a5085396/backend/lakshya/matcher.py",
      },
      {
        label: "Evidence-only résumé generation",
        url: "https://github.com/Kunal-1504/Lakshya-AI-Job-search/blob/e18e7adf5b2eed56595fe59ba45413c8a5085396/backend/lakshya/resume_tailor.py",
      },
      {
        label: "Independent document critic",
        url: "https://github.com/Kunal-1504/Lakshya-AI-Job-search/blob/e18e7adf5b2eed56595fe59ba45413c8a5085396/backend/lakshya/agents/critic.py",
      },
      {
        label: "Automatic application policy",
        url: "https://github.com/Kunal-1504/Lakshya-AI-Job-search/blob/e18e7adf5b2eed56595fe59ba45413c8a5085396/backend/lakshya/services/application_policy.py",
      },
      {
        label: "Cloud worker & scheduling",
        url: "https://github.com/Kunal-1504/Lakshya-AI-Job-search/blob/e18e7adf5b2eed56595fe59ba45413c8a5085396/backend/lakshya/cloud/worker.py",
      },
    ],
    evidence: "Source code reviewed",
  },
  interview: {
    reviewedAt: "8 October 2026",
    summary:
      "A practice loop that connects a résumé and target role to focused questions, spoken or typed answers, and specific coaching for the next round.",
    facts: [
      { value: "4", label: "answer feedback dimensions" },
      { value: "3 formats", label: "PDF, DOCX & TXT inputs" },
      { value: "Voice + text", label: "signed-in practice modes" },
    ],
    findings: [
      {
        title: "Preparation grounded in your documents",
        text: "Extracts text from résumé and job-description files up to 8 MB each. The model identifies strengths, learning gaps, a study plan, and role-specific questions that can be edited before practice.",
      },
      {
        title: "Four dimensions, explicit evidence",
        text: "Scores relevance, evidence, structure, and clarity from 0–10 with an explanation for each. The application calculates the overall score from those dimensions, and returns improvement notes and an example answer.",
      },
      {
        title: "Speak, review, then submit",
        text: "The signed-in practice page records microphone audio for transcription and lets the user edit the transcript before submitting. Question playback uses configurable text-to-speech providers; typed answers remain available.",
      },
      {
        title: "A history of practice, not just one score",
        text: "SQLAlchemy models store rounds, individual answers, rubric feedback, and final reports. Users can resume unfinished practice and revisit earlier rounds with summaries and next steps.",
      },
      {
        title: "Providers can fail without ending practice",
        text: "The LLM adapter tries Gemini first and falls back to Groq. Speech adapters support local Whisper or Seamless services and hosted alternatives, while the UI keeps a text path when voice services are unavailable.",
      },
    ],
    flow: [
      {
        label: "Read the context",
        icon: "file",
        detail:
          "Upload a text-based résumé and job description. FastAPI extracts PDF, DOCX, or TXT content and sends bounded document context to the coaching model.",
      },
      {
        label: "Prepare questions",
        icon: "sparkles",
        detail:
          "Gemini, with Groq as fallback, generates role-alignment notes and interview questions. The session creator reviews and edits questions before saving them.",
      },
      {
        label: "Practice answers",
        icon: "layers",
        detail:
          "The authenticated React practice flow supports typed answers or microphone recording. Recorded audio is transcribed and remains editable; question audio is provided through TTS adapters.",
      },
      {
        label: "Review & repeat",
        icon: "chart",
        detail:
          "The coach returns evidence-based feedback across four dimensions. The application aggregates scores, saves answers and reports, and exposes previous rounds for review.",
      },
    ],
    scope:
      "Source reviewed at commit 5726592 on 8 October 2026. Educational coaching estimates, not validated hiring assessments. The signed-in practice flow has voice endpoints; the separate candidate app still references routes absent from the reviewed API, and the Daily call bot/follow-up loop is not fully connected. Provider-backed runtime and deployment performance were not tested. Repository hosted under sarthak0506.",
    sources: [
      {
        label: "Coaching & rubric implementation",
        url: "https://github.com/sarthak0506/AI-interveiw-coach/blob/5726592b687e833904c6564cbb6cdd7efa839200/backend/app/agents/coach.py",
      },
      {
        label: "Practice & voice API",
        url: "https://github.com/sarthak0506/AI-interveiw-coach/blob/5726592b687e833904c6564cbb6cdd7efa839200/backend/app/routers/interview.py",
      },
      {
        label: "Practice interface",
        url: "https://github.com/sarthak0506/AI-interveiw-coach/blob/5726592b687e833904c6564cbb6cdd7efa839200/frontend/hr-portal/src/pages/PracticePage.jsx",
      },
      {
        label: "Document ingestion",
        url: "https://github.com/sarthak0506/AI-interveiw-coach/blob/5726592b687e833904c6564cbb6cdd7efa839200/backend/app/agents/documents.py",
      },
    ],
    evidence: "Source code reviewed",
  },
  cloud: {
    summary:
      "Turn a cloud billing export into a regional forecast, anomaly view, and a history of previous analyses.",
    facts: [
      { value: "1–60", label: "forecast months" },
      { value: "95%", label: "configured forecast interval" },
      { value: "CSV / Excel", label: "billing inputs" },
    ],
    findings: [
      {
        title: "Billing data, cleaned automatically",
        text: "Detects date, cost, and region columns; aggregates monthly spend, fills missing months, and caps extreme outliers.",
      },
      {
        title: "Forecasts with a fallback",
        text: "Uses Prophet with yearly seasonality and prediction intervals. Linear regression takes over if Prophet is unavailable or fails.",
      },
      {
        title: "Global view, regional detail",
        text: "Builds global and per-region forecasts alongside rolling trends, quarterly totals, and year-over-year comparisons.",
      },
      {
        title: "Explainable cost signals",
        text: "Flags months beyond two standard deviations and generates rule-based trend, volatility, forecast, and budget-risk summaries. Runs can be saved and revisited.",
      },
    ],
    flow: [
      {
        label: "Import billing",
        icon: "file",
        detail:
          "Upload CSV or Excel and choose a forecast horizon. The API detects the relevant columns and available regions.",
      },
      {
        label: "Prepare series",
        icon: "layers",
        detail:
          "Costs become a monthly time series. Missing months are interpolated and values above the 99th percentile are capped.",
      },
      {
        label: "Forecast spend",
        icon: "chart",
        detail:
          "Prophet models yearly seasonality; a linear model is the fallback. Regions need at least six months of data to receive their own forecast.",
      },
      {
        label: "Explore signals",
        icon: "eye",
        detail:
          "The dashboard receives forecast intervals, anomaly flags, trend charts, region comparisons, and deterministic insight summaries.",
      },
    ],
    scope:
      "The reviewed implementation uses Prophet and a linear-regression fallback. Its insight text is rule-based; XGBoost, Llama-powered analysis, and a measured 60% time saving were not substantiated by the source reviewed. Historical fit error is not an out-of-sample accuracy benchmark.",
    sources: [
      {
        label: "Forecasting API",
        url: `${root}/cloud-cost-forecasting-engine/blob/main/project/backend/app.py`,
      },
      {
        label: "Project source",
        url: `${root}/cloud-cost-forecasting-engine/tree/main/project`,
      },
    ],
    evidence: "Source code reviewed",
  },
  midc: {
    summary:
      "A traceable review pipeline that turns industrial proposals into compliance checks, explained risk scores, and officer-ready reports.",
    facts: [
      { value: "10", label: "LangGraph stages" },
      { value: "SHAP", label: "risk explanations" },
      { value: "2 portals", label: "investor & officer" },
    ],
    findings: [
      {
        title: "A complete review sequence",
        text: "Ten graph nodes cover language, OCR, classification, extraction, compliance, retrieval, risk, explanation, recommendation, and reporting.",
      },
      {
        title: "Decisions leave a trace",
        text: "Per-agent execution records let officers inspect what ran and why a proposal was flagged.",
      },
      {
        title: "Editable rules, explainable models",
        text: "Officer-managed JSON rules drive compliance. XGBoost generates risk predictions and SHAP explains the model’s contributing factors.",
      },
      {
        title: "Humans make the final decision",
        text: "Separate investor and officer portals support uploads and review. Reports have English, Hindi, and Marathi labels; free-text translation is configurable.",
      },
    ],
    flow: [
      {
        label: "Read proposal",
        icon: "file",
        detail:
          "Language detection, Tesseract OCR, keyword classification, and field extraction turn uploaded documents into structured inputs.",
      },
      {
        label: "Check evidence",
        icon: "shield",
        detail:
          "Compliance rules are evaluated and similar projects are retrieved. The current embedding implementation is hashing-based.",
      },
      {
        label: "Explain risk",
        icon: "chart",
        detail:
          "XGBoost predicts risk from a synthetic training dataset. SHAP provides feature-level explanations; real historical data is needed for real-world validation.",
      },
      {
        label: "Officer review",
        icon: "eye",
        detail:
          "Recommendation and report stages produce review material. Officers see the report and agent trace before making a decision.",
      },
    ],
    scope:
      "Prototype with synthetic risk-model training data. The README explicitly says runtime tests were not executed in its build environment. It is not a validated predictor of real MIDC approval decisions.",
    sources: [
      {
        label: "Architecture & scope",
        url: `${root}/MIDC-Project-Approval-Risk-Predictor/blob/main/README.md`,
      },
      {
        label: "Ten-stage graph",
        url: `${root}/MIDC-Project-Approval-Risk-Predictor/blob/main/backend/app/agents/graph.py`,
      },
    ],
    evidence: "Source code reviewed",
  },
  society: {
    summary:
      "A source-backed housing-society assistant that retrieves government document passages across English and Marathi queries.",
    facts: [
      { value: "3 forms", label: "English, Marathi & romanized" },
      { value: "Hybrid", label: "vector + text retrieval" },
      { value: "OCR", label: "scanned-document support" },
    ],
    findings: [
      {
        title: "Ask in the language you use",
        text: "Detects English, Devanagari Marathi, and romanized Marathi. Translation and acronym expansion help match questions to source documents.",
      },
      {
        title: "Two retrieval signals",
        text: "Combines BGE-M3 vector search and PostgreSQL full-text search using reciprocal rank fusion and metadata boosts.",
      },
      {
        title: "Check relevance before answering",
        text: "Off-topic filtering, embedding thresholds, and an additional model check for borderline matches gate answer generation.",
      },
      {
        title: "Keep the source close",
        text: "PDF ingestion preserves page references, uses local Tesseract OCR for scans, and enriches retrieved passages with document URLs and departments.",
      },
    ],
    flow: [
      {
        label: "Ingest documents",
        icon: "file",
        detail:
          "PyMuPDF extracts native text; Tesseract with English and Marathi language data handles scanned pages. Chunks retain section and page metadata.",
      },
      {
        label: "Understand query",
        icon: "sparkles",
        detail:
          "The API detects language, rejects unrelated topics, expands acronyms, and translates non-Marathi queries for retrieval.",
      },
      {
        label: "Retrieve & check",
        icon: "database",
        detail:
          "Normalized BGE-M3 embeddings and text search retrieve candidate passages. Similarity and model-based relevance gates decide whether there is enough evidence.",
      },
      {
        label: "Reply with sources",
        icon: "eye",
        detail:
          "The answer prompt is limited to the retrieved text. Source enrichment adds document names, page information, URLs, and department metadata.",
      },
    ],
    scope:
      "The reviewed ingestion code disables optional Gemini Vision and text cleanup by default; local extraction and OCR remain the active path. This is a document-retrieval application, not independently validated legal advice.",
    sources: [
      {
        label: "Query & retrieval API",
        url: `${root}/society-compliance-copilot/blob/main/backend/api.py`,
      },
      {
        label: "Ingestion & vector store",
        url: `${root}/society-compliance-copilot/blob/main/backend/app/services/vector_store.py`,
      },
    ],
    evidence: "Source code reviewed",
  },
  guardian: {
    summary:
      "An experimental mobile intervention loop: collect recent feed text, classify it, and offer a moment to pause.",
    facts: [
      { value: "10 sec", label: "default analysis interval" },
      { value: "2 platforms", label: "Android & iOS scaffold" },
      { value: "Mock feeds", label: "repeatable demo input" },
    ],
    findings: [
      {
        title: "Shared mobile state",
        text: "React Native and Zustand coordinate the text buffer, classification, sensitivity controls, and intervention history.",
      },
      {
        title: "A working intervention loop",
        text: "The shared loop prunes buffered content, avoids overlapping inference, classifies batches, and triggers an Android overlay for flagged content.",
      },
      {
        title: "Platform-specific interfaces",
        text: "Android has accessibility and overlay components. iOS includes a controlled in-app demo feed and a model-bridge scaffold.",
      },
      {
        title: "Repeatable prototype testing",
        text: "Synthetic neutral, rage-bait, and toxic feeds support demos without depending on live social-media content.",
      },
    ],
    flow: [
      {
        label: "Collect snippets",
        icon: "phone",
        detail:
          "Platform adapters or the development injector feed text into shared state. The loop periodically prunes old entries.",
      },
      {
        label: "Classify batch",
        icon: "layers",
        detail:
          "The current Kotlin and Swift model bridges simulate classification with keyword-based fallback logic; native model calls are not connected.",
      },
      {
        label: "Apply sensitivity",
        icon: "shield",
        detail:
          "The shared loop checks the classification. Rage-bait intervention depends on the sensitivity setting, while toxic or adult classifications trigger intervention.",
      },
      {
        label: "Offer a pause",
        icon: "eye",
        detail:
          "The Android bridge opens a reframing overlay and logs the intervention. The iOS path remains an in-app prototype.",
      },
    ],
    scope:
      "Prototype, not a released wellbeing product. The reviewed Gemini Nano and Apple model bridges currently return mock keyword classifications; real on-device inference and wellbeing outcomes are not validated.",
    sources: [
      {
        label: "Inference loop",
        url: `${root}/cognitive-guardian/blob/features/cognitive-guardian/src/ai/inferenceLoop.ts`,
      },
      {
        label: "Android model bridge",
        url: `${root}/cognitive-guardian/blob/features/cognitive-guardian/android/app/src/main/java/com/guardian/ai/GeminiNanoBridge.kt`,
      },
      {
        label: "iOS model bridge",
        url: `${root}/cognitive-guardian/blob/features/cognitive-guardian/ios/Guardian/AI/FoundationModelsBridge.swift`,
      },
    ],
    evidence: "Source code reviewed",
  },
  workout: {
    summary:
      "A computer-vision project exploring live exercise-form feedback and repetition counting from joint movement.",
    facts: [
      { value: "OpenCV", label: "video processing" },
      { value: "MediaPipe", label: "pose landmarks" },
      { value: "Joint angles", label: "movement analysis" },
    ],
    findings: [
      {
        title: "Video becomes movement data",
        text: "The existing portfolio describes an OpenCV and MediaPipe pipeline for tracking exercise form from live video.",
      },
      {
        title: "Angles support rep counting",
        text: "Joint-angle measurements are used to interpret motion and count repetitions, according to the supplied project description.",
      },
    ],
    flow: [
      {
        label: "Capture video",
        icon: "eye",
        detail:
          "OpenCV supplies the live-video stage described in the portfolio.",
      },
      {
        label: "Detect pose",
        icon: "layers",
        detail:
          "MediaPipe landmarks provide the joint positions used for movement analysis.",
      },
      {
        label: "Measure angles",
        icon: "chart",
        detail:
          "The project description identifies 3D joint-angle measurements as the basis for form assessment.",
      },
      {
        label: "Count & guide",
        icon: "sparkles",
        detail:
          "The intended output is repetition counting and exercise-form feedback. A code-level walkthrough is pending a matching repository.",
      },
    ],
    scope:
      "No matching workout repository was found among the accessible GitHub repositories. This overview uses the supplied portfolio description; the previously stated accuracy and frame-rate figures have not been verified.",
    sources: [
      { label: "Existing portfolio description · repository not found" },
    ],
    evidence: "Portfolio description",
  },
};
