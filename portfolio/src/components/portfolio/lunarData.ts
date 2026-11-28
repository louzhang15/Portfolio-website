// Every number on this page comes from the structure team's design records (Polytechnique Montréal, AER/MEC1110, winter 2025).

export const chapters = [
  ["lunar-leadership", "Team & schedule"],
  ["lunar-concept", "Sketches & trade-offs"],
  ["lunar-evolution", "Design iterations"],
  ["lunar-rails", "Telescoping rails"],
  ["lunar-interfaces", "Interfaces"],
  ["lunar-calculations", "Calculations"],
  ["lunar-prototype", "Prototype tests"],
  ["lunar-retro", "Looking back"],
] as const;

export type ChapterId = (typeof chapters)[number][0];
export const chapterNumber = (id: ChapterId) => chapters.findIndex(([cid]) => cid === id) + 1;

export const leadStats = [
  ["3", "design reviews presented"],
  ["4", "partner teams integrated"],
  ["12 weeks", "from role split to final review"],
  ["30%", "under Stage 3 forecast, simulated billing"],
];

export const leadDuties = [
  "Split the roles in week one by matching tasks to skills: statics, CATIA V5 drafting, 3D printing and fabrication, Fusion 360 FEA.",
  "Built and ran the schedule through all three stages, from the needs analysis to the prototype demonstration.",
  "Modeled parts in CATIA V5 and merged teammates’ part files into one assembly.",
  "Checked the detail drawings before fabrication, including rail drawing C-101-1.",
  "Co-presented the structure and integration work at the final review.",
];

// Timeline in days from Jan. 19, 2025 (week 1) to Apr. 20, 2025.
export const TIMELINE_DAYS = 91;
export const phases = [
  { name: "Needs and functions", start: 0, end: 18 },
  { name: "Ideas and concept selection", start: 18, end: 52 },
  { name: "Detailed design and fabrication", start: 52, end: 87 },
];
export const milestones = [
  { day: 19, label: "Stage 1 report", date: "Feb. 7" },
  { day: 37, label: "Concept review", date: "Feb. 25" },
  { day: 57, label: "Stage 2 report", date: "Mar. 17" },
  { day: 70, label: "Drawings released", date: "Mar. 30" },
  { day: 86, label: "Final review", date: "Apr. 15" },
];
export const months = [
  { day: 0, label: "Jan." },
  { day: 13, label: "Feb." },
  { day: 41, label: "Mar." },
  { day: 72, label: "Apr." },
];

export const concepts = [
  {
    name: "Cableway", score: 197,
    file: "concept-cableway.webp", width: 814, height: 522,
    alt: "Sketch of a cable strung from the greenhouse dome to the habitat, with a gondola carrying the produce compartment.",
    tradeoff: "Fast and mechanically simple. The cable needs holes through the airlocks, and dust builds up on it.",
  },
  {
    name: "Tube with rails", score: 251, selected: true,
    file: "concept-sketch-tube.webp", width: 882, height: 510,
    alt: "Sketch of a tube on supports between the greenhouse and the habitat, with a cart running on rails inside.",
    tradeoff: "A fixed, enclosed route that keeps the produce out of the dust. Deployment and installation are the hard part.",
  },
  {
    name: "Rover", score: 206,
    file: "concept-sketch-rover.webp", width: 918, height: 499,
    alt: "Sketch of a box-shaped rover with solar panels, a docking arm, a compartment housing, and motors.",
    tradeoff: "Handles uneven ground, with complex mechanisms exposed to dust and a lot of control software.",
  },
];
export const TOP_SCORE = 251;

export const massLedger = [
  { label: "Concept review", detail: "Titanium, one piece", kg: 106.3 },
  { label: "Stage 2 review", detail: "Aluminum, two telescoping sections", kg: 80 },
  { label: "Stage 3 design", detail: "1 cm aluminum wall set by the thermal team", kg: 185 },
  { label: "Proposed fix", detail: "0.5 cm wall, agreed with the thermal team", kg: 95, proposed: true },
];
export const MAX_KG = 185;

export const reviews = [
  {
    stage: "Concept review", date: "Feb. 25, 2025",
    file: "evolution-cdr-assembly.webp", width: 843, height: 430,
    alt: "CATIA assembly of the single-piece tube on support legs, with the wagon and compartment at the open end and a sealed end cap beside it.",
    points: ["Grade 2 titanium shell, 46 cm outside diameter.", "Three pairs of legs raise the tube to the airlock openings.", "Two rails guide the wagon on a fixed path."],
    next: "Titanium is costly and hard to weld, and every leg joint was a weld. A single 3 m tube was also hard to launch and carry.",
  },
  {
    stage: "Stage 2 review", date: "Mar. 2025",
    file: "evolution-stage2-assembly.webp", width: 931, height: 507,
    alt: "CATIA model of the tube split into two telescoping sections on support legs, with a solar panel on a mast at one end.",
    points: ["6061 aluminum replaced titanium.", "Two 1.52 m sections slide into each other.", "Nested rails, welded legs, and a 35° solar panel mast."],
    next: "Splitting the tube made it stowable. It also created a sliding joint, a break in the rails, and a new dust seal.",
  },
  {
    stage: "Final review", date: "Apr. 15, 2025",
    file: "evolution-final-aluminum.webp", width: 1216, height: 580,
    alt: "CATIA model of the final telescoping aluminum tube with angled support legs and carry handles on top.",
    points: ["6061-T6 aluminum structure.", "Handles so two astronauts can carry and place each section.", "0.65 m³ deployed, 0.38 m³ stowed for launch."],
    next: "The thermal team’s 1 cm wall pushed the mass to 185 kg. Chapter 8 covers the fix.",
  },
];

export const railProblems = [
  { q: "How do the legs join the tube?", a: "Welded joints, which also favored aluminum over titanium." },
  { q: "How do the two sections slide without binding?", a: "Three grooves on the outer tube and three tabs on the inner tube, with powdered graphite on the bench prototype." },
  { q: "How do the rails stay supported when the tube extends?", a: "Each solid rail is fixed in the outer tube wall at one end and slides inside a hollow rail on the inner tube at the other." },
];

export const interfaces = [
  { team: "CSA brief", need: "A 3 m route between two airlocks.", answer: "Tube height adjusted by 4 cm so the opening lines up with each airlock." },
  { team: "Produce compartment team", need: "A sealed compartment that rides in the wagon.", answer: "Compartment and wagon sized to fit the tube’s clear diameter above the rails." },
  { team: "Transfer and docking team", need: "Conveyors that hand the compartment from wagon to airlock.", answer: "Wagon stops level with each airlock conveyor, so alignment became a structural requirement." },
  { team: "Propulsion and power team", need: "Wheel profile and spacing, power to the motors, a solar panel mount.", answer: "Rail profile follows the wheel, spacing is adjustable, the rails carry power, and a threaded mast lifts the panels above the regolith." },
  { team: "Thermal and dust team", need: "Insulation inside the shell, a seal at the sliding joint, 50 cm of regolith on top.", answer: "Aluminum wall with space for 1 cm of multilayer insulation, and a flexible seal at the joint." },
];

export const checks = [
  ["Leg stress on the Moon, tube loaded", "0.0535 MPa", "0.02%"],
  ["Leg stress on Earth, tube loaded", "0.324 MPa", "0.14%"],
  ["Shell stress at 4 g launch, axial", "0.47 MPa", "0.20%"],
];

export const reportFlags = [
  ["185 kg, mostly from the 1 cm wall.", "Agree a 0.5 cm wall with the thermal team. The report estimated about 95 kg."],
  ["The stepped rail profile needs custom machining.", "Redesign it around standard aluminum extrusions."],
  ["The sliding shell parts need special machining.", "Evaluate certified metal 3D printing for those parts."],
  ["Installation takes several steps on the Moon.", "Install the subsystems inside the tube before launch."],
];

export const myFlags = [
  ["The 1.5 factor was applied twice: once to the loads, again to the allowable (240 ÷ 1.5 = 160 MPa). The report then scaled 160 MPa by lunar gravity to 26.42 MPa, but yield strength does not change on the Moon.", "Apply the factor once and compare to 240 MPa yield. The table above does this. The conclusion holds; the method was wrong."],
  ["The 50 cm regolith cover never entered a load case. At about 1,500 kg/m³ it weighs several times the 185 kg tube.", "Check the legs and the shell (ring crushing) under the buried load."],
  ["Welding drops 6061-T6 to roughly half its yield strength near the joint. Our checks used the parent metal value.", "Use the as-welded allowable at every leg joint, or plan a post-weld heat treatment."],
  ["Graphite needs moisture to lubricate, so it stops working in vacuum.", "Use MoS₂ or a PTFE liner at the sliding joint of a flight design."],
  ["With stresses under 1% of yield, strength never sized the legs.", "Size them for buckling, stiffness, and handling loads, then cut mass."],
  ["The rail stress sheet reports 0.0308 MPa, but its own inputs (9,578 N·mm × 11.67 mm / 3,625 mm⁴) give 30.8 MPa: a unit slip of 1,000. Recomputing the section gives about 13,750 mm⁴ and 8.1 MPa. Both values stay well under the 160 MPa allowable (240 MPa / 1.5).", "Recompute stress from the actual section modulus, using consistent units throughout."],
  ["The bench test recorded no deflection, only that nothing visibly bent.", "Instrument the next test with a dial gauge and compare against the beam model."],
];
