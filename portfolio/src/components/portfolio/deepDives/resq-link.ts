import type { TechDive } from "./types";

const M = "/media/resq-link/deep/";

/** Built from the UpStart 2026 decks, the Portfolio.pdf drawings and dashboard screens, and the business model canvas. */
const dive: TechDive = {
  heading: "How ResQ-Link was built at UpStart 2026",
  intro:
    "ResQ-Link is a triage bracelet with no battery plus a web dashboard called SmartTriage. It was designed, costed and pitched at the UpStart 2026 pitching competition in Feb. 2026. The bracelet holds a passive NFC chip and a copper coil sealed in silicone. The dashboard shows every tagged patient by category and on a map.",
  architecture: {
    flow:
      "A reader's field powers the coil, so the chip answers with no battery. The phone field app concept scans the band, records vitals and syncs the patient to SmartTriage. The hospital sees every tag by category and on a map. The pitch names an offline mesh sync for when cellular service fails. The project files hold the CAD part, the deck and dashboard screens, with no app or server code.",
    layers: [
      {
        name: "Bracelet",
        blocks: [
          { name: "Silicone band", role: "Closed cuff with a window on one side.", tech: "Medical-grade silicone, matte grey" },
          { name: "NFC chip and coil", role: "The flat spiral coil picks up the reader's field and powers the chip.", tech: "Passive NFC, no battery" },
          { name: "Overmolded seal", role: "Closes the window over the board.", tech: "Designed for IP68" },
        ],
      },
      {
        name: "Field",
        blocks: [
          { name: "Phone field app", role: "Scans the wristband. Records pulse, respiratory rate and consciousness level. Has a Sync Now button.", tech: "Concept screens" },
        ],
      },
      {
        name: "Hospital",
        blocks: [
          { name: "Tags and scans", role: "Tags List, Scan Bracelet and Update Tag screens per bracelet ID.", tech: "SmartTriage" },
          { name: "Location map", role: "Shows where each bracelet is.", tech: "SmartTriage" },
          { name: "Staff and activity", role: "Registered Staff and a feed of who labelled, updated or resolved a tag.", tech: "SmartTriage" },
        ],
      },
    ],
    links: [
      { from: "Reader", to: "NFC chip", label: "the reader's field is the only power source" },
      { from: "Field app", to: "SmartTriage", label: "Sync Now; offline mesh sync is pitched, not shown" },
      { from: "SmartTriage", to: "Header counts", label: "Morgue, Immediate, Delayed and Minor counts on every screen" },
    ],
  },
  stages: [
    {
      date: "Feb. 2026",
      phase: "Problem",
      title: "Paper triage tags lose information between the field and the hospital",
      summary:
        "The pitch opened on three numbers for hospitals and first responders in Montreal. Paper tags have no digital sync, so the hospital has no real-time view of incoming patients.",
      stats: [
        { value: "30%", label: "triage error rate" },
        { value: "$1.7B", label: "annual malpractice losses" },
        { value: "10.5 h", label: "Montreal ER wait times" },
      ],
      points: [
        "Paramedics: the canvas targets the 30% error rate by replacing paper with a digital record that survives the field.",
        "Hospitals: the canvas calls the 10.5 hours an information blackout. Real-time visibility of incoming patients ends it.",
        "Health system: continuous, audited digital tracking aims at the $1.7B in malpractice losses.",
      ],
      media: [{ src: `${M}problem.webp`, caption: "Pitch slide 2, The Hidden Crisis: 30% triage error rate, $1.7B losses, 10.5 h ER waits", kind: "document" }],
    },
    {
      date: "Feb. 2026",
      phase: "Concept",
      title: "A $1.50 passive tag between $0.50 paper and $50+ active tags",
      summary:
        "The bracelet is sold as a consumable, so it has to be cheap and still sync digitally. A passive NFC tag takes its power from the reader, so it needs no battery and no charging.",
      tables: [
        {
          caption: "Feature comparison from pitch slide 5",
          head: ["Feature", "ResQ-Link", "Paper tags", "High-tech Stryker"],
          rows: [
            ["Unit cost", "$1.50", "$0.50", "$50.00+"],
            ["Power source", "Passive (no battery)", "None", "Active (needs charge)"],
            ["Digital sync", "Yes (offline mesh)", "No", "Yes"],
            ["Durability", "IP68 (silicone)", "None (paper)", "Mixed"],
          ],
        },
      ],
      points: [
        "ResQ-Link costs 3 times a paper tag ($1.50 / $0.50) and at most 1/33 of an active tag ($1.50 / $50).",
        "It is the only option in the table that syncs without a battery.",
        "The offline mesh sync is meant to move data to the hospital when cellular service fails.",
        "Quebec public contracts to local businesses rose from 78% to 85% between 2017 and 2026. The pitch used this as a barrier against Stryker and Motorola.",
      ],
      media: [{ src: `${M}comparison.webp`, caption: "Pitch slide 5: feature comparison and the Buy Quebec argument", kind: "document" }],
    },
    {
      date: "Feb. 7, 2026",
      phase: "Bracelet",
      title: "Three parts: silicone band, coil and chip, overmolded seal",
      summary:
        "The bracelet was modelled in SolidWorks (ResQ-Link.SLDPRT). The section view and the exploded view show every layer. No dimensions appear in the drawings.",
      points: [
        "Silicone outer band in matte grey. It is a closed cuff with a window on one side.",
        "NFC chip on a green board with a flat spiral copper coil. The coil picks up the reader's field, so the chip runs with zero stored power.",
        "Translucent overmolded seal closes the window over the board. The seal is designed for IP68.",
        "The early pitch named the core a proprietary low-frequency inductive core with hermetic overmolding.",
        "The canvas sources NFC chips and medical-grade silicone from Tier-1 manufacturers.",
      ],
      media: [
        { src: `${M}cutaway.webp`, caption: "Section view: inductive copper coil, passive NFC chip, translucent overmolded seal (IP68), silicone outer band", kind: "render" },
        { src: `${M}exploded.webp`, caption: "Exploded view: band, NFC chip with copper coil, overmold seal", kind: "render" },
      ],
      iterations: [
        {
          name: "Strap band with a pin buckle",
          summary: "Navy strap with adjustment holes and a pin buckle. A rectangular coil and chip glow under a clear window.",
          verdict: "revised",
          reason: "The SolidWorks part and both section views replace it with a closed silicone cuff and a separate seal insert.",
        },
        {
          name: "Closed cuff with overmolded seal",
          summary: "Matte grey silicone cuff, spiral coil on a board, translucent seal pressed into the window.",
          verdict: "kept",
          reason: "It is the version in the SolidWorks part, both section views and the final pitch deck.",
          media: { src: `${M}exploded.webp`, caption: "Final exploded view", kind: "render" },
        },
      ],
    },
    {
      date: "Feb. 8, 2026",
      phase: "Software",
      title: "SmartTriage: one dashboard per incident",
      summary:
        "SmartTriage is the command center the hospital sees. The screens are set on Incident 1, Flooding. A header row counts tags in each category on every screen.",
      stats: [
        { value: "457", label: "units deployed in the demo" },
        { value: "4", label: "triage categories" },
        { value: "4", label: "dashboard tabs" },
      ],
      points: [
        "Header counts in the demo data: Morgue 102, Immediate 78, Delayed 145, Minor 205.",
        "Tags List: each bracelet ID (UTX-000000 and up), its status, last tag signal and progress. A bracelet not yet scanned is flagged.",
        "Scan Bracelet: start a scan to add a bracelet or update its patient.",
        "Update Tag: a form tied to one bracelet ID with name, physical appearance, age range and gender.",
        "Registered Staff: each staff member's department, progress on tags and status.",
        "Bracelets Location Map: the real-time position of each bracelet on a map.",
        "New Tag Activities: a feed of who labelled, updated or resolved a tag, with its category.",
        "A phone field app concept scans the wristband and records pulse, respiratory rate and consciousness level. It lists patients by colour and has a Sync Now button.",
        "Code: github.com/Louiszhang2005-1/Band (linked from the drawings).",
      ],
      media: [
        { src: `${M}dash-tags.webp`, caption: "Tags List: bracelet IDs, status, last signal and progress", kind: "screenshot" },
        { src: `${M}dash-overview.webp`, caption: "Overview: deployed tags over 3 days by category, 457 units", kind: "screenshot" },
        { src: `${M}dash-map.webp`, caption: "Bracelets Location Map", kind: "screenshot" },
        { src: `${M}dash-scan.webp`, caption: "Scan Bracelet: add or update a patient", kind: "screenshot" },
        { src: `${M}dash-update.webp`, caption: "Update Tag form for bracelet UTX-0000000", kind: "screenshot" },
        { src: `${M}dash-staff.webp`, caption: "Registered Staff with progress on tags (demo data)", kind: "screenshot" },
      ],
    },
    {
      date: "Feb. 8, 2026",
      phase: "Cost model",
      title: "$0.30 to make, $1.50 to sell, 80% gross margin",
      summary:
        "The bracelet is the consumable blade. The dashboard is the razor, sold as a yearly readiness fee. The unit cost only holds after injection molding tooling.",
      calcs: [
        {
          title: "Unit cost of goods (COGS) at scale",
          given: ["Chip and coil = $0.18", "Silicone = $0.07", "Packaging = $0.05"],
          steps: ["COGS = 0.18 + 0.07 + 0.05", "COGS = $0.30 per bracelet"],
          result: "$0.30 per bracelet",
          source: "Pitch slide 8, Phased cash burn and unit economics",
          proof: { src: `${M}unit-economics.webp`, caption: "Pitch slide 8: COGS breakdown and seed round split", kind: "document" },
        },
        {
          title: "Gross margin per bracelet",
          given: ["Price = $1.50", "COGS = $0.30"],
          steps: ["Gross profit = 1.50 - 0.30 = $1.20", "Gross margin = 1.20 / 1.50 = 0.80"],
          result: "80% gross margin",
          source: "Pitch slide 6, Business model",
          proof: { src: `${M}business-model.webp`, caption: "Pitch slide 6: hardware blade and software razor", kind: "document" },
        },
        {
          title: "Cost drop from prototype to molded part",
          given: ["Prototype = $125 per unit (canvas)", "Pilot range = $100 to $150 per unit (pitch)", "Molded target = $0.30"],
          steps: ["125 / 0.30 = 417", "Midpoint of the pilot range = (100 + 150) / 2 = $125"],
          result: "About 417 times cheaper once tooling is paid",
          source: "Business model canvas, cost structure; pitch slide 7",
        },
      ],
      points: [
        "Software readiness fee: $10k to $50k per facility per year.",
        "Revenue is sold in high-volume institutional contracts, business to government and business to business.",
      ],
      media: [{ src: `${M}canvas.webp`, caption: "Business model canvas, Feb. 8, 2026", kind: "document" }],
    },
    {
      date: "Feb. 8, 2026",
      phase: "Pitch",
      title: "From a 7-slide deck to an 8-slide pitch",
      summary:
        "The deck went through three saved versions. The final one uses plain feature words and gives the money ask its own slide.",
      iterations: [
        {
          name: "First deck, 7 slides",
          summary: "Tagline: The Digital System for Disaster Response. Features listed as zero-power induction, hermetic overmolding and offline-mesh sync. Roadmap and ask shared one slide.",
          verdict: "revised",
          reason: "The final pitch replaced the three technical features with plain benefits.",
          media: { src: `${M}solution-v1.webp`, caption: "First deck, Solution slide", kind: "document" },
        },
        {
          name: "Roadmap and ask on one slide",
          summary: "Three phases, the $750,000 ask, the burn pie chart and the COGS list on a single slide.",
          verdict: "revised",
          reason: "Split into slide 7 (roadmap) and slide 8 (ask and unit economics) in the final pitch.",
          media: { src: `${M}roadmap-v1.webp`, caption: "First deck, slide 7", kind: "document" },
        },
        {
          name: "Final pitch, 8 slides",
          summary: "Tagline: The Digital System for Disaster Management. Features rewritten as no battery needed, cost-effective resilient materials and zero-infrastructure setup.",
          verdict: "kept",
          reason: "This is the deck exported to PDF for the portfolio. A copy in the project archive also used the tagline The Digital Nervous System for Disaster Response.",
          media: { src: `${M}solution-v2.webp`, caption: "Final pitch, Solution slide", kind: "document" },
        },
      ],
      tables: [
        {
          caption: "Market sizing from the market slide",
          head: ["Level", "Market", "Size"],
          rows: [
            ["TAM", "North American tech", "$43.5B"],
            ["SAM", "Canadian EMS", "$1.2B"],
            ["SOM", "Montreal and Laval, first market", "$1.36M"],
          ],
        },
      ],
      points: [
        "The Quebec 2025-2026 budget is $130.6B. The canvas targets its $5.9B digital modernization share.",
        "Entry through Urgences-santé and the MUHC networks.",
      ],
      media: [{ src: `${M}market.webp`, caption: "Market slide: TAM, SAM and SOM", kind: "chart" }],
    },
    {
      date: "0 to 18+ months",
      phase: "Production",
      title: "Pilot, certification, then molded bands",
      summary:
        "The plan asks for a $750,000 seed round over three phases. Printed units prove the design first, and tooling comes last.",
      tables: [
        {
          caption: "Roadmap and seed round split (pitch slides 7 and 8)",
          head: ["Phase", "Share", "Amount", "Work", "Goal"],
          rows: [
            ["1. Pilot", "30%", "$225,000", "3D printed units with hand-assembled PCBs, ~$100 to $150 each; on-site support at MUHC", "Prove zero-power durability in 5,000 live triage cases"],
            ["2. Regulatory", "40%", "$300,000", "Health Canada Class I/II and ISO 13485 audit, $120,000 to $150,000; Buy Quebec legal fees", "Become a priority supplier"],
            ["3. Expansion", "30%", "$225,000", "Injection molding tooling", "Reach $0.30 COGS and 80% margin; expand to Ontario and US Northeast EMS"],
          ],
        },
      ],
      points: [
        "Amounts are the slide percentages applied to $750,000: 0.30 × 750,000 = $225,000 and 0.40 × 750,000 = $300,000.",
        "The canvas names the field test site: the Royal Victoria Hospital at the MUHC, in a 6-month pilot.",
      ],
      media: [{ src: `${M}roadmap.webp`, caption: "Pitch slide 7: phased go-to-market plan", kind: "document" }],
    },
  ],
  sources: [
    "ResQ-Link pitch deck, final 8 slides (PowerPoint and PDF export)",
    "ResQ-Link first deck, 7 slides, and an archived copy of the pitch",
    "Portfolio.pdf: section view, exploded view and 7 SmartTriage dashboard screens",
    "Section View.png and ResQ- Link.png renders from the SolidWorks part ResQ-Link.SLDPRT",
    "Business model canvas, UpStart, Feb. 8, 2026",
  ],
};

export default dive;
