import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

const concepts = [
  { name: "Cableway", tradeoff: "Fast and mechanically simple, with difficult dust protection and openings through the airlock." },
  { name: "Rover", tradeoff: "Adaptable on uneven terrain, with more complex mechanisms exposed to lunar dust." },
  { name: "Telescoping tube", tradeoff: "An enclosed, fixed route reduced dust exposure. Deployment and installation became the main trade-offs.", selected: true },
];

function EvidenceImage({ file, width, height, alt, caption, source }: {
  file: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  source: string;
}) {
  const src = `/media/csa/${file}`;

  return (
    <figure className="min-w-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-light)]">
      <div className="grid place-items-center px-3 py-4 sm:p-6">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 550px, 95vw"
          className="h-auto max-h-[27rem] w-full object-contain"
        />
      </div>
      <figcaption className="border-t border-[var(--border)] bg-[var(--bg)] px-4 pt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:px-5">
        <p>{caption}</p>
        <p className="mt-1 text-xs text-[var(--text-tertiary)]">{source}</p>
        <a
          href={src}
          aria-label={`Open full-size image: ${caption}`}
          className="link inline-flex min-h-11 items-center gap-2 font-medium text-[var(--text)]"
        >
          Open full-size image <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      </figcaption>
    </figure>
  );
}

function EngineeringStep({ title, id, figure, children }: {
  title: string;
  id: string;
  figure: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="grid items-start gap-6 border-t border-[var(--border)] py-8 sm:py-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-12">
      <div>
        <h3 id={id} className="text-balance text-2xl sm:text-3xl">{title}</h3>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-base">
          {children}
        </div>
      </div>
      {figure}
    </section>
  );
}

export default function LunarEngineering() {
  return (
    <section aria-labelledby="lunar-engineering" className="mx-auto mt-16 w-full max-w-[1352px] px-5 md:mt-24 md:px-10 xl:px-16">
      <header className="mb-8 grid gap-5 sm:mb-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-12">
        <h2 id="lunar-engineering" className="scroll-mt-20 text-balance text-[clamp(2rem,4vw,3.25rem)]">From sketch to prototype</h2>
        <p className="max-w-2xl self-end text-base leading-relaxed text-[var(--text-secondary)]">
          I worked on structural design and subsystem integration with Team C1 and co-presented our work at the final project review. The drawings and calculations are from our team’s design record.
        </p>
      </header>

      <EngineeringStep
        title="Why we chose a tube"
        id="lunar-concept"
        figure={
          <EvidenceImage
            file="telescopic-concept-sketch.webp" width={1200} height={1179}
            alt="Notebook sketch of a smaller cylindrical shell sliding into a larger shell, with a note about preserving the inner diameter."
            caption="Early telescoping tube sketch."
            source="Preliminary design review, slide 8"
          />
        }
      >
        <p>We compared three ways to move produce between a lunar greenhouse and a habitat. Protecting the payload from regolith while keeping it on a fixed path made the enclosed tube the better fit.</p>
        <dl className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {concepts.map((concept) => (
            <div key={concept.name} className="grid gap-1 py-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-3">
              <dt className="font-semibold text-[var(--text)]">
                {concept.name}{concept.selected && <span className="mt-0.5 block text-xs text-[var(--accent-on-light)]">Selected</span>}
              </dt>
              <dd>{concept.tradeoff}</dd>
            </div>
          ))}
        </dl>
      </EngineeringStep>

      <EngineeringStep
        title="Making the rails telescope with the tube"
        id="lunar-rail-iteration"
        figure={
          <EvidenceImage
            file="telescopic-assembly-cad.webp" width={1138} height={816}
            alt="Exploded engineering line drawing showing the two tube sections and their rails along the same deployment axis."
            caption="Exploded CAD view of the tube and rail subassembly."
            source="Stage 2 design review, slide 5, figure 1.3"
          />
        }
      >
        <p>When the shells slide apart, the wagon still needs a continuous guide. We nested a pair of solid rails into a pair of hollow rails and used three grooves and matching tabs to guide the shells.</p>
        <p>The wheel spacing, rail spacing, and insulation clearance had to agree across teams. The final review documented adjustable rail spacing and a wheel-to-rail clearance target below 2 mm.</p>
      </EngineeringStep>

      <EngineeringStep
        title="Checking the rail at midspan"
        id="lunar-calculations"
        figure={
          <EvidenceImage
            file="rail-load-hand-calculation.webp" width={667} height={419}
            alt="Handwritten rail free-body diagram with a centered load, support reaction equations, and a shear force plot."
            caption="Original free-body diagram, reaction equations, and shear plot."
            source="Team C1 critical-part mechanics worksheet, page 1"
          />
        }
      >
        <p>We modeled a 1.50 m rail span as simply supported and placed the loaded wagon at midspan, the position that produces the largest bending moment in this model.</p>
        <dl className="grid grid-cols-3 gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-light)] p-3 sm:p-4">
          {[
            ["25.5 N", "Factored load"],
            ["12.8 N", "Each reaction"],
            ["9.6 N·m", "Peak bending"],
          ].map(([value, label]) => (
            <div key={label} className="flex flex-col-reverse justify-end gap-1">
              <dt className="text-xs">{label}</dt>
              <dd className="font-mono text-sm font-semibold text-[var(--text)] sm:text-base">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm">The model used a 10.5 kg loaded wagon, lunar gravity of 1.62 m/s², and a 1.5 load factor. Static equilibrium gives half the load at each support and a peak moment of <span className="whitespace-nowrap font-mono">P × L / 4</span>.</p>
      </EngineeringStep>

      <EngineeringStep
        title="What the lab prototype let us check"
        id="lunar-prototype"
        figure={
          <EvidenceImage
            file="tube-interior.jpg" width={960} height={1280}
            alt="Lab prototype viewed inside the foil-lined tube, with two dark guide rails along the floor."
            caption="Guide rails installed inside the foil-lined lab prototype."
            source="Project prototype photograph"
          />
        }
      >
        <p>The bench build brought the guide rails, insulation, and wagon into one assembly. In the demonstrations, we checked the transport sequence and checked whether the rails could conduct electricity.</p>
        <p>The lab demonstrations covered fit, transport, and electrical continuity. Lunar dust, vacuum, and temperature cycling remained environmental tests for a later build.</p>
      </EngineeringStep>
    </section>
  );
}
