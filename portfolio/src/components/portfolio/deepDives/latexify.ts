import type { TechDive } from "./types";

/** Built from the Latex---resume-converter repo: backend/*.py, the Jinja template, the Dockerfile and frontend/src. */
const dive: TechDive = {
  heading: "How LaTeXify turns a PDF or Word resume into Jake's LaTeX template",
  intro:
    "LaTeXify reads a resume file, asks Gemini to sort the text into a fixed JSON schema, lets the user correct it, then compiles Jake's Resume template into a PDF. The repo is one commit on 22 May 2026: about 640 lines of Python, a 176-line LaTeX template and about 1,450 lines of React.",
  stages: [
    {
      date: "May 2026",
      phase: "Problem",
      title: "Retyping a resume into LaTeX by hand",
      summary:
        "Jake's Resume is a common LaTeX template for student resumes. Moving an existing resume into it means retyping every line and escaping characters such as & and %. LaTeXify does that from an upload.",
      points: [
        "Inputs: PDF or DOCX, up to 5 MB.",
        "Outputs: the compiled PDF and the .tex source, returned together.",
        "The backend keeps no files. Uploads are read in memory and the compile folder is deleted after each request.",
      ],
    },
    {
      date: "May 2026",
      phase: "Architecture",
      title: "Four steps in the browser, four endpoints on FastAPI",
      summary:
        "A Next.js page walks through Upload, Processing, Review and Edit, and Export. Next.js forwards /api/* to the FastAPI server on port 8000.",
      tables: [
        {
          caption: "Data flow",
          head: ["Step", "Endpoint", "Work done", "File"],
          rows: [
            ["Upload", "POST /extract", "Check type and size, pull text with pdfplumber or python-docx", "backend/ingest.py"],
            ["Processing", "POST /extract", "Gemini returns JSON in 5 sections", "backend/extraction.py"],
            ["Review and Edit", "none", "User edits fields, hides sections, picks serif or sans", "frontend/src/components/ResumeForm.js"],
            ["Export", "POST /compile", "Escape, render Jinja, compile with tectonic, return base64 PDF and .tex", "backend/render.py"],
            ["Blank start", "POST /blank", "Empty schema for manual entry", "backend/main.py"],
          ],
        },
      ],
      points: [
        "JSON sections: contact, education, experience, projects and skills.",
        "Skills split into 4 lists: languages, frameworks, tools and libraries.",
      ],
    },
    {
      date: "22 May 2026",
      phase: "Key decisions",
      title: "Choices recorded in the code comments",
      summary:
        "The repo has a single commit, so these come from the comments in the backend and Dockerfile, which cite a PRD by section.",
      iterations: [
        {
          name: "Custom Jinja delimiters",
          summary: "Blocks use <% %>, variables use << >> and comments use <# #>.",
          verdict: "kept",
          reason: "The default {{ }} and {% %} clash with LaTeX braces and the % comment sign.",
        },
        {
          name: "Escape user data, never the rendered file",
          summary: "Every string in the resume JSON is escaped once before rendering. The template's own LaTeX is left alone.",
          verdict: "kept",
          reason: "Escaping the output would break \\href, \\textbf and the template's other commands.",
        },
        {
          name: "tectonic with a pre-warmed bundle",
          summary:
            "The Dockerfile installs tectonic 0.15.0 and compiles a throwaway document with the template's packages at build time.",
          verdict: "kept",
          reason: "tectonic downloads packages on first compile, which the comments say can break a 15-second budget. The cache is baked into the image.",
        },
        {
          name: "Serverless hosting",
          summary: "Considered for the backend.",
          verdict: "dropped",
          reason: "Serverless cannot host the tectonic binary reliably. The Dockerfile targets a long-running container instead.",
        },
        {
          name: "OCR and multi-column layout handling",
          summary: "Scanned PDFs and two-column resumes.",
          verdict: "dropped",
          reason:
            "Out of scope for v1. Text under 50 characters returns code no_text and offers the blank form. The review step corrects jumbled reading order.",
        },
      ],
    },
    {
      date: "22 May 2026",
      phase: "Core algorithm",
      title: "Extract, structure, escape, compile",
      summary:
        "Each step has one failure path that tells the frontend what to show next, so the user is never stuck on an error.",
      tables: [
        {
          caption: "Constants in the backend",
          head: ["Constant", "Value", "Where"],
          rows: [
            ["MAX_BYTES", "5 MB", "ingest.py"],
            ["MIN_USABLE_CHARS", "50", "ingest.py"],
            ["Model", "gemini-1.5-flash, JSON output", "extraction.py"],
            ["Temperature", "0.1", "extraction.py"],
            ["Prompt rules", "8, starting with never invent", "extraction.py"],
            ["Compile timeout", "30 s", "render.py"],
            ["Escaped characters", "10, backslash first", "latex_escape.py"],
          ],
        },
        {
          caption: "Failure paths",
          head: ["Failure", "Response", "Frontend action"],
          rows: [
            ["Wrong file type", "422, bad_type", "Show message"],
            ["Over 5 MB", "422, too_big", "Show message"],
            ["Unreadable or encrypted file", "422, corrupt", "Show message"],
            ["Under 50 characters of text", "422, no_text", "Offer the blank form"],
            ["Gemini error or bad JSON", "200 with the empty schema", "User fills the form"],
            ["LaTeX error", "422 with the tectonic log", "Show technical details"],
          ],
        },
      ],
      points: [
        "DOCX extraction reads paragraphs and every table cell, since many resumes lay out content in tables.",
        "File type comes from the MIME type, with the .pdf or .docx extension as a fallback.",
        "The backslash becomes \\textbackslash{} before the other 9 characters, so the backslashes added later are not escaped twice.",
        "Gemini output is merged key by key into the empty schema, so a missing section comes back as an empty list.",
        "Dates stay as free text. Start and end are joined with --, which LaTeX prints as a range dash.",
        "PDF and .tex come back in one JSON response, with the PDF base64-encoded for the preview frame.",
      ],
    },
    {
      date: "22 May 2026",
      phase: "What shipped",
      title: "A local build that still needs an API key",
      summary:
        "The full pipeline runs locally with a Gemini key in backend/.env. The only commit message is \"need api key left\", and the repo has no project README or deployment yet.",
      stats: [
        { value: "2", label: "input formats (PDF, DOCX)" },
        { value: "2", label: "outputs (PDF and .tex)" },
        { value: "0", label: "files kept after a request" },
      ],
      points: [
        "Stack: FastAPI, pdfplumber, python-docx, Jinja2, tectonic, Google Gemini, Next.js 16 and React 19.",
        "latex_escape.py runs a self-check on 6 sample strings, such as R&D and C#. There is no test suite.",
        "The edit page keeps a section order in state, but /compile only receives the resume and the font, so reordering does not reach the PDF yet.",
      ],
    },
  ],
  sources: [
    "Latex---resume-converter repo on GitHub: backend (main.py, ingest.py, extraction.py, render.py, latex_escape.py, Dockerfile) and frontend/src",
    "Git log, 1 commit on 22 May 2026",
  ],
};

export default dive;
