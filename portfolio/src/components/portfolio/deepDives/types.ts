/**
 * Technical deep dive shown on a hardware case study as a timeline: one stage per step of the project, each with
 * its evidence (sketches, drawings, photos), worked calculations, design iterations and decision tables.
 * Every fact comes from the project's own files (reports, decks, drawings, code); French sources are translated.
 */

export type Media = {
  /** path under /public, e.g. /media/csa/deep/qfd.webp */
  src: string;
  /** what it shows, in English */
  caption: string;
  kind?: "photo" | "sketch" | "drawing" | "render" | "screenshot" | "chart" | "document";
  /** frame shape; drawings and documents are shown whole, photos fill the frame */
  shape?: "wide" | "tall" | "square";
};

/** A calculation worked step by step, with the page it came from as proof. */
export type Calc = {
  title: string;
  /** inputs, e.g. "F = 450 N (wagon + load)" */
  given?: string[];
  /** one line per step, plain text maths, e.g. "σ = M·c / I = 38.2 MPa" */
  steps: string[];
  result: string;
  /** e.g. "Stage 2 report, section 4.3" */
  source: string;
  /** scan or export of the original page */
  proof?: Media;
};

/** One concept or version of a design, and what happened to it. */
export type Iteration = {
  name: string;
  summary: string;
  verdict: "kept" | "revised" | "dropped";
  reason: string;
  media?: Media;
};

export type Table = { caption: string; head: string[]; rows: string[][] };

export type Stage = {
  /** "Sept. 2024", "Week 7", "Hour 0-6" */
  date: string;
  /** short label, e.g. "Requirements" */
  phase: string;
  title: string;
  summary: string;
  points?: string[];
  stats?: { value: string; label: string }[];
  media?: Media[];
  calcs?: Calc[];
  iterations?: Iteration[];
  tables?: Table[];
};

/** One part of the system: a sensor, a board, a service, a store or a screen. */
export type ArchBlock = {
  name: string;
  /** what it does, one short sentence */
  role: string;
  /** part number, language or library, e.g. "ESP32, FreeRTOS" */
  tech?: string;
};

/** The system as ordered layers of blocks, drawn top to bottom with arrows between layers. */
export type Architecture = {
  /** in flow order, e.g. Sensors, Edge, Backend, Interfaces */
  layers: { name: string; blocks: ArchBlock[] }[];
  /** named connections between blocks, listed under the diagram */
  links?: { from: string; to: string; label: string }[];
  /** how data or load moves through the layers, one short paragraph */
  flow: string;
};

export type TechDive = {
  heading: string;
  intro: string;
  architecture?: Architecture;
  stages: Stage[];
  /** the files this was built from, in plain words, e.g. "Stage 3 report (AER1110, French, translated)" */
  sources: string[];
};
