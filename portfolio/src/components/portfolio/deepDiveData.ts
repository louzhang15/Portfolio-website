/**
 * Subsystem deep dives for the hardware case studies, from Louis's own material: the portfolio PDF
 * (pages 2-4 CSA, 5-6 Nursie, 7 Reforestation Robot), the ResQ-Link drawings and pitch deck, and portfolio.json.
 */
export type Figure = { src: string; caption: string; shape?: "wide" | "tall"; fit?: "cover" | "contain" };
export type Part = { kicker: string; title: string; points: string[]; stats?: { value: string; label: string }[]; figures?: Figure[] };
export type DeepDive = { heading: string; parts: Part[] };

const csa: DeepDive = {
  heading: "How the system was engineered",
  parts: [
    {
      kicker: "Design architecture",
      title: "50+ part interfaces in one 3.1 m envelope",
      points: [
        "Coordinated geometry conflicts between the telescopic, structural and thermal subsystems.",
        "CATIA V6 parametric assemblies enforced interface constraints and carried design changes to dependent parts.",
        "GD&T on every critical mating surface: flatness, perpendicularity and true position for manufacturing.",
        "Tolerance stack-up across all telescopic stages checked fit under worst-case dimensional variation.",
        "Design freezes tracked in MS Project across the mechanical, thermal and electrical subsystems.",
      ],
      figures: [
        { src: "/media/csa/section-view-copy.jpg", caption: "Section cut CAD, interior of the 3.1 m tube", fit: "contain" },
        { src: "/media/csa/section-drawing.jpg", caption: "Transportation tube assembly, section view A-A (Ø540, 3080 mm)", fit: "contain" },
        { src: "/media/csa/isometric-drawing-bom.jpg", caption: "Isometric view and bill of materials", fit: "contain" },
      ],
    },
    {
      kicker: "Simulation and analysis",
      title: "Thermal FEA over the 14-day lunar night",
      points: [
        "Verified heat retention through the full cold soak, so the produce survives the lunar night.",
        "Found thermal bridging in the aluminium telescopic joints and isolated each conduction path through FEA-guided redesign.",
        "Validated the drive mechanism against high-vibration launch loads.",
        "A kinematic motion study confirmed zero interference and clearance margins at every extension state.",
      ],
      stats: [
        { value: "290°C", label: "max thermal gradient" },
        { value: "2.54×", label: "structural safety factor" },
        { value: "<4.2%", label: "predictive variance" },
      ],
      figures: [{ src: "/media/csa/isometric-view.webp", caption: "Telescopic tube, deployed", fit: "contain" }],
    },
    {
      kicker: "Material stack, outer to inner",
      title: "Regolith, aluminium, insulation",
      points: [
        "Layer 1, regolith shielding: 50 cm of local lunar soil for radiation protection and thermal mass, harvested on site.",
        "Layer 2, Al 6061-T6 pressure vessel: machined structural core for atmosphere containment and primary loads, 2.5× safety factor.",
        "Layer 3, multi-layer insulation: reflective blankets against radiative heat transfer, placed at every critical interface.",
      ],
      figures: [{ src: "/media/csa/section-view.webp", caption: "Section view of the layered tube wall", fit: "contain" }],
    },
    {
      kicker: "Mechatronics and fabrication",
      title: "Power, control and the lab build",
      points: [
        "Power and charging routed to keep electrical continuity in every extension state, from stowed to 3.1 m.",
        "Arduino runs the rail-guided wagon loop. A Raspberry Pi Pico runs the belt conveyor from greenhouse to habitat.",
        "Live tests confirmed rail continuity during extension and a full autonomous transport cycle with no manual step.",
        "Led physical integration: AL-6061 machining, MLI fabrication, PCB prototyping, wiring harnesses and cold-welded tab-to-tube joints.",
      ],
      figures: [
        { src: "/media/csa/tube-interior.jpg", caption: "MLI-lined tube and rail during the lab build", shape: "tall" },
        { src: "/media/csa/prototype-overview.jpg", caption: "Wagon, wiring and rail in the integrated prototype", shape: "tall" },
      ],
    },
  ],
};

const nursie: DeepDive = {
  heading: "How Nursie detects a fall",
  parts: [
    {
      kicker: "Sensor hardware",
      title: "Three room-sensing inputs, no cameras",
      points: [
        "The TI IWR6843 mmWave radar observes position and motion without a camera. Abrupt sitting, furnishings and occlusion can complicate its readings.",
        "A separate ESP32 running FreeRTOS reads a magnetic door sensor and a PIR detector. Those readings add room and movement context over ROS 2.",
        "The vibration mat senses physical impact. Dropped objects can also trigger it, so the prototype pairs that signal with the radar's motion evidence.",
      ],
      stats: [
        { value: "3", label: "room-sensing inputs" },
        { value: "0", label: "cameras" },
        { value: "LAN", label: "sensor network" },
      ],
      figures: [
        { src: "/media/nursie/mmwave-radar.webp", caption: "mmWave radar (IWR6843) on its mount", shape: "tall" },
        { src: "/media/nursie/door-node.webp", caption: "ESP32 door and PIR node", shape: "tall" },
      ],
    },
    {
      kicker: "Alert pipeline",
      title: "From a floor impact to a nurse's phone",
      points: [
        "Sensors: radar, vibration mat, door and PIR, smartwatch.",
        "Edge node: ESP32 on FreeRTOS fuses the signals and sends ROS 2 messages over the facility's OpenWRT LAN.",
        "AI triage: Gemini sets intent and priority. ElevenLabs gives residents a voice interface for questions and reminders.",
        "Persistence: MongoDB keeps each resident's profile, behaviour history, anomaly flags and triage logs.",
        "Escalation: a phone call to staff and a push to the nurse dashboard for critical events.",
      ],
      figures: [{ src: "/media/nursie/dashboard.png", caption: "Nurse dashboard: room overview and the live fall alert", fit: "contain" }],
    },
    {
      kicker: "Engineering challenges",
      title: "What still needs measurement",
      points: [
        "Test scripted falls, abrupt sitting, dropped objects and partial radar occlusion to see where the combined sensors help or miss events.",
        "Timestamp the stimulus and staff alert to measure end-to-end delay. Report missed and false alerts separately for each condition.",
        "The prototype demonstrated how the sensors communicate over a local network. Detection accuracy, latency and clinical performance still need validation.",
      ],
      figures: [
        { src: "/media/nursie/vibration-node.webp", caption: "Floor vibration mat node on its breadboard", shape: "tall" },
        { src: "/media/nursie/door-sensor.webp", caption: "Magnetic door sensor test rig", shape: "tall" },
      ],
    },
  ],
};

const robot: DeepDive = {
  heading: "How the robot was built in 24 hours",
  parts: [
    {
      kicker: "Engineering and code",
      title: "Line following and timed seed drops",
      points: [
        "Two digital infrared readings drive fixed steering branches on the Arduino. A separate colour-reading step controls the dispenser trigger.",
        "A servo turns a paper seed dispenser. The integrated sketch fixes the reverse sweep condition so the mechanism returns to its starting angle.",
        "The final sketch makes two out-and-back sweeps with 121 commands per leg and a 10 ms delay per command. That is 4.84 s of programmed delay. Actual servo motion and seed release would need separate measurement.",
        "Breadboard wiring and a folded paper dispenser made it possible to adjust the setup inside the 24-hour build window.",
      ],
      stats: [
        { value: "24h", label: "build window" },
        { value: "3", label: "sensors" },
        { value: "5th", label: "place overall" },
      ],
      figures: [
        { src: "/media/robohacks/robot-held.jpg", caption: "Breadboard, Arduino, IR sensors and seed dispenser", shape: "tall" },
        { src: "/media/robohacks/robot-top.jpg", caption: "Full assembly on the competition floor", shape: "tall" },
      ],
    },
    {
      kicker: "Sustainable design",
      title: "Recycled materials only",
      points: [
        "The chassis is repurposed cardboard and plastic bottles.",
        "The seed dispenser is paper folded into a rotating mechanism, with no 3D-printed or machined parts.",
        "The recycled build won the Unexpected Expedition Award.",
      ],
    },
  ],
};

const resq: DeepDive = {
  heading: "How ResQ-Link works",
  parts: [
    {
      kicker: "The bracelet",
      title: "A triage tag with no battery",
      points: [
        "Matte grey silicone outer band with a translucent overmolded seal, designed for IP68.",
        "A passive NFC chip with a copper coil draws its power from the reader, so the band never needs charging.",
        "Compared with paper tags ($0.50, no digital sync) and active hospital tags ($50+, need charging): $1.50 a unit, passive, synced over an offline mesh.",
        "Target cost per unit: $0.30 (chip and coil $0.18, silicone $0.07, packaging $0.05).",
      ],
      stats: [
        { value: "$1.50", label: "unit price target" },
        { value: "$0.30", label: "unit cost target" },
        { value: "0", label: "batteries" },
      ],
      figures: [{ src: "/media/resq-link/cutaway.jpg", caption: "Cutaway: silicone band, IP68 seal, NFC chip and copper coil", fit: "contain" }],
    },
    {
      kicker: "SmartTriage dashboard",
      title: "Every tagged patient on one screen",
      points: [
        "Counts tags by category: Morgue, Immediate, Delayed and Minor.",
        "Maps the live location of every bracelet.",
        "Lists registered staff and their tagging activity.",
        "Scan a bracelet to add or update a patient's details.",
      ],
      figures: [
        { src: "/media/resq-link/dashboard-tags.webp", caption: "Tag list with each bracelet's status", fit: "cover" },
        { src: "/media/resq-link/dashboard-map.webp", caption: "Bracelet location map", fit: "cover" },
        { src: "/media/resq-link/dashboard-overview.webp", caption: "Deployed tags over time, by category", fit: "cover" },
      ],
    },
    {
      kicker: "Path to production",
      title: "From printed pilot units to molded bands",
      points: [
        "Pilot units are 3D printed with hand-assembled PCBs, about $100 to $150 each.",
        "The pilot plan proves the zero-power design in 5,000 live triage cases.",
        "Health Canada Class I/II and ISO 13485 certification come next.",
        "Injection molding tooling brings the unit cost down to the $0.30 target.",
      ],
    },
  ],
};

const pump: DeepDive = {
  heading: "How the pump is put together",
  parts: [
    {
      kicker: "Assembly",
      title: "9 piston assemblies around one spherical nut",
      points: [
        "Modelled from the ground up at Polytechnique Montréal, Nov. to Dec. 2024.",
        "Each of the 9 assemblies is a piston and a slipper pad.",
        "A retaining plate holds the slipper pads. A spherical nut centres the plate.",
        "Part geometry and assembly parameters were refined for mechanical durability.",
        "The exploded-view drawing carries a bilingual French and English BOM and follows standard drafting conventions.",
      ],
      stats: [
        { value: "9", label: "piston assemblies" },
        { value: "2", label: "BOM languages" },
      ],
      figures: [{ src: "/media/axial-piston-pump/exploded-drawing.jpg", caption: "Exploded view with the bill of materials", fit: "contain" }],
    },
  ],
};

export const DEEP_DIVES: Record<string, DeepDive> = { "P-1": csa, "P-5": nursie, "P-3": robot, "P-4": resq, "P-2": pump };
