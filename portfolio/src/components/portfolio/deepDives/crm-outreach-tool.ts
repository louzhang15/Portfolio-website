import type { TechDive } from "./types";

/** Built from the Cold-messaging-email repo (public as Fully-Integrated-CRM-Tool): API routes, data context, types and git log. The client is not named, per the repo's NDA commit. */
const dive: TechDive = {
  heading: "How the CRM finds, writes to and books contacts",
  intro:
    "The CRM runs a full outreach loop for an urban agriculture non-profit in Montreal: find contacts, write each one a personal email, send it, log it, and handle the visit bookings that come back. It is a Next.js app with server routes for Apollo, Gemini, Resend and Google Sheets. The git log runs from Mar. 27 to Apr. 12, 2026.",
  architecture: {
    flow:
      "A campaign run calls five server routes in order: discover, enrich, write, send and log, with 2 s between contacts. The browser keeps contacts, campaigns and settings in localStorage. Google Sheets is the shared record. Booking requests come back through a Google Form sheet, and each staff decision emails the client and writes column L.",
    layers: [
      {
        name: "Browser",
        blocks: [
          { name: "Next.js pages", role: "Campaigns, contacts, bookings and settings.", tech: "Next.js, React" },
          { name: "Data context", role: "Runs the campaign loop and holds the state.", tech: "lib/data-context.tsx, localStorage" },
        ],
      },
      {
        name: "Server routes",
        blocks: [
          { name: "/api/discover and /api/lookup", role: "Find people by audience job titles and city, then fill missing emails.", tech: "Apollo" },
          { name: "/api/generate", role: "Writes a subject, a 150 to 200 word email and a LinkedIn version as JSON.", tech: "Gemini 2.0 Flash" },
          { name: "/api/send", role: "Sends email contacts. Queues LinkedIn contacts for manual outreach.", tech: "Resend" },
          { name: "/api/sheets", role: "Appends each contact to its audience tab and the Sent tab.", tech: "Google Sheets API" },
        ],
      },
      {
        name: "Records",
        blocks: [
          { name: "Google Sheets", role: "Audience tabs, the Sent tab (columns A to K) and the bookings sheet.", tech: "Shared record" },
          { name: "Google Form", role: "Visit booking requests from contacts.", tech: "Feeds the bookings sheet" },
        ],
      },
    ],
    links: [
      { from: "Generate route", to: "Send route", label: "booking link appended if the model drops it" },
      { from: "Bookings page", to: "Resend", label: "accept, refuse or cancel emails the client" },
      { from: "Bookings page", to: "Google Sheets", label: "decision written to column L" },
    ],
  },
  stages: [
    {
      date: "Mar. 27, 2026",
      phase: "Problem",
      title: "Three audiences, one small team",
      summary:
        "The client sells guided visits to three kinds of groups. Each needs a different pitch, price and pipeline, and the team tracked it all by hand.",
      tables: [
        {
          caption: "Audience segments (lib/types.ts)",
          head: ["Segment", "Base price", "Per extra person", "Pitch angle in the prompt"],
          rows: [
            ["Corporate", "$450 + tax, up to 20 people", "$22.50", "team building, ESG and CSR values"],
            ["Schools / non-profits", "$300 + tax, up to 20 people", "$15", "curriculum links: local food, circular economy"],
            ["Institutions & media", "$300 in the booking estimate", "$15", "press visits, tourism, event venue"],
          ],
        },
      ],
      media: [
        { src: "/media/crm/dashboard.webp", caption: "Dashboard: messages sent, response rate and the three demo campaigns.", kind: "screenshot", shape: "wide" },
      ],
    },
    {
      date: "Mar. 27, 2026",
      phase: "Architecture",
      title: "Six server routes behind one data context",
      summary:
        "The first commit added 38 files and 12,935 lines: every page and the six API routes. Contacts, campaigns and settings live in the browser's localStorage. Google Sheets is the shared record.",
      tables: [
        {
          caption: "Campaign run, step by step (lib/data-context.tsx)",
          head: ["Step", "Route", "Service", "What happens"],
          rows: [
            ["1. Discover", "/api/discover", "Apollo people search", "Fills the campaign up to its contact limit, 10 per page, filtered by audience job titles and city. Skips known LinkedIn URLs and emails."],
            ["2. Enrich", "/api/lookup", "Apollo", "Looks up a missing email for a discovered person."],
            ["3. Write", "/api/generate", "Gemini 2.0 Flash", "Returns JSON: subject, email body (150 to 200 words), LinkedIn version (100 words max)."],
            ["4. Send", "/api/send", "Resend", "Email contacts get a real send. LinkedIn contacts are queued for manual outreach."],
            ["5. Log", "/api/sheets", "Google Sheets API", "Appends the contact to its audience tab and to the Sent tab, columns A to K."],
          ],
        },
      ],
      points: [
        "The loop waits 2 s between contacts.",
        "Each contact moves through 6 statuses: to contact, sent, in discussion, confirmed, refused, do not contact.",
      ],
    },
    {
      date: "Mar. 27 to Apr. 3, 2026",
      phase: "Email generation",
      title: "A prompt per audience, and links that cannot go missing",
      summary:
        "The generate route builds one prompt from the contact's name, title and organization, the audience's case study, and the base template. The model must answer with a single JSON object.",
      calcs: [
        {
          title: "Turning a model reply into a safe email",
          given: ["Raw Gemini text, possibly wrapped in markdown fences"],
          steps: [
            "Strip ```json and ``` fences",
            "Take the first {...} block with a regex. No block: return a 500 with the raw text.",
            "Parse subject, body and linkedin",
            "If the body has no booking form link, append the call-to-action block with the form and website links",
          ],
          result: "Every sent email carries the booking link, even when the model drops it.",
          source: "src/app/api/generate/route.ts",
        },
      ],
      points: [
        "Prompt rules: no emoji, no placeholders, a call to action toward the booking form, and a CASL unsubscribe line.",
      ],
    },
    {
      date: "Mar. 28 to Apr. 3, 2026",
      phase: "Bookings",
      title: "Booking requests with a revenue estimate",
      summary:
        "Visit requests arrive in a Google Form sheet. The bookings page reads them, estimates revenue, and lets staff accept, refuse or cancel. Each action emails the client through Resend and writes the decision into column L of the sheet.",
      calcs: [
        {
          title: "Revenue estimate for one booking",
          given: ["Corporate group of 30 people", "Lunch box formula, $21 per person"],
          steps: [
            "Base = $450 (corporate) or $300 (school or institution)",
            "Extra people = (30 − 20) × $22.50 = $225",
            "Culinary = 30 × $21 = $630",
            "Total = 450 + 225 + 630 = $1,305",
          ],
          result: "$1,305 shown before staff accept. A cancel shows the same figure as lost revenue.",
          source: "src/app/bookings/page.tsx (computeRevenue)",
        },
      ],
      tables: [
        {
          caption: "Culinary add-ons per person",
          head: ["Formula", "Price"],
          rows: [
            ["Discovery", "$12"],
            ["Tasting", "$10"],
            ["Lunch box", "$21"],
            ["Cold buffet", "$30"],
            ["Cocktail dinner", "$47.50"],
          ],
        },
      ],
    },
    {
      date: "Mar. 27 to Apr. 12, 2026",
      phase: "Decisions",
      title: "What changed between the first commit and the demo",
      summary: "The settings page shows where the plan started. The routes show what shipped.",
      iterations: [
        {
          name: "Claude or GPT-4 for writing",
          summary: "The settings page still offers Anthropic Claude and OpenAI GPT-4 as providers.",
          verdict: "revised",
          reason: "The generate route has called Gemini 2.0 Flash since the first commit.",
        },
        {
          name: "SendGrid for email",
          summary: "Settings keep a SendGrid key field.",
          verdict: "dropped",
          reason: "Both send routes use Resend, with a test sender until a domain is verified.",
        },
        {
          name: "Demo mode",
          summary: "One switch redirects every send to a single demo inbox. Without an Apollo key, discovery returns 12 sample contacts per audience, 6 per page.",
          verdict: "kept",
          reason: "The demo could run end to end without emailing real people.",
        },
        {
          name: "French UI with the client's name",
          summary: "The tool was built in French for the client.",
          verdict: "revised",
          reason: "On Apr. 12 one commit removed every mention of the non-profit for NDA reasons, and the next translated 11 files to English.",
        },
      ],
      stats: [
        { value: "12", label: "commits" },
        { value: "6", label: "API routes" },
        { value: "3", label: "audience pipelines" },
      ],
    },
  ],
  sources: [
    "Cold-messaging-email repo (public as Fully-Integrated-CRM-Tool): src/app/api/*, src/lib/types.ts, src/lib/data-context.tsx, src/app/bookings/page.tsx, src/app/settings/page.tsx",
    "Repo README",
    "Git log, Mar. 27 to Apr. 12, 2026",
  ],
};

export default dive;
