import type { Project } from "@/data/portfolio";

export type ProjectStory = {
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
