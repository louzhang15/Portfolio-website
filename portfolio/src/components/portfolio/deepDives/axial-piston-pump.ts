import type { TechDive } from "./types";

const dive: TechDive = {
  heading: "Modelling the pump part by part in CATIA",
  intro:
    "The pump is a CATIA V5 assembly of 3 parts plus 9 piston assemblies, 21 parts in all. Each part started as a sketched profile revolved about its axis. Step screenshots saved on Nov. 6, 2024 record the sketch dimensions. Final part files were saved from Nov. 6 to Nov. 8, 2024. All dimensions are in millimetres.",
  stages: [
    {
      date: "Nov. 6, 2024",
      phase: "Piston",
      title: "A revolved piston with a ball end",
      summary:
        "The piston is one sketch revolved 360°. A ball of radius 6 sits on a narrow neck at one end. Grooves are cut along the body and a hole runs through its centre.",
      points: [
        "Body diameter 12.66, body length 41.68, length to the neck 44.37.",
        "Ball radius 6 on a neck of diameter 7.5.",
        "The part file holds a Groove feature and a rectangular pattern, which repeats the groove along the body.",
        "A hole feature opens the centre bore, and a small hole shows on the ball face.",
      ],
      stats: [
        { value: "12.66", label: "body diameter (mm)" },
        { value: "R6", label: "ball end" },
      ],
      media: [
        { src: "/media/axial-piston-pump/deep/piston-sketch.webp", caption: "Piston profile sketch with its dimensions", kind: "sketch", shape: "wide" },
        { src: "/media/axial-piston-pump/deep/piston-body.webp", caption: "Revolved body with the ball end", kind: "render", shape: "wide" },
        { src: "/media/axial-piston-pump/deep/piston-grooves.webp", caption: "Grooves patterned along the hollow body", kind: "render", shape: "wide" },
        { src: "/media/axial-piston-pump/deep/piston-ball.webp", caption: "Ball end with its small centre hole", kind: "render", shape: "wide" },
      ],
    },
    {
      date: "Nov. 6, 2024",
      phase: "Slipper pad",
      title: "A slipper pad sized to the piston ball",
      summary:
        "The slipper pad (patin) is a flanged cup. Its socket has the same radius 6 as the piston ball, so the two parts seat together.",
      points: [
        "Flange diameter 19.23, flange thickness 1.93.",
        "Body diameter 14.28, body length 8.22.",
        "The piston sub-assembly fixes the pad with three constraints: Axe piston, Axe patin and Epaulement patin (piston axis, pad axis, pad shoulder).",
      ],
      media: [
        { src: "/media/axial-piston-pump/deep/slipper-sketch.webp", caption: "Slipper pad profile: R6 socket, flange and body", kind: "sketch", shape: "wide" },
        { src: "/media/axial-piston-pump/deep/slipper.webp", caption: "Finished slipper pad", kind: "render", shape: "square" },
      ],
    },
    {
      date: "Nov. 6, 2024",
      phase: "Retaining plate",
      title: "One hole, then a circular pattern of 9",
      summary:
        "The retaining plate (plaque de retenue) is a revolved disc with a raised centre ring. One pad hole was cut first. A circular pattern then copied it to 9 positions, one per piston assembly.",
      points: [
        "Outer diameter 82.62, plate thickness 6.09, centre ring step 4.6.",
        "The centre opening is sketched with diameters 32.92, 36.6 and 38.25 and a curved inner face.",
        "The plate holds the 9 slipper pads in place around the assembly.",
      ],
      stats: [
        { value: "82.62", label: "outer diameter (mm)" },
        { value: "9", label: "patterned holes" },
      ],
      iterations: [
        {
          name: "Single hole",
          summary: "One pad hole cut next to the centre ring to set its size and radius.",
          verdict: "revised",
          reason: "It became the seed feature for the circular pattern.",
          media: { src: "/media/axial-piston-pump/deep/plate-first-hole.webp", caption: "Plate with the first pad hole", kind: "render", shape: "wide" },
        },
        {
          name: "Circular pattern of 9",
          summary: "The hole repeated 9 times around the axis.",
          verdict: "kept",
          reason: "One hole per piston assembly. Editing the first hole updates all 9.",
          media: { src: "/media/axial-piston-pump/deep/plate-pattern.webp", caption: "Plate with all 9 pad holes", kind: "render", shape: "wide" },
        },
      ],
      media: [{ src: "/media/axial-piston-pump/deep/plate-sketch.webp", caption: "Retaining plate profile sketch", kind: "sketch", shape: "wide" }],
    },
    {
      date: "Nov. 6, 2024",
      phase: "Spherical nut",
      title: "A spline driven by one parameter",
      summary:
        "The spherical nut (noix spherique) has a curved outer face and an internal spline. The tooth count is a named parameter, Nombre_dents, set to 21. A circular pattern reads it to place the teeth.",
      points: [
        "Outer diameter 34.73, height 10, wall step 0.9.",
        "The inner radius 12.575 is set by a formula, not typed in.",
        "CircPattern.2 takes its angular number from Nombre_dents, so changing one value redraws every tooth.",
        "The same tooth parameters appear in the cylinder block and in the pump assembly: Nombre_dents, Profondeur_dent, Longueur_exterieur_dent, Longeur_interieur_dent and Diametre_trou_central. The assembly file also holds a Knowledge Relation, which probably links them.",
      ],
      stats: [
        { value: "21", label: "spline teeth" },
        { value: "5", label: "shared tooth parameters" },
      ],
      media: [
        { src: "/media/axial-piston-pump/deep/nut-sketch.webp", caption: "Nut profile: R12.575 from a formula, D34.73, height 10", kind: "sketch", shape: "wide" },
        { src: "/media/axial-piston-pump/deep/nut-spline.webp", caption: "Internal spline after the circular pattern", kind: "render", shape: "wide" },
        { src: "/media/axial-piston-pump/deep/nut-tooth-parameter.webp", caption: "Formula editor: the pattern count equals Nombre_dents (21)", kind: "screenshot", shape: "wide" },
      ],
    },
    {
      date: "Nov. 6 to 8, 2024",
      phase: "Assembly and drawing",
      title: "21 parts and a French exploded drawing",
      summary:
        "The product Pompe_hydraulique places the cylinder block, the spherical nut, the retaining plate and 9 copies of the piston assembly. The drawing shows the assembled pump, a numbered exploded view and two parts lists in French.",
      points: [
        "The cylinder block houses the 9 pistons. Its file also holds a bottom pin hole parameter, Diametre_trou_broche_bas.",
        "The spherical nut centres the retaining plate.",
        "The exploded view lifts one slipper pad (4) off its piston (5) to show how they connect.",
        "Last saves: block, nut and drawing on Nov. 6, plate and slipper pad on Nov. 7, piston on Nov. 8.",
      ],
      stats: [
        { value: "21", label: "parts" },
        { value: "9", label: "piston assemblies" },
      ],
      tables: [
        {
          caption: "Parts list from the drawing (French terms kept, English added)",
          head: ["No.", "French", "English", "Qty"],
          rows: [
            ["1", "Bloc-cylindre", "Cylinder block", "1"],
            ["2", "Plaque de retenue", "Retaining plate", "1"],
            ["3", "Noix spherique", "Spherical nut", "1"],
            ["", "Assemblage piston", "Piston assembly", "9"],
            ["4", "Patin", "Slipper pad (per piston assembly)", "1"],
            ["5", "Piston", "Piston (per piston assembly)", "1"],
          ],
        },
      ],
      media: [
        {
          src: "/media/axial-piston-pump/exploded-drawing.jpg",
          caption: "Exploded view (1 to 5) and assembled pump. Parts lists in French: Nomenclature, Numéro, Référence, Quantité.",
          kind: "drawing",
          shape: "square",
        },
      ],
    },
  ],
  sources: [
    "CATIA V5 files: Pompe_hydraulique and Piston_assemblage products, and part files for the cylinder block, spherical guide, retaining plate, slipper pad and piston (French names, parameter names read from the files)",
    "17 CATIA step screenshots saved Nov. 6, 2024",
    "Exploded drawing with parts lists (French)",
  ],
};

export default dive;
