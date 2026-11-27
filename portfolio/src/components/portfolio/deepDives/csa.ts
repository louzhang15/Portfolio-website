import type { TechDive } from "./types";

const D = "/media/csa/deep/";
const M = "/media/csa/";

/**
 * Lunar Transport System (CSA LEAP, AER1110, winter 2025), structure and integration team.
 * Built from the structure team's stage 1, 2 and 3 reports, the design review decks, the critical-part sheets and the
 * detail drawings (French, translated). Calculation pages and drawings stay in French as images.
 */
const dive: TechDive = {
  heading: "From needs to a tested telescopic tube",
  intro:
    "Five student teams shared one mandate from the Canadian Space Agency: move a vegetable compartment 3 m from a lunar greenhouse to a habitat. Our team owned the main structure and the integration of the four other teams: compartment, transfer and docking, propulsion and power, and thermal and dust. The project ran in three stages from January to April 2025, with four design reviews. Original pages are shown in French; the text beside them explains what they show.",
  architecture: {
    flow:
      "Produce rides in the compartment team's container inside the wagon. The transfer team's conveyor in the greenhouse airlock loads the wagon onto the rails. The wagon runs 3 m on two rails and draws power from the propulsion and power team through them. A conveyor in the habitat airlock unloads it. Weight goes from the wagon to the rails, the tube wall and 6 legs: 185 kg in total gives 50.0 N per leg on the Moon.",
    layers: [
      {
        name: "Payload (compartment team)",
        blocks: [
          { name: "Vegetable compartment", role: "Holds 150 g of produce in a 10 cm by 10 cm cylinder. Sits inside the wagon.", tech: "Compartment team" },
        ],
      },
      {
        name: "Transfer (transfer team)",
        blocks: [
          { name: "Greenhouse airlock conveyor", role: "Loads the wagon into the tube.", tech: "Transfer team, conveyor height 1.25 cm" },
          { name: "Habitat airlock conveyor", role: "Unloads the wagon at the other end.", tech: "Transfer team" },
        ],
      },
      {
        name: "Transport",
        blocks: [
          { name: "Wagon", role: "Carries the compartment along the 3 m route.", tech: "Propulsion team wheels, 29 mm wheel track" },
          { name: "Hollow rails", role: "Rails on the small tube. A chamfer lets the wheel pass onto the solid rail.", tech: "Structure team, C-101-1, 1700 mm, 4.4 kg" },
          { name: "Solid rails", role: "Rails on the large tube. They slide into the hollow rails.", tech: "Structure team, C-101-2, 1540 mm, 2.8 kg" },
        ],
      },
      {
        name: "Structure (our team)",
        blocks: [
          { name: "Large tube", role: "Outer section with 3 internal grooves at 120°.", tech: "C-102-1, Ø 540 mm, 1600 mm, 79.6 kg" },
          { name: "Small tube", role: "Slides into the large tube on 3 ribs. Deploys to 3 m, stows at 1.6 m.", tech: "C-102-2, Ø 500 mm, 1600 mm, 70.2 kg" },
          { name: "Legs", role: "6 legs raise the tube to the airlock openings and share its weight.", tech: "1400 mm² section, Al 6061" },
        ],
      },
      {
        name: "Power and protection",
        blocks: [
          { name: "Solar panels", role: "Power the wagon through the rails. They sit above the regolith.", tech: "Propulsion and power team, support C-103-1 at 35°" },
          { name: "Wall and seals", role: "Aluminium and MLI wall, a flexible seal at the sliding joint and a seal at each airlock.", tech: "Thermal and dust team, 2 cm wall" },
        ],
      },
    ],
    links: [
      { from: "Airlock conveyors", to: "Wagon", label: "conveyor lined up with the wagon; the tube was lowered 4 cm to match" },
      { from: "Wagon", to: "Rails", label: "wheel to rail clearance 1.85 to 1.90 mm on the bench, target under 2 mm" },
      { from: "Small tube", to: "Large tube", label: "3 notches in 3 grooves, graphite at the opening, thermal team seal at the joint" },
      { from: "Solar panels", to: "Rails", label: "Solar power reaches the wagon through the rails" },
      { from: "Legs", to: "Lunar surface", label: "185 kg × 1.62 / 6 = 50.0 N per leg, 0.0535 MPa" },
    ],
  },
  stages: [
    {
      date: "Jan. to Feb. 7, 2025",
      phase: "Requirements",
      title: "Client needs, two houses of quality",
      summary:
        "Stage 1 turned meetings with the CSA mentor into ranked needs, then into measurable characteristics (house of quality 1) and functions for the structure (house of quality 2).",
      points: [
        "Explicit needs ranked 1 to 10 by the CSA. Transport, produce preservation and environmental protection scored 9.",
        "Payload set at 150 g in a 10 cm by 10 cm cylinder. Route set at 3 m, straight and flat, in 10 minutes or less.",
        "Launch load target from the SpaceX Falcon 9 stage 1 peak: 4.5 g for 40 s. Redundancy factor of 2 for essential systems.",
        "House of quality 2 kept the characteristics with the most weight for the structure team: payload, total load capacity (12%), structural strength, interoperability and lunar protection (22% together).",
        "Late answers from the client delayed the ranking. The team added hours and outside sources to deliver on Feb. 7.",
      ],
      stats: [
        { value: "150 g", label: "payload" },
        { value: "3 m", label: "route length" },
        { value: "4.5 g", label: "launch load, 40 s" },
        { value: "176 h", label: "team hours, stage 1" },
      ],
      tables: [
        {
          caption: "Explicit needs and their relative importance (stage 1 report, table 1)",
          head: ["Need", "Importance (1 to 10)"],
          rows: [
            ["Transport the compartment", "9"],
            ["Preserve the vegetables", "9"],
            ["Environmental protection", "9"],
            ["Operating autonomy", "8"],
            ["Limited astronaut intervention", "7"],
            ["Dock the compartment", "7"],
            ["Travel between the two airlocks", "5"],
            ["Energy autonomy", "5"],
          ],
        },
      ],
      media: [
        {
          src: D + "hoq-mq1.webp",
          caption: "House of quality 1: CSA needs (rows) against 24 product characteristics (columns), with target values and relative weights at the bottom.",
          kind: "chart",
        },
      ],
    },
    {
      date: "Feb. 11, 2025",
      phase: "Concept generation",
      title: "Thirteen functions, about fifty ideas, six configurations",
      summary:
        "The team listed the functions from house of quality 2, sketched 4 to 6 ideas for each, then linked one idea per function into full configurations in a morphological matrix.",
      points: [
        "13 functions, from travelling between airlocks to resisting launch loads, radiation and pressure.",
        "About 50 ideas, for example rails, a rover, a cable, a truss structure, friction stir welding and composite walls.",
        "Six configurations came out of the matrix: rover, zipline, pneumatic tube, tube with rails, tube with zipline, conveyor.",
        "An early sketch shows the telescopic idea: two nested tubes with a small offset x, to keep a large enough inner diameter.",
      ],
      media: [
        {
          src: D + "morph-matrix.webp",
          caption: "Morphological matrix: one row per function, hand sketches per idea. Coloured lines link the ideas that form each configuration.",
          kind: "sketch",
        },
        {
          src: M + "telescopic-concept-sketch.webp",
          caption: "First sketch of the telescopic tube. The note says the offset x stays very small to keep enough diameter.",
          kind: "sketch",
          shape: "square",
        },
      ],
    },
    {
      date: "Feb. 18, 2025",
      phase: "Concept selection",
      title: "Zipline, tube or rover",
      summary:
        "A weighted Pugh matrix rated the six configurations on feasibility for the structure team. Four passed and three went to the second design review (PDR II), where every team presented its part of each concept. A company-wide matrix then picked the tube with rails.",
      points: [
        "Pugh criteria and weights: technical simplicity 0.12, fit for the other subsystems 0.11, mechanical reliability 0.11, airlock interface 0.10, transport volume 0.10, then cost, life, maintenance access and installation.",
        "Mass estimates used in the scoring: a lunar rover from 40 kg to 899 kg, a 6 m galvanized cable of 4 mm at 0.366 kg, a 3 m metal tube from 60 kg to 100 kg.",
        "Each of the five teams scored the three concepts on seven criteria out of 10. The tube with rails won all five tables.",
        "The CSA mentor advised making the tube and rails telescopic, to save space in the rocket.",
      ],
      tables: [
        {
          caption: "Structure team feasibility study, weighted Pugh matrix (stage 2 report, table 5)",
          head: ["Configuration", "Weighted score", "Rank", "Kept"],
          rows: [
            ["Tube with rails", "3.14", "1", "Yes"],
            ["Tube with zipline", "3.12", "2", "Yes"],
            ["Lunar rover", "2.84", "3", "Yes"],
            ["Zipline", "2.75", "4", "Yes"],
            ["Conveyor", "2.48", "5", "No"],
            ["Pneumatic tube", "2.40", "6", "No"],
          ],
        },
        {
          caption: "Company decision matrix, score out of 70 per team (stage 2 report, annex F)",
          head: ["Team", "Tube with rails", "Zipline", "Rover"],
          rows: [
            ["Structure", "49", "47", "40"],
            ["Compartment", "50", "42", "44"],
            ["Transfer and docking", "54", "42", "46"],
            ["Propulsion and power", "46", "33", "39"],
            ["Thermal and dust", "52", "33", "37"],
            ["Total", "251", "197", "206"],
          ],
        },
      ],
      iterations: [
        {
          name: "Zipline (cable system)",
          summary: "A cable between greenhouse and habitat. A rack lifts one end so gravity moves the compartment. A hook docks onto a ring on the compartment.",
          verdict: "dropped",
          reason: "Needs holes through the airlocks, is hard to protect from regolith, and scored 197 of 350. Our team rated its reliability 4 of 10.",
          media: { src: M + "concept-cableway.webp", caption: "Zipline sketch: pulley, gondola, greenhouse and habitat.", kind: "sketch" },
        },
        {
          name: "Tube with rails",
          summary: "A two-section telescopic Al 6061 tube on 3 pairs of legs. A wagon runs on rails inside, conveyors in each airlock load it, solar panels sit on top, 50 cm of regolith covers it.",
          verdict: "kept",
          reason: "First in our team's Pugh matrix (3.14) and in all five team matrices (251 of 350). Simple, fixed path, and it shields the produce from regolith.",
          media: { src: M + "concept-sketch-tube.webp", caption: "Tube and rails sketch: tube, supports and rails between greenhouse and habitat.", kind: "sketch" },
        },
        {
          name: "Lunar rover",
          summary: "A solar-powered rover with suspension, a sealed door for maintenance and a two-ring docking system.",
          verdict: "dropped",
          reason: "Needs complex mechanisms and much programming, and is more exposed to regolith. Our team rated its simplicity 1 of 10. Total 206 of 350.",
          media: { src: M + "concept-sketch-rover.webp", caption: "Rover sketch: solar panels, motors and batteries, compartment box, wheels with suspension.", kind: "sketch" },
        },
      ],
      media: [
        { src: D + "pugh-matrix.webp", caption: "Structure team Pugh matrix: six configurations scored 1 to 4 on ten weighted criteria.", kind: "chart" },
        { src: D + "pdr-tube-concept.webp", caption: "PDR II slide for the tube: load spreading, the telescopic sketch and the 3 m truss support idea, with pros and cons.", kind: "document" },
        { src: D + "company-scores.webp", caption: "Total score of each concept over the five team matrices.", kind: "chart" },
      ],
    },
    {
      date: "Feb. 25, 2025",
      phase: "First design",
      title: "Critical design review: a titanium tube",
      summary:
        "The first CAD of the chosen concept used commercial grade 2 titanium. It already had two telescopic sections, three pairs of legs to raise the tube to the airlock openings, and two rails for the wagon.",
      points: [
        "Outer diameter 46.0 cm, main opening 44.0 cm. Legs 3.50 x 10.45 x 4.00 cm.",
        "Calculated with a safety factor of 1.5: structural mass 106.3 kg, payload 10 kg, 33.6 kPa on one leg, 0.510 mm leg elongation, 1.51 mm tube elongation.",
        "Interfaces set at this review: the compartment sits inside the wagon, the transfer team's loading systems sit inside the structure, propulsion loads were added to the calculations, and the thermal and dust team chose the material.",
      ],
      iterations: [
        {
          name: "Grade 2 titanium structure",
          summary: "Titanium shell, allowable stress 183.33 MPa, 106.3 kg of structure.",
          verdict: "revised",
          reason: "Replaced by aluminium 6061 for stage 2, a material choice made with the thermal and dust team. The stage 3 report justifies it: aluminium is cheaper and easier to weld than titanium, and making it takes 210 MJ/kg against 690 MJ/kg.",
          media: { src: M + "evolution-cdr-assembly.webp", caption: "Critical design review assembly with the compartment and wagon in place.", kind: "render" },
        },
      ],
    },
    {
      date: "Mar. 2025, report Mar. 17",
      phase: "Detailed design",
      title: "Telescopic tube and telescopic rails",
      summary:
        "Stage 2 fixed the architecture in CATIA V5: two 1.52 m aluminium sections that slide into each other, with rails that slide too, so the wagon keeps one continuous path when the tube is deployed.",
      points: [
        "Tube: 3 internal grooves in the large section guide 3 notches on the small section.",
        "Rails: 2 symmetric pairs. Hollow rails on the small tube, solid rails on the large tube, sliding into each other.",
        "Inner diameters 50.0 cm and 48.2 cm, wall 2 cm (aluminium and MLI), structure about 80 kg.",
        "Solar panel support: 76.0 x 54.0 cm plate at 35° on a 65.0 cm threaded tube, screwed into the main tube to sit above the regolith.",
        "The tube was lowered 4 cm so the wagon lines up with the airlock conveyors (the transfer team's wagon conveyor height is 1.25 cm).",
        "Stage 2 cost 300 team hours against 176 for stage 1. The gap came from integration sessions in weeks 6 and 7, as every team changed its parts, and from a backup hand-built mock-up made while the CAD was adapted for 3D printing.",
      ],
      iterations: [
        {
          name: "Leg to tube joint",
          summary: "How to join the legs to the tube body.",
          verdict: "kept",
          reason: "Welded legs.",
        },
        {
          name: "Friction in the sliding joint",
          summary: "How to reduce friction between the two tube sections.",
          verdict: "kept",
          reason: "Powdered graphite to lubricate the opening of the tube.",
        },
        {
          name: "Supporting telescopic rails",
          summary: "How to hold rails that must slide.",
          verdict: "kept",
          reason: "One end of each solid rail is set into the tube wall. The other end rests in the hollow rail.",
        },
        {
          name: "3D printed mock-up",
          summary: "The first CAD was hard to print with FDM and risked failed prints.",
          verdict: "revised",
          reason: "Three members built a backup mock-up by hand while one adapted the CAD. The adapted CAD printed, so the backup was not used.",
        },
      ],
      tables: [
        {
          caption: "Structure team interfaces with the other teams (stage 2 review)",
          head: ["Team", "What the structure had to accommodate"],
          rows: [
            ["CSA", "3 m route, airlock opening size, tube height adjusted by 4 cm"],
            ["Transfer and docking", "Wagon conveyor dimensions and alignment with the airlock conveyors"],
            ["Propulsion and power", "Wheel shape and spacing, power through the rails, solar panels"],
            ["Thermal and dust", "Aluminium and MLI wall (2 cm), flexible seal at the sliding joint, seal between airlock and tube"],
          ],
        },
      ],
      calcs: [
        {
          title: "Stage 2 sizing: tube volume, mass and leg stress",
          given: [
            "Large tube Ø 4.6 dm outside, 4.5 dm inside; small tube Ø 4.5 dm and 4.4 dm; each 15.2 dm long",
            "Al 6061 density 2.70 kg/dm³, legs 2.37 kg",
            "Tube, regolith and payload 90.5 kg, lunar gravity 1.62 N/kg",
            "6 legs, leg section 35 x 40 mm (1400 mm²), safety factor 1.5",
          ],
          steps: [
            "V = π/4 (4.6² − 4.5²) × 15.2 + π/4 (4.5² − 4.4²) × 15.2 = 21.48 dm³",
            "m cylinders = 2.70 × 21.48 = 58.00 kg",
            "m total = 58.00 + 2.37 = 60.37 kg",
            "F = 90.5 × 1.62 = 146.61 N, so 146.61 / 6 = 24.4 N per leg",
            "σ max = 24.4 N / 1400 mm² × 1.5 = 26.18 × 10⁻³ MPa",
          ],
          result: "0.026 MPa in one leg on the Moon, against 240 MPa yield for Al 6061.",
          source: "Stage 2 report, annex E, table 12 (Mar. 17, 2025)",
          proof: { src: D + "stage2-leg-calc.webp", caption: "Table 12 of the stage 2 report: volume, mass, leg stress and leg strain.", kind: "document" },
        },
      ],
      media: [
        { src: M + "telescopic-assembly-cad.webp", caption: "Exploded structure subassembly: small tube, large tube, nested rails and the solar panel support.", kind: "render" },
        { src: M + "evolution-stage2-assembly.webp", caption: "Stage 2 CAD: two aluminium sections, legs and the 35° solar panel mast.", kind: "render" },
        { src: D + "stage2-section-subsystems.webp", caption: "Section view of the full assembly: tube and rails (structure team), conveyor (transfer team), wheels and motor (propulsion and power team), material and seals (thermal and dust team).", kind: "render" },
        { src: D + "stage2-dimensions.webp", caption: "Stage 2 review slide: tube diameters, wall thickness, solar support and leg strain.", kind: "document" },
        { src: M + "wheel-rail-interface-clean.webp", caption: "Wheel to rail interface. The propulsion team's wheel spacing set the rail spacing.", kind: "render" },
      ],
    },
    {
      date: "Mar. 29 to Apr. 20, 2025",
      phase: "Calculations",
      title: "Free-body diagrams, rail bending and leg stress",
      summary:
        "Stage 3 checked the critical parts by hand. The rail is the critical part: it spans between supports, and the worst case is the loaded wagon at midspan. Every load used a safety factor of 1.5 from NASA GEVS standard 2.2.5.",
      points: [
        "Assumptions: uniform sections, continuous, homogeneous and isotropic material.",
        "Shear stress was left out of the rail check: for a point load it is usually smaller than the normal stress.",
        "The leg loads assume 6 legs share the weight evenly, which the free-body diagram of one leg pair shows (A = B = W/2).",
        "The report compares each stress to a critical value of 160 MPa for Earth cases and 26.42 MPa for lunar cases.",
      ],
      iterations: [
        {
          name: "Rail span 1.50 m",
          summary: "Mar. 29 and Apr. 1 sheets: supports 0.75 m either side of the wagon. Reactions 12.77 N, peak moment 9.58 N·m.",
          verdict: "revised",
          reason: "The stage 3 report (Apr. 20) uses the final rail span of 1.54 m: reactions 12.75 N, peak moment 9817.5 N·mm.",
        },
      ],
      calcs: [
        {
          title: "Rail free-body, shear and moment diagrams",
          given: [
            "Wagon at midspan, 0.75 m from the last support",
            "Total load 10.5 kg, lunar weight 17.031 N",
            "Safety factor 1.5, design load 25.55 N",
            "Simple support at each end, support moments neglected",
          ],
          steps: [
            "ΣM_C = 0: −A_y (1.5 m) + 25.55 (0.75 m) = 0, so A_y = 12.77 N",
            "ΣF_y = 0: A_y + C_y = 25.55 N, so C_y = 12.77 N",
            "Shear: −12.77 N from A to B, +12.77 N from B to C",
            "Moment: 0 at A, 9.58 N·m at B, 0 at C",
          ],
          result: "Peak bending moment 9.58 N·m at midspan, shear 12.77 N.",
          source: "DCL, DET and DMF sheet for a rail (session 9, Mar. 29, 2025)",
          proof: { src: D + "rail-fbd-sheet.webp", caption: "Original sheet: inputs, hand free-body diagram, shear (DET) and moment (DMF) plots.", kind: "document" },
        },
        {
          title: "Critical-part sheet: small rail in bending",
          given: [
            "Part: small rail, total load at its centre",
            "w = 10.5 kg × 1.5 × 1.62 N/kg = 25.5 N, span 2 × 750 mm",
            "Rail section: stepped profile 30 mm wide, 20 mm high, steps 10 mm and 15 mm",
          ],
          steps: [
            "Reactions: A_y = C_y = 12.77 N",
            "Areas under shear diagram: −9577.5 N·mm then +9577.5 N·mm, so M_max = 9578 N·mm at B",
            "Centroid: ȳ = (ȳ₁A₁ + ȳ₂A₂) / (A₁ + A₂) = 8.33 mm",
            "Second moment of area (sheet value): I_z = 3625 mm⁴",
            "Compression: σ = −M y_max / I_z = −(9578)(11.67) / 3625",
            "Tension: σ = −(9578)(−8.33) / 3625",
          ],
          result: "The sheet records −0.03083 MPa in compression (the larger magnitude) and 0.0220 MPa in tension.",
          source: "S10 critical-part strength sheet (session 10, Apr. 1, 2025), repeated in stage 3 report annex J",
          proof: { src: D + "rdm-sheet-p1.webp", caption: "Page 1: free-body diagram, equilibrium and shear diagram.", kind: "document" },
        },
        {
          title: "Leg loads and leg stress, empty and loaded tube",
          given: [
            "Structural mass 136.5 kg, loaded tube 185 kg",
            "6 legs, leg section 1400 mm², safety factor 1.5",
            "g = 9.81 N/kg on Earth, 1.62 N/kg on the Moon",
          ],
          steps: [
            "Empty: 136.5 × 9.81 / 6 = 223 N per leg on Earth, 136.5 × 1.62 / 6 = 36.9 N on the Moon",
            "Loaded: 185 × 9.81 / 6 = 302 N on Earth, 185 × 1.62 / 6 = 50.0 N on the Moon",
            "σ = F × 1.5 / 1400 mm²: 302 N gives 0.324 MPa, 50.0 N gives 0.0535 MPa",
          ],
          result: "0.324 MPa on Earth and 0.0535 MPa on the Moon for a loaded tube, against 240 MPa yield.",
          source: "Stage 3 report, section 3.1, 3.2 and annex J, table 17 (Apr. 20, 2025)",
          proof: { src: D + "stage3-fbd.webp", caption: "Free-body diagrams of the structural load, of one leg pair, and of the rail at the 1.54 m span.", kind: "document" },
        },
      ],
      media: [
        { src: D + "rdm-sheet-p2.webp", caption: "Critical-part sheet, page 2: moment diagram, section properties and maximum stresses.", kind: "document" },
        { src: D + "stress-table.webp", caption: "Stage 3 annex J, table 17: maximum value against the critical value for each check.", kind: "document" },
      ],
    },
    {
      date: "Mar. 29 to Apr. 2025",
      phase: "Drawings and build",
      title: "Detail drawings, data sheets and the bench prototype",
      summary:
        "Our team drew every non-standard part in CATIA V5 with tolerances, wrote a data sheet per part, and built a scale bench prototype from 3D printed PLA and wood.",
      points: [
        "Part numbering C-1XX-Y: C for the five-team project, 1 for the structure team, XX for the part family, Y for the part.",
        "Large tube C-102-1: Ø 540 mm, 1600 mm long, 10 mm wall, 4 legs 270 mm high with 1400 mm² section, 3 internal grooves at 120°, 2 handles, 79.6 kg.",
        "Small tube C-102-2: Ø 500 mm outside, 460 mm inside, 1600 mm long, 3 external ribs at 120°, 2 legs, a Ø 70 mm threaded hole for the solar support, 70.2 kg.",
        "Hollow rails C-101-1: 1700 mm, 3 supports, a chamfer so the wheel passes onto the solid rail, 4.4 kg. Solid rails C-101-2: 1540 mm, 29 mm wheel track, 2.8 kg. Both carry current.",
        "Solar panel support C-103-1: 540 x 500 x 10 mm plate at 35° on a Ø 70 mm tube, 10.6 kg.",
        "Assembly drawing of the transportation tube: Ø 540 mm, 3080 mm long, legs joined by cold welding.",
        "Prototype cost $216.64 against $200 planned: $171.94 of 3D printing, $30.20 of dowels and tape, $11.50 of thermal blankets, $3.00 of panels. Three failed prints caused most of the gap.",
      ],
      media: [
        { src: D + "drawing-large-tube.webp", caption: "Detail drawing of the large structural tube C-102-1, aluminium 6061, with section A-A of the ribs.", kind: "drawing" },
        { src: D + "drawing-small-tube.webp", caption: "Detail drawing of the small telescopic tube C-102-2, aluminium 6061.", kind: "drawing" },
        { src: M + "rail-detail-drawing.webp", caption: "Rail drawing C-101-1 for the bench prototype: 1000 mm wooden rail, stepped 50 x 25 mm profile.", kind: "drawing" },
        { src: D + "drawing-hoops.webp", caption: "Mock-up frame hoop and half hoop, wood, Ø 520 / Ø 500 mm, 10 mm thick.", kind: "drawing", shape: "wide" },
        { src: D + "drawing-mockup-rails.webp", caption: "Mock-up rail samples in PLA, solid (63 x 41 mm) and hollow with a uniform 4 mm shell (72 x 50 mm), 150 mm long.", kind: "drawing", shape: "wide" },
        { src: M + "section-drawing.jpg", caption: "Transportation tube assembly, section view A-A: Ø 540 mm, 3080 mm.", kind: "drawing" },
        { src: M + "tube-interior.jpg", caption: "Bench prototype: insulated tube and rails during the build.", kind: "photo", shape: "tall" },
      ],
    },
    {
      date: "Apr. 15 to Apr. 20, 2025",
      phase: "Tests and final review",
      title: "Bench tests, final review and the stage 3 report",
      summary:
        "Our team tested the two functions of the rails on the bench, presented the structure at the final review on Apr. 15, and closed the project with the stage 3 report on Apr. 20.",
      points: [
        "Wheel to rail test: 3 runs, clearance 1.90, 1.90 and 1.85 mm against a target under 2 mm. The wagon stayed level and moved forward every time.",
        "Rail strength test, planned from NASA GEVS 2.4.1 (loads at 1.25 times the limit load): 4.80, 5.20, 5.60 and 6.00 kg held for 5 minutes each with no visible deformation. The test wagon weighs 4.0 kg.",
        "The test rails are wood, about 5 times weaker than aluminium per the report, so the aluminium rails are expected to pass.",
        "Final structure: 3 m deployed, 1.6 m stowed, 0.65 m³ deployed and 0.38 m³ stowed for launch. Handles let 2 astronauts carry it.",
        "Total mass with all subsystems: 185 kg. Stress in the tube at a 4 g launch: 0.47 MPa.",
        "Stage 3 took 329 team hours, billed $30,937.50 at the course's simulated rates against a $44,207.89 forecast. 76% of the hours were engineering.",
        "My role at stage 3: team manager and task coordination, CATIA V5 modelling of the assembly, and checking the detail drawings.",
      ],
      stats: [
        { value: "1.85 to 1.90 mm", label: "wheel to rail clearance" },
        { value: "6.00 kg", label: "largest bench load held" },
        { value: "185 kg", label: "total mass, final design" },
        { value: "0.0535 MPa", label: "leg stress on the Moon" },
      ],
      iterations: [
        {
          name: "1 cm aluminium wall",
          summary: "The protection team asked for 1 cm of aluminium plus 1 cm of MLI, which brought the mass to 185 kg.",
          verdict: "revised",
          reason: "The report proposes a 0.5 cm wall, agreed with the protection team, for about 95 kg, and leg sections cut to 900 mm².",
        },
        {
          name: "Custom rail profile",
          summary: "The rail shape needs non-standard aluminium parts and custom extrusion dies (3 dies at $2000 each in the cost estimate).",
          verdict: "revised",
          reason: "Proposed change: a rail shape that uses standard parts.",
        },
        {
          name: "Machined sliding parts",
          summary: "The telescopic joint needs special machining and makes assembly harder.",
          verdict: "revised",
          reason: "Proposed change: certified metal 3D printing for those parts.",
        },
      ],
      tables: [
        {
          caption: "Hours and simulated billing per stage (stage reports)",
          head: ["Stage", "Team hours", "Billed before tax"],
          rows: [
            ["1. Needs and functions", "176", "$16,787.50"],
            ["2. Concepts and selection", "300", "$28,837.50"],
            ["3. Detailed design and build", "329", "$30,937.50"],
          ],
        },
      ],
      media: [
        { src: D + "bench-tests.webp", caption: "Stage 3 report, tables 3 and 4: wheel to rail test and rail strength test results.", kind: "document" },
        { src: D + "final-performance-table.webp", caption: "Final review slide: structure performance against targets, safety factor 1.5.", kind: "document" },
        { src: D + "final-rails.webp", caption: "Final review slide: the rail system and its clearance target under 2 mm.", kind: "document" },
        { src: D + "final-stowed-volume.webp", caption: "Final review slide: 0.65 m³ deployed, 0.38 m³ stowed, handles for two astronauts.", kind: "document" },
        { src: M + "evolution-final-aluminum.webp", caption: "Final CAD of the aluminium 6061-T6 structure with handles.", kind: "render" },
      ],
    },
  ],
  sources: [
    "Stage 1 report, needs and houses of quality (AER1110, Feb. 7, 2025, French, translated)",
    "Stage 2 report, telescopic tube solution (Mar. 17, 2025, French, translated)",
    "Stage 3 report, LunaTube (Apr. 20, 2025, French, translated)",
    "Morphological matrix deck (Feb. 11, 2025) and PDR II deck (Feb. 18, 2025)",
    "Critical design review deck (Feb. 25, 2025), end of stage 2 deck, final review deck (Apr. 15, 2025)",
    "Rail free-body sheet (Mar. 29, 2025) and critical-part strength sheet (Apr. 1, 2025)",
    "Structure team detail drawings and part data sheets (Mar. 30 to Apr. 2025)",
  ],
};

export default dive;
