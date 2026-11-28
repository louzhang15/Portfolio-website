import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import type { PortfolioItem } from "@/lib/portfolio";
import { ScrollX } from "./deepDives/TechTimeline";
import { chapters, chapterNumber, leadStats, leadDuties, TIMELINE_DAYS, phases, milestones, months, concepts, TOP_SCORE, massLedger, MAX_KG, reviews, railProblems, interfaces, checks, reportFlags, myFlags, type ChapterId } from "./lunarData";

// Every number on this page comes from the structure team's design records (Polytechnique Montréal, AER/MEC1110, winter 2025).

function Figure({ file, width, height, alt, caption, source, className = "" }: {
  file: string; width: number; height: number; alt: string; caption: string; source: string; className?: string;
}) {
  const src = `/media/csa/${file}`;
  return (
    <figure className={`min-w-0 ${className}`}>
      <a href={src} className="block cursor-zoom-in overflow-hidden rounded-[var(--radius-lg)] bg-[var(--bg-light)]" aria-label={`Open full-size image: ${caption}`}>
        <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 620px, 95vw" className="h-auto max-h-[34rem] w-full object-contain" />
      </a>
      <figcaption className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        {caption} <span className="text-[var(--text-tertiary)]">{source}</span>
      </figcaption>
    </figure>
  );
}

function Chapter({ id, title, lede, grey = false, children }: {
  id: ChapterId; title: string; lede?: ReactNode; grey?: boolean; children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={grey ? "bg-[var(--bg-light)]" : ""}>
      <div className="mx-auto w-full max-w-[1352px] px-5 py-16 md:px-10 md:py-24 xl:px-16">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-12">
          <h3 id={id} className="scroll-mt-28 text-balance text-[clamp(1.75rem,3.2vw,2.5rem)]">
            <span className="mr-3 tabular-nums text-[var(--text-tertiary)]">{chapterNumber(id)}</span>{title}
          </h3>
          {lede && <div className="max-w-[62ch] self-end text-[17px] leading-[1.6] text-[var(--text-secondary)]">{lede}</div>}
        </div>
        <div className="mt-10 md:mt-12">{children}</div>
      </div>
    </section>
  );
}

const PROSE = "space-y-4 text-[17px] leading-[1.6] text-[var(--text-secondary)]";
const STAT_CELL = "flex flex-col-reverse justify-end border-t border-[var(--text)] pb-2 pr-4 pt-4";
const STAT_VALUE = "wide text-[clamp(1.75rem,3vw,2.25rem)] leading-none tabular-nums text-[var(--text)]";

export default function LunarEngineering({ demos }: { demos: PortfolioItem["links"] }) {
  return (
    <div className="mt-16 md:mt-24">
      <header id="lunar-engineering" className="mx-auto grid w-full max-w-[1352px] scroll-mt-20 gap-5 px-5 md:px-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-12 xl:px-16">
        <h2 className="text-balance text-[clamp(2rem,4vw,3.25rem)]">From sketch to prototype</h2>
        <p className="max-w-[62ch] self-end text-[17px] leading-[1.6] text-[var(--text-secondary)]">
          Eight chapters follow the project from a list of functions to a tested prototype, using our own sketches, CAD, hand calculations, and review slides.
        </p>
      </header>

      <nav aria-label="Lunar case study chapters" className="z-30 mt-10 border-y border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur md:sticky md:top-12">
        <ScrollX label="Chapters" fade="from-[var(--bg)]" hint={false}>
        <ol className="mx-auto grid w-full max-w-[1352px] grid-cols-2 gap-px px-5 py-2 md:flex md:gap-1 md:px-10 xl:px-16">
          {chapters.map(([id, label], i) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} className="flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-[var(--text)] underline decoration-[var(--border-hover)] underline-offset-4 hover:bg-[var(--bg-light)] md:px-3">
                <span className="tabular-nums text-[var(--text-tertiary)]">{i + 1}</span>{label}
              </a>
            </li>
          ))}
        </ol>
        </ScrollX>
      </nav>

      <Chapter
        id="lunar-leadership"
        title="Running the team"
        lede={<p>I coordinated the structure team’s schedule and worked on the structural CAD and subsystem interfaces. The hardest part was keeping our structure current while the four partner teams refined their designs.</p>}
      >
        <dl className="grid grid-cols-2 gap-x-6 md:grid-cols-4">
          {leadStats.map(([value, label]) => (
            <div key={label} className={STAT_CELL}>
              <dt className="mt-2 text-sm text-[var(--text-tertiary)]">{label}</dt>
              <dd className={STAT_VALUE}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-12">
          <div className={PROSE}>
            <p>Stage 3 was billed against a course budget at simulated consulting rates: $30,937 against a $44,208 forecast. Tighter planning of the data sheets and the prototype build made the difference.</p>
            <p className="text-sm text-[var(--text-tertiary)]">Tools: CATIA V5, hand statics, Fusion 360 FEA, Gantt scheduling, NASA GEVS test planning.</p>
          </div>
          <ul className="space-y-3 text-[17px] leading-[1.55] text-[var(--text)]">
            {leadDuties.map((duty) => (
              <li key={duty} className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2">
                <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 rounded-full bg-[var(--accent-on-light)]" />
                {duty}
              </li>
            ))}
          </ul>
        </div>

        <figure className="mt-14">
          <div className="relative max-md:hidden" role="img" aria-label="Project schedule from January 19 to April 15, 2025. Needs and functions until early February, ideas and concept selection until mid-March, then detailed design and fabrication until the final review on April 15.">
            <div className="relative h-5 text-xs text-[var(--text-tertiary)]">
              {months.map((m) => (
                <span key={m.label} className="absolute" style={{ left: `${(m.day / TIMELINE_DAYS) * 100}%` }}>{m.label}</span>
              ))}
            </div>
            <div className="mt-2 space-y-2">
              {phases.map((p) => (
                <div key={p.name} className="relative h-9">
                  <div
                    className="absolute inset-y-0 flex items-center overflow-hidden rounded-[var(--radius-sm)] bg-[var(--text)] px-3 text-sm font-medium text-[var(--bg)]"
                    style={{ left: `${(p.start / TIMELINE_DAYS) * 100}%`, width: `${((p.end - p.start) / TIMELINE_DAYS) * 100}%` }}
                  >
                    <span className="truncate">{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-3 h-14 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
              {milestones.map((m, i) => (
                <div key={m.label} className="absolute top-0 -translate-x-1/2" style={{ left: `${(m.day / TIMELINE_DAYS) * 100}%` }}>
                  <span aria-hidden className="mx-auto block h-2.5 w-px bg-[var(--text)]" />
                  <span className={`mt-1 block whitespace-nowrap ${i % 2 ? "translate-y-5" : ""}`}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ol className="space-y-3 md:hidden">
            {phases.map((p) => <li key={p.name} className="rounded-[var(--radius-sm)] bg-[var(--text)] px-3 py-2 text-sm font-medium text-[var(--bg)]">{p.name}</li>)}
            {milestones.map((m) => (
              <li key={m.label} className="flex justify-between border-b border-[var(--border)] pb-2 text-sm">
                <span className="text-[var(--text)]">{m.label}</span><span className="tabular-nums text-[var(--text-tertiary)]">{m.date}</span>
              </li>
            ))}
          </ol>
          <figcaption className="mt-2 text-sm text-[var(--text-secondary)]">
            The schedule I ran, Jan. 19 to Apr. 15, 2025. <span className="text-[var(--text-tertiary)]">Redrawn from the Stage 3 report, figure 9.</span>
          </figcaption>
        </figure>
      </Chapter>

      <Chapter
        id="lunar-concept"
        title="Choosing the concept"
        grey
        lede={
          <>
            <p>Before drawing a vehicle, we split the mission into 13 functions, such as traveling between airlocks, limiting dust ingress, and surviving launch loads. Combining one idea per function produced three full concepts.</p>
            <p className="mt-4">Each of the five teams in our class “company” then scored all three in its own decision matrix. The tube won all five. Our CSA mentor suggested making it telescope to cut the volume stowed for launch.</p>
          </>
        }
      >
        <ul className="grid gap-8 md:grid-cols-3 md:gap-6">
          {concepts.map((c) => (
            <li key={c.name} className="flex flex-col">
              <div className={`overflow-hidden rounded-[var(--radius-lg)] bg-white p-2 ${c.selected ? "ring-2 ring-[var(--text)]" : "ring-1 ring-[var(--border)]"}`}>
                <Image src={`/media/csa/${c.file}`} alt={c.alt} width={c.width} height={c.height} sizes="(min-width: 768px) 420px, 95vw" className="aspect-[16/10] w-full object-contain" />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h4 className="text-lg font-semibold text-[var(--text)]">{c.name}{c.selected && <span className="ml-2 text-sm font-medium text-[var(--accent-on-light)]">Selected</span>}</h4>
                <span className="tabular-nums text-sm text-[var(--text-secondary)]">{c.score} pts</span>
              </div>
              <div aria-hidden className="mt-2 h-1.5 rounded-full bg-[var(--border)]">
                <div className={`h-full rounded-full ${c.selected ? "bg-[var(--text)]" : "bg-[var(--text-tertiary)]"}`} style={{ width: `${(c.score / TOP_SCORE) * 100}%` }} />
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">{c.tradeoff}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[var(--text-tertiary)]">Sketches from the Stage 2 report, figures 1 to 3, labeled in French. Scores are the sum of the five teams’ matrices (annex F).</p>
      </Chapter>

      <Chapter
        id="lunar-evolution"
        title="Three design reviews"
        lede={<p>Each review exposed a problem the next version had to solve. Mass is the clearest record: it fell when we switched to aluminum, then rose when the thermal team’s wall requirement landed.</p>}
      >
        <figure>
          <dl className="space-y-4">
            {massLedger.map((row) => (
              <div key={row.label} className="grid items-center gap-x-6 gap-y-1 md:grid-cols-[14rem_minmax(0,1fr)_7.5rem]">
                <dt>
                  <span className="block font-medium text-[var(--text)]">{row.label}</span>
                  <span className="block text-sm text-[var(--text-tertiary)]">{row.detail}</span>
                </dt>
                <div aria-hidden className="h-3">
                  <div
                    className={`h-full rounded-full ${row.proposed ? "border-2 border-dashed border-[var(--accent-on-light)]" : "bg-[var(--text)]"}`}
                    style={{ width: `${(row.kg / MAX_KG) * 100}%` }}
                  />
                </div>
                <dd className="wide whitespace-nowrap text-xl tabular-nums text-[var(--text)] md:text-right">{row.proposed ? "≈ " : ""}{row.kg} kg</dd>
              </div>
            ))}
          </dl>
          <figcaption className="mt-4 text-sm text-[var(--text-tertiary)]">Concept review slide 5, Stage 2 review slide 8, Stage 3 report abstract and table 2.</figcaption>
        </figure>

        <ol className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {reviews.map((r, i) => (
            <li key={r.stage} className="flex min-w-0 flex-col">
              <a href={`/media/csa/${r.file}`} className="block cursor-zoom-in overflow-hidden rounded-[var(--radius-lg)] bg-white ring-1 ring-[var(--border)]" aria-label={`Open full-size image: ${r.stage} model`}>
                <Image src={`/media/csa/${r.file}`} alt={r.alt} width={r.width} height={r.height} sizes="(min-width: 1024px) 420px, 95vw" className="aspect-[16/9] w-full object-contain p-3 [filter:grayscale(1)]" />
              </a>
              <p className="mt-4 text-sm text-[var(--text-tertiary)]">Version {i + 1}, {r.date}</p>
              <h4 className="mt-1 text-lg font-semibold text-[var(--text)]">{r.stage}</h4>
              <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {r.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <p className="mt-4 border-l-2 border-[var(--accent-on-light)] pl-3 text-[15px] leading-relaxed text-[var(--text)]">{r.next}</p>
            </li>
          ))}
        </ol>
      </Chapter>

      <Chapter
        id="lunar-rails"
        title="Making the rails telescope"
        grey
        lede={<p>When the two sections slide apart, the wagon still needs one continuous guide. Splitting the tube raised three questions at the Stage 2 review, and each answer added a part or a process.</p>}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-12">
          <div className="space-y-8">
            <dl className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {railProblems.map((item) => (
                <div key={item.q} className="py-4">
                  <dt className="text-[17px] font-semibold text-[var(--text)]">{item.q}</dt>
                  <dd className="mt-1 text-[17px] leading-[1.6] text-[var(--text-secondary)]">{item.a}</dd>
                </div>
              ))}
            </dl>
            <div className={PROSE}>
              <p>We chose 6061-T6 aluminum over titanium for lower cost and easier welding at a similar stiffness-to-mass ratio. Making aluminum also takes 210 MJ/kg against 690 for titanium, and emits 12 kg of CO₂ per kg against 46.</p>
              <p>The rails double as the power path to the wagon, which is why their profile is custom. Standard extrusions are the obvious next step.</p>
            </div>
          </div>
          <div className="grid gap-8">
            <Figure
              file="telescopic-assembly-cad.webp" width={1138} height={816}
              alt="Exploded engineering line drawing showing the two tube sections and their rails along the same deployment axis."
              caption="Exploded view of the tube and rails."
              source="Stage 2 review, figure 1.3"
            />
            <Figure
              file="rail-detail-drawing.webp" width={1584} height={1224}
              alt="CATIA V5 detail drawing C-101-1 of the 1000 mm prototype rail with its stepped 50 by 25 mm profile, drawn by Jacob Rusnak and checked by Louis Zhang."
              caption="Rail drawing C-101-1 for the bench prototype (wood). Drawn by Jacob Rusnak, checked by me."
              source="Mar. 30, 2025"
            />
          </div>
        </div>
      </Chapter>

      <Chapter
        id="lunar-interfaces"
        title="Closing the interfaces"
        lede={<p>Our team owned the structure every other subsystem mounted to. Any dimension we changed moved another team’s part, so each boundary was tracked with the team on the other side.</p>}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] lg:gap-12">
          <div>
            <table className="w-full text-left text-[15px] leading-relaxed max-md:block">
              <thead className="text-sm text-[var(--text-tertiary)] max-md:hidden">
                <tr className="border-b border-[var(--text)]">
                  <th scope="col" className="py-2 pr-4 font-medium">Team</th>
                  <th scope="col" className="py-2 pr-4 font-medium">What they needed</th>
                  <th scope="col" className="py-2 font-medium">How the structure met it</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] max-md:block max-md:border-t max-md:border-[var(--text)]">
                {interfaces.map((row) => (
                  <tr key={row.team} className="align-top max-md:grid max-md:py-3">
                    <th scope="row" className="py-3 pr-4 font-semibold text-[var(--text)] max-md:py-0.5">{row.team}</th>
                    <td className="py-3 pr-4 text-[var(--text-secondary)] max-md:py-0.5">{row.need}</td>
                    <td className="py-3 text-[var(--text)] max-md:py-0.5">{row.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-[15px] text-[var(--text-secondary)]">The wheel was the tightest of these: the rail spacing stayed adjustable, with a wheel-to-rail clearance target under 2 mm.</p>
          </div>
          <Figure
                        file="wheel-rail-interface-clean.webp" width={1400} height={611}
            alt="Section view of the wagon axle with its two wheels seated in the stepped rails, with dimensions marked."
            caption="Wheel-to-rail interface. The propulsion team’s wheel spacing set the rail spacing."
            source="Stage 2 review, figure 1.10"
          />
        </div>
      </Chapter>

      <Chapter
        id="lunar-calculations"
        title="Checking the loads"
        grey
        lede={<p>The worst case for a rail is the loaded wagon at midspan between two supports. We modeled a 1.50 m simply supported span and put the full factored load at the center.</p>}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-12">
          <div className="space-y-8">
            <dl className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
              {[["25.5 N", "factored load"], ["12.8 N", "each reaction"], ["9.6 N·m", "peak moment"]].map(([value, label]) => (
                <div key={label} className={STAT_CELL}>
                  <dt className="mt-2 text-sm text-[var(--text-tertiary)]">{label}</dt>
                  <dd className="wide text-[clamp(1.25rem,2.4vw,1.75rem)] leading-none tabular-nums text-[var(--text)]">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">10.5 kg loaded wagon × 1.62 m/s² lunar gravity × 1.5 safety factor = 25.5 N. Each support takes half, and the peak moment is <span className="whitespace-nowrap">P × L / 4</span>.</p>
            <table className="w-full text-left text-[15px]">
              <caption className="pb-3 text-left text-[17px] font-semibold text-[var(--text)]">Structure checks against 240 MPa yield</caption>
              <thead className="text-sm text-[var(--text-tertiary)]">
                <tr className="border-b border-[var(--text)]">
                  <th scope="col" className="py-2 pr-3 font-medium">Case, 1.5 factor on load</th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">Stress</th>
                  <th scope="col" className="py-2 text-right font-medium">Of yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {checks.map(([name, value, share]) => (
                  <tr key={name}>
                    <th scope="row" className="py-2.5 pr-3 font-normal text-[var(--text-secondary)]">{name}</th>
                    <td className="whitespace-nowrap py-2.5 pr-3 text-right tabular-nums text-[var(--text)]">{value}</td>
                    <td className="whitespace-nowrap py-2.5 text-right tabular-nums text-[var(--text)]">{share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">Leg stress on the Moon: 185 kg × 1.62 m/s² × 1.5, shared by six legs of 1,400 mm² each. Every case sits far below yield, so strength did not drive the leg size. Chapter 8 covers what should have.</p>
            <p className="text-sm text-[var(--text-tertiary)]">Stresses from the Stage 3 report, annex J table 17 and abstract. Yield shares computed here.</p>
          </div>
          <Figure
                        file="rail-load-hand-calculation.webp" width={667} height={419}
            alt="Handwritten rail free-body diagram with a centered load, support reaction equations, and a shear force plot."
            caption="Original free-body diagram, reactions, and shear plot."
            source="Critical-part mechanics worksheet, Apr. 1, 2025"
          />
        </div>
      </Chapter>

      <Chapter
        id="lunar-prototype"
        title="Testing the bench prototype"
        lede={<p>The bench build put the rails, insulation, and wagon into one assembly. We planned the strength test from NASA’s General Environmental Verification Standard (GSFC-STD-7000), which qualifies structures at 1.25 times the limit load.</p>}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-12">
          <Figure
            file="tube-interior.jpg" width={960} height={1280}
            alt="Lab prototype viewed inside the foil-lined tube, with two dark guide rails along the floor."
            caption="Guide rails inside the foil-lined bench prototype."
            source="Project photograph"
          />
          <div className="space-y-8 lg:pt-2">
            <dl className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
              {[["3 / 3", "wagon trials passed"], ["1.90 mm", "largest wheel clearance, target < 2 mm"], ["6.0 kg", "held 5 min on the wood mock-up rails"]].map(([value, label]) => (
                <div key={label} className={STAT_CELL}>
                  <dt className="mt-2 text-sm text-[var(--text-tertiary)]">{label}</dt>
                  <dd className="wide text-[clamp(1.25rem,2.4vw,1.75rem)] leading-none tabular-nums text-[var(--text)]">{value}</dd>
                </div>
              ))}
            </dl>
            <div className={PROSE}>
              <p>Clearance measured 1.85 to 1.90 mm across three wagon runs, and the wagon advanced every time. A separate continuity check confirmed the rails could carry power to the wagon.</p>
              <p>The wooden rails held four loads from 4.8 to 6.0 kg for five minutes each with no visible deformation. The lunar limit load is 17.0 N (10.5 kg × 1.62 m/s²), so the GEVS test load is 21.3 N. The 6 kg step put 59 N on a scale model made of wood, so it is not a direct comparison with the aluminium design. We did not measure deflection, so the test shows the mock-up held. It does not prove the beam model.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {demos.map((demo) => (
                <a key={demo.href} href={demo.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-light)]">
                  {demo.label} <ArrowUpRight className="h-4 w-4" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
            <p className="text-sm text-[var(--text-tertiary)]">Stage 3 report, section 2.4 and annex I.</p>
          </div>
        </div>
      </Chapter>

      <Chapter
        id="lunar-retro"
        title="Looking back"
        grey
        lede={<p>Our final report listed its own weaknesses. Re-reading it a year later, I would push further on the checks. Both lists are below.</p>}
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-12">
          {[
            { title: "What our report flagged", rows: reportFlags, source: "Stage 3 report, table 2." },
            { title: "What I would catch now", rows: myFlags, source: "My review of the Stage 3 calculations, 2026." },
          ].map((list) => (
            <div key={list.title}>
              <h4 className="text-xl font-semibold text-[var(--text)]">{list.title}</h4>
              <dl className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--text)]">
                {list.rows.map(([issue, fix]) => (
                  <div key={issue} className="py-4">
                    <dt className="text-[15px] leading-relaxed text-[var(--text-secondary)]">{issue}</dt>
                    <dd className="mt-1.5 text-[15px] font-medium leading-relaxed text-[var(--text)]">{fix}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm text-[var(--text-tertiary)]">{list.source}</p>
            </div>
          ))}
        </div>
      </Chapter>
    </div>
  );
}
