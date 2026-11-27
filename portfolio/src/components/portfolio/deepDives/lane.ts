import type { TechDive } from "./types";

/** Built from the Job-Application-Status-Chrome-Extension repo: source in lane-extension/src, README and git log. */
const dive: TechDive = {
  heading: "How Lane finds a job posting, tracks it and matches the reply email",
  intro:
    "Lane is a Chrome extension that logs an application the moment it is submitted, then reads Gmail to move it to Rejected or Interview. It was built in 8 days, from 17 to 24 May 2026, in 10 commits. The extension source is about 4,700 lines of TypeScript and React.",
  stages: [
    {
      date: "May 2026",
      phase: "Problem",
      title: "1,046 applications across 3 recruitment cycles",
      summary:
        "The README tracks 3 internship cycles: Summer 2025, Winter 2026 and Summer 2026. A spreadsheet could not keep up with that volume. Lane had to capture each application with no typing and read outcomes from the inbox.",
      stats: [
        { value: "1,046", label: "applications tracked (README)" },
        { value: "3", label: "recruitment cycles" },
        { value: "8", label: "application statuses" },
      ],
      points: [
        "Statuses: Saved, Applied, Phone Screen, Interview, Offer, Rejected, Withdrew, Ghosted.",
        "Gmail sync covers applications and rejections. Interviews and offers are logged by hand in the dashboard.",
      ],
    },
    {
      date: "May 2026",
      phase: "Architecture",
      title: "Four Manifest V3 parts and one local store",
      summary:
        "A content script runs on every page, a popup and a dashboard read the same chrome.storage.local key, and Gmail is reached over OAuth from the dashboard. Nothing leaves the browser except Gmail API calls.",
      tables: [
        {
          caption: "Data flow",
          head: ["Part", "Reads", "Writes", "File"],
          rows: [
            ["Content script", "Page DOM, JSON-LD, URL", "New application on submit", "src/content/detector.ts"],
            ["Extractors", "Page DOM", "Company, role, location, source, tier", "src/lib/extractors.ts"],
            ["Popup", "Detected job from the content script", "Manual save or status change", "src/popup/App.tsx"],
            ["Dashboard", "All applications, manual outcomes", "Status edits, CSV import", "src/dashboard/App.tsx"],
            ["Gmail sync", "Labelled emails via Gmail API v1", "Status, cycle, thread id", "src/lib/gmail.ts"],
            ["Storage", "chrome.storage.local keys lane_*", "Same keys", "src/lib/storage.ts"],
          ],
        },
      ],
      points: [
        "Permissions: activeTab, storage, scripting, tabs and identity, plus the gmail.modify scope.",
        "CSV export writes 11 columns with quoted fields. Import checks each status against the 8 valid values.",
      ],
    },
    {
      date: "17 to 24 May 2026",
      phase: "Key decisions",
      title: "Three builds in one week",
      summary:
        "The first commit holds a plain JavaScript extension and a separate Next.js dashboard. By the next day the work had moved into one Vite and React extension with Gmail sync.",
      iterations: [
        {
          name: "lane-ext: plain JavaScript prototype (17 May)",
          summary:
            "A 157-line detector with hand-written rules for LinkedIn, Greenhouse, Lever and Workday, plus a URL score for other sites.",
          verdict: "revised",
          reason:
            "It only knew 4 job boards well. The rewrite in TypeScript reads JSON-LD first and adds Indeed and a score built from page content.",
        },
        {
          name: "lane-dashboard: Next.js and shadcn app on fake data (17 May)",
          summary: "A separate web dashboard with a kanban, a weekly chart and sample data meant to be swapped for Supabase later.",
          verdict: "dropped",
          reason:
            "Last edited on 18 May. The dashboard moved inside the extension as an options page, so it reads chrome.storage directly with no server.",
        },
        {
          name: "Gmail sync by label folder (18 May)",
          summary:
            "Commit 05511b4 added an 879-line Gmail module. It reads labels shaped like Root/Cycle/Applications and Root/Cycle/Rejections.",
          verdict: "kept",
          reason:
            "The label a message sits in sets its status and cycle directly. Text matching only has to find which application it belongs to.",
        },
        {
          name: "Seed file with real application data (18 May)",
          summary: "A 3,409-line seed file loaded one cycle's records into the tracker.",
          verdict: "dropped",
          reason: "Commit d54c590 cut it to 32 lines the same day to keep personal application data out of the source.",
        },
        {
          name: "Locked totals for finished cycles (18 May)",
          summary:
            "Completed cycles show fixed totals from TRUSTED_CYCLE_OUTCOMES in the dashboard source, saved again to storage on load.",
          verdict: "kept",
          reason: "Gmail sync does not read interviews or offers. Fixed totals keep finished cycles correct, and they survive a storage reset.",
        },
        {
          name: "Web build for GitHub Pages (22 May)",
          summary:
            "A second Vite config swaps chrome.* for a 64-line mock backed by localStorage, and a GitHub Actions workflow deploys it on each push to main.",
          verdict: "kept",
          reason: "The dashboard can be shown in a browser without installing the extension.",
        },
      ],
    },
    {
      date: "May 2026",
      phase: "Core algorithm",
      title: "Detect, auto-track, then match the reply",
      summary:
        "Detection tries 7 extractors in order and keeps the first hit. Gmail matching scores every application against the email and refuses to guess on a tie.",
      tables: [
        {
          caption: "Page score in the fallback extractor (extractSmart)",
          head: ["Signal", "Points"],
          rows: [
            ["Resume or CV upload field, class or text", "+6"],
            ["Query param such as jobId= or reqId=", "+5"],
            ["/apply or ATS portal path in the URL", "+5 each"],
            ["Job path with an id or /apply", "+4"],
            ["\"Apply now\" or \"Submit application\" in the page", "+3"],
            ["Role word in the h1 (English or French)", "+3"],
            ["Salary, responsibilities, qualifications", "+2 each"],
            ["Detected as a job page", "score 5 or more"],
            ["Tier 1 (high confidence)", "score 8 or more"],
          ],
        },
        {
          caption: "Email to application match (findMatchingApplication)",
          head: ["Signal", "Points"],
          rows: [
            ["Same Gmail thread as a tracked application", "match at once"],
            ["Company name appears in the email", "+10"],
            ["Company from the email subject or body matches", "+8"],
            ["Sender domain matches the company", "+5"],
            ["Full role title (over 5 characters) appears", "+4"],
            ["Each shared role word over 2 letters", "+1"],
            ["Threshold inside a known cycle", "7"],
            ["Threshold with no cycle", "10"],
            ["Two or more applications tied at the top", "no match"],
          ],
        },
      ],
      points: [
        "Extractor order: JSON-LD JobPosting, LinkedIn, Indeed, Greenhouse, Lever, Workday, then the page score.",
        "Single-page sites load late, so a MutationObserver retries detection for up to 200 DOM changes.",
        "Auto-track listens for submit events and clicks on buttons that match a submit regex in English and French. It waits 800 ms and skips the save if the page shows an error or aria-invalid field.",
        "Duplicates are caught by hostname plus path, with the trailing slash removed.",
        "Sender domains on a list of 24 ATS names, such as Workday and Greenhouse, are ignored for company matching.",
        "Status only moves forward. Offer and Withdrew are never overwritten, and Applied only replaces Saved.",
        "Each cycle stores its last sync time. Later syncs ask Gmail only for after:<epoch> instead of the full 500-day lookback.",
      ],
    },
    {
      date: "24 May 2026",
      phase: "What shipped",
      title: "A working extension and a hosted dashboard demo",
      summary:
        "The last commit on 24 May 2026 left a loadable Manifest V3 build, Gmail sync, a Sankey of the pipeline, CSV import and export, and a GitHub Pages build of the dashboard.",
      stats: [
        { value: "7", label: "job page extractors" },
        { value: "10", label: "commits in 8 days" },
        { value: "~4,700", label: "lines of TypeScript" },
      ],
      points: [
        "Stack: React 18, TypeScript, Vite 5 with the CRXJS plugin, Recharts and Tailwind.",
        "The Sankey runs from applications to interviews, then to offer, no offer or withdrawn.",
        "No tests in the repo. The dashboard is one 2,117-line App.tsx.",
      ],
    },
  ],
  sources: [
    "Job-Application-Status-Chrome-Extension repo on GitHub: lane-extension/src, manifest.json, README",
    "Git log, 10 commits from 17 to 24 May 2026",
  ],
};

export default dive;
