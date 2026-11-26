import { TRADEOFFS } from "@/components/prototype/projectData";

const WRAP = "mx-auto w-full max-w-[1352px] px-5 md:px-10 xl:px-16";
const H2 = "text-balance text-[clamp(2rem,4vw,3.25rem)]";

/** Every design decision for a project and what it bought, numbered. */
export function Tradeoffs({ id }: { id: string }) {
  const list = TRADEOFFS[id];
  if (!list?.length) return null;
  return (
    <section className={`${WRAP} mt-24 md:mt-32`}>
      <h2 className={H2}>Design decisions and tradeoffs</h2>
      <ol className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-light)] bg-[var(--border-light)] md:grid-cols-2">
        {list.map((t, i) => (
          // an odd last item spans the row instead of leaving an empty grey cell
          <li key={t.choice} className={`flex gap-5 bg-white p-6 md:p-8 ${i === list.length - 1 && list.length % 2 ? "md:col-span-2" : ""}`}>
            <span className="font-mono text-sm tabular-nums text-[var(--accent-on-light)]">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="block text-[1.15rem] font-semibold leading-snug text-[var(--text)]">{t.choice}</span>
              <span className="mt-2 block text-[16px] leading-relaxed text-[var(--text-secondary)]">{t.why}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

type Figure = { src: string; caption: string };
type Part = { kicker: string; title: string; points: string[]; stats?: { value: string; label: string }[]; figures: Figure[] };

/** The CSA LEAP deck (PDF pages 2 to 4), one subsystem per block. */
const CSA: Part[] = [
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
      { src: "/media/csa/section-view-copy.jpg", caption: "Section cut CAD, interior of the 3.1 m tube" },
      { src: "/media/csa/section-drawing.jpg", caption: "Transportation tube assembly, section view A-A (Ø540, 3080 mm)" },
      { src: "/media/csa/isometric-drawing-bom.jpg", caption: "Isometric view and bill of materials" },
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
    figures: [{ src: "/media/csa/isometric-view.webp", caption: "Telescopic tube, deployed" }],
  },
  {
    kicker: "Material stack, outer to inner",
    title: "Regolith, aluminium, insulation",
    points: [
      "Layer 1, regolith shielding: 50 cm of local lunar soil for radiation protection and thermal mass, harvested on site.",
      "Layer 2, Al 6061-T6 pressure vessel: machined structural core for atmosphere containment and primary loads, 2.5× safety factor.",
      "Layer 3, multi-layer insulation: reflective blankets against radiative heat transfer, placed at every critical interface.",
    ],
    figures: [{ src: "/media/csa/section-view.webp", caption: "Section view of the layered tube wall" }],
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
      { src: "/media/csa/tube-interior.jpg", caption: "MLI-lined tube and rail during the lab build" },
      { src: "/media/csa/prototype-overview.jpg", caption: "Wagon, wiring and rail in the integrated prototype" },
    ],
  },
];

function Img({ f, tall }: { f: Figure; tall?: boolean }) {
  return (
    <figure>
      <a
        href={f.src}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-light)] bg-white shadow-[0_24px_48px_-32px_rgba(0,0,0,.3)]"
      >
        <img
          src={f.src}
          alt={f.caption}
          loading="lazy"
          decoding="async"
          className={`w-full ${tall ? "aspect-[4/5]" : "aspect-[16/10]"} ${tall ? "object-cover" : "object-contain p-3"}`}
        />
        <span className="sr-only">(opens full size in a new tab)</span>
      </a>
      <figcaption className="mt-2.5 text-[14px] text-[var(--text-tertiary)]">{f.caption}</figcaption>
    </figure>
  );
}

/** Lunar Transport System: each subsystem with its numbers and figures. */
export function CsaDeepDive() {
  return (
    <section className="light mt-24 py-20 md:mt-32 md:py-28">
      <div className={WRAP}>
        <h2 className={H2}>How the system was engineered</h2>
        <div className="mt-14 space-y-24 md:space-y-32">
          {CSA.map((p, i) => (
            <article key={p.kicker} className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 ? "lg:order-2" : ""}>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent-on-light)]">
                  {String(i + 1).padStart(2, "0")} · {p.kicker}
                </p>
                <h3 className="mt-3 text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.1] text-[var(--text)]">{p.title}</h3>
                <ul className="mt-6 space-y-3 text-[16px] leading-relaxed text-[var(--text-secondary)]">
                  {p.points.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      {x}
                    </li>
                  ))}
                </ul>
                {p.stats && (
                  <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-[var(--border-light)]">
                    {p.stats.map((s) => (
                      <div key={s.label} className="flex flex-col-reverse bg-white px-4 py-3">
                        <dt className="text-xs text-[var(--text-tertiary)]">{s.label}</dt>
                        <dd className="font-mono text-xl tabular-nums text-[var(--text)]">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              <div className={`grid gap-6 ${p.figures.length > 1 ? "sm:grid-cols-2" : ""} ${i % 2 ? "lg:order-1" : ""}`}>
                {p.figures.map((f, k) => (
                  <div key={f.src} className={p.figures.length === 3 && k === 0 ? "sm:col-span-2" : ""}>
                    {/* the two lab photos are near-square or portrait, so they share a taller frame */}
                    <Img f={f} tall={p.kicker.startsWith("Mechatronics")} />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
