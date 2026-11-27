import type { TechDive } from "./types";

/** Built from the Mechie repo (frontend, FastAPI bot, Blender add-on, docs), its git log, and the Pratt J58 render folder. */
const dive: TechDive = {
  heading: "How MechPrep turns a CAD engine into an interview",
  intro:
    "MechPrep puts a 3D jet engine in the browser and runs a technical interview around it. The candidate clicks a part, and a Gemini interviewer asks about that part. The repo has 64 commits between Jan. 17 and Jan. 18, 2026, at McHacks 13.",
  stages: [
    {
      date: "Dec. 31, 2025",
      phase: "Model",
      title: "A J58 engine built before the hackathon",
      summary:
        "The engine model existed before the event. The Blender file is dated Dec. 31, 2025, next to a Fusion source (J58 v28.f3d) and STEP, STL, FBX and GLB exports.",
      points: [
        "The web app loads one GLB file, Pratt_Engine.glb, with named meshes.",
        "A second assembly, a low-bypass turbofan, exists as 6 CATIA parts: combustion, HP turbine, LP compressor, nozzle, casing, spinner and stators.",
      ],
      media: [
        { src: "/media/mechprep/deep/j58-exterior.webp", caption: "J58 render, exterior.", kind: "render", shape: "wide" },
        { src: "/media/mechprep/deep/j58-section.webp", caption: "J58 render, half section: compressor stages, combustor and turbine.", kind: "render", shape: "wide" },
        { src: "/media/mechprep/deep/j58-cutaway.webp", caption: "J58 render, cutaway from the intake.", kind: "render", shape: "wide" },
      ],
    },
    {
      date: "Jan. 17, 13:58 to 18:13",
      phase: "Backend",
      title: "Mechie: a FastAPI coach on Gemini",
      summary:
        "The bot started as Python scripts for a chat coach, a voice output and a Blender add-on. It was then moved from Flask to FastAPI so the React app and Blender could share one API.",
      tables: [
        {
          caption: "API on port 8000 (Mechie_bot.py)",
          head: ["Endpoint", "Input", "What it does"],
          rows: [
            ["POST /ask_mechie", "selected parts, question", "One-shot answer. The system prompt limits it to mechanical engineering."],
            ["GET /get_question/{id}", "question id", "Returns a scripted scenario question."],
            ["POST /submit_answer", "selected part, chat history", "Gemini plays a Pratt & Whitney interviewer and judges the answer."],
            ["POST /chat", "full message history, selected part", "Gemini plays a senior propulsion engineer and leads the interview."],
          ],
        },
      ],
      iterations: [
        {
          name: "Flask on port 5000",
          summary: "First backend for the bot.",
          verdict: "dropped",
          reason: "Migrated to FastAPI with Pydantic request models, CORS and auto docs at /docs (FASTAPI_MIGRATION.md).",
        },
        {
          name: "Blender right-click add-on",
          summary: "Select objects in Blender, ask Mechie, get an answer with the part names as context.",
          verdict: "revised",
          reason: "Kept in the repo, but the demo moved the same part context into the browser.",
        },
        {
          name: "Spoken answers with Gemini TTS",
          summary: "Mechie_voice.py renders answers with the Fenrir (male) or Gacrux (female) voice.",
          verdict: "revised",
          reason: "The /ask_mechie route now returns text with voice_played set to false.",
        },
      ],
    },
    {
      date: "Jan. 17, 20:59 to Jan. 18, 05:24",
      phase: "Frontend",
      title: "Clickable engine parts in React Three Fiber",
      summary:
        "The frontend loads the GLB with drei, then maps every mesh to one of 5 parts by walking up its parent names. Hover highlights the part and shows a label. A click selects it and starts the interview.",
      tables: [
        {
          caption: "Part mapping (App.jsx)",
          head: ["Part", "Mesh name match", "Label note"],
          rows: [
            ["Compressor", "contains 'compressor'", "Compresses intake air before combustion"],
            ["Turbine", "contains 'turbine'", "Extracts energy from hot exhaust gases"],
            ["Fuel Tank", "contains 'fuel' or 'tank'", "Stores and supplies fuel to engine"],
            ["Outer Shell", "contains 'outer', 'shell' or 'casing'", "Protective outer casing of engine"],
            ["Deflector", "contains 'deflector'", "Directs and controls airflow"],
          ],
        },
      ],
      calcs: [
        {
          title: "Click or drag",
          given: ["Pointer down at (x₀, y₀), up at (x₁, y₁)", "DRAG_THRESHOLD = 5 px"],
          steps: ["d = √((x₁ − x₀)² + (y₁ − y₀)²)", "d < 5 px counts as a click and selects the part", "d ≥ 5 px is an orbit drag and selects nothing"],
          result: "Rotating the model never selects a part by accident.",
          source: "frontend/src/App.jsx (handlePointerUp)",
        },
      ],
      points: [
        "Each mesh gets its own cloned material, so highlighting one part does not tint the others.",
        "The scene renders at a device pixel ratio capped at 1.5.",
      ],
    },
    {
      date: "Jan. 18, 06:26 to 10:42",
      phase: "Product",
      title: "Landing page, interview card and login",
      summary:
        "The last hours added a landing page with the engine explorer beside the chat, a scenario card with a difficulty tag, and a login page.",
      iterations: [
        {
          name: "Auto-tour of the engine",
          summary: "The scene cycled through parts on its own.",
          verdict: "dropped",
          reason: "Removed at 07:13 in the UI pass with larger text and a centered logo.",
        },
        {
          name: "Auth0 login",
          summary: "Auth0 React packages were added at 08:51.",
          verdict: "revised",
          reason: "The shipped login page checks the email format, waits 800 ms and accepts any password. Auth0 is never wired in.",
        },
        {
          name: "Keyword grading of answers",
          summary: "/submit_answer marks an answer correct if Gemini's reply contains words like 'correct' or 'well done'.",
          verdict: "kept",
          reason: "It was the fastest way to flag progress in the UI. The interview itself is left to Gemini.",
        },
      ],
      media: [
        { src: "/media/mechprep/landing.webp", caption: "MechPrep landing page.", kind: "screenshot", shape: "wide" },
      ],
    },
    {
      date: "Jan. 18, 2026",
      phase: "Shipped",
      title: "One scripted scenario, open-ended chat",
      summary:
        "The demo runs one Pratt & Whitney J58 scenario: find the high-pressure compressor, then explain the physics around it. Company logos on the page list Lockheed Martin, Pratt & Whitney, Airbus, Bombardier, Pomerleau and ABB.",
      tables: [
        {
          caption: "Scripted scenario (Interview_data.py)",
          head: ["Id", "Type", "Question", "Check"],
          rows: [
            ["1", "identification", "Identify the High Pressure Compressor (high-cycle fatigue case).", "target mesh compressor_hp_mesh"],
            ["2", "explanation", "Why is the HP compressor on a smaller radius than the fan?", "rubric: density increase, conservation of mass, or flow area reduction"],
          ],
        },
      ],
      stats: [
        { value: "5", label: "clickable engine parts" },
        { value: "4", label: "API endpoints" },
        { value: "64", label: "commits in 2 days" },
      ],
    },
  ],
  sources: [
    "Mechie repo: frontend/src/App.jsx, package.json",
    "Mechie_bot_code/python_code: backend/Mechie_bot.py, Interview_data.py, Mechie_voice.py, blender/Blender_Mechie_Addon.py",
    "docs/FASTAPI_MIGRATION.md and docs/TEST_REPORT.md",
    "Pratt J58 Engine folder: Blender, Fusion and export files, 5 PNG renders",
    "Git log, Jan. 17 to 18, 2026",
  ],
};

export default dive;
