import type { Calc, Iteration, Media, Stage, Table, TechDive } from "./types";

const WRAP = "mx-auto w-full max-w-[1352px] px-5 md:px-10 xl:px-16";

/** Badge per verdict: what was kept reads strongest, what was dropped reads quietest. */
const VERDICT: Record<Iteration["verdict"], { label: string; cls: string }> = {
  kept: { label: "Kept", cls: "bg-[#e6f4ea] text-[#1e6b34] border-[#bfe3c9]" },
  revised: { label: "Revised", cls: "bg-[#fff4e0] text-[#8a5300] border-[#f3d9a8]" },
  dropped: { label: "Dropped", cls: "bg-[var(--surface-light)] text-[var(--text-tertiary)] border-[var(--border-light)]" },
};

/** Original-language evidence (French drawings, report pages) is labelled so the English text around it reads as the explanation. */
const KIND: Partial<Record<NonNullable<Media["kind"]>, string>> = {
  sketch: "Sketch",
  drawing: "Drawing",
  document: "Original page",
  chart: "Chart",
};

function Figure({ m, compact = false }: { m: Media; compact?: boolean }) {
  // drawings, documents and charts are shown whole on white; photos, renders and screenshots fill the frame
  const whole = m.kind === "drawing" || m.kind === "document" || m.kind === "chart" || m.kind === "sketch";
  const aspect = m.shape === "tall" ? "aspect-[4/5]" : m.shape === "square" ? "aspect-square" : "aspect-[16/10]";
  return (
    <figure className="min-w-0">
      <a
        href={m.src}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-[14px] border border-[var(--border-light)] bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,.35)] transition-shadow hover:shadow-[0_24px_48px_-26px_rgba(0,0,0,.4)]"
      >
        <img
          src={m.src}
          alt={m.caption}
          loading="lazy"
          decoding="async"
          className={`w-full ${aspect} ${whole ? "object-contain p-2" : "object-cover"} transition-transform duration-500 group-hover:scale-[1.02]`}
        />
        {m.kind && KIND[m.kind] && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">{KIND[m.kind]}</span>
        )}
        <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] text-[var(--text)] opacity-0 transition-opacity group-hover:opacity-100">
          Open full size ↗
        </span>
        <span className="sr-only">(opens full size in a new tab)</span>
      </a>
      <figcaption className={`mt-2 text-[var(--text-tertiary)] ${compact ? "text-[13px]" : "text-[14px]"}`}>{m.caption}</figcaption>
    </figure>
  );
}

function CalcCard({ c }: { c: Calc }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[var(--border-light)] bg-white">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--border-light)] bg-[var(--surface-light)] px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent-on-light)]">Worked calculation</span>
        <span className="text-[12px] text-[var(--text-tertiary)]">{c.source}</span>
      </div>
      <div className={`grid gap-5 p-5 ${c.proof ? "md:grid-cols-[minmax(0,1fr)_220px]" : ""}`}>
        <div className="min-w-0">
          <h5 className="text-[17px] font-semibold leading-snug text-[var(--text)]">{c.title}</h5>
          {c.given && c.given.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {c.given.map((g) => (
                <li key={g} className="rounded-md border border-[var(--border-light)] px-2 py-0.5 font-mono text-[12px] text-[var(--text-secondary)]">
                  {g}
                </li>
              ))}
            </ul>
          )}
          <ol className="mt-4 space-y-1.5 overflow-x-auto font-mono text-[13px] leading-relaxed text-[var(--text)]">
            {c.steps.map((s, i) => (
              <li key={i} className="flex gap-3 whitespace-pre-wrap">
                <span className="w-5 shrink-0 text-right tabular-nums text-[var(--text-tertiary)]">{i + 1}</span>
                <span className="min-w-0">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-[10px] border-l-[3px] border-[var(--accent)] bg-[var(--surface-light)] px-4 py-2.5 text-[15px] font-medium text-[var(--text)]">{c.result}</p>
        </div>
        {c.proof && <Figure m={c.proof} compact />}
      </div>
    </div>
  );
}

function IterationCard({ it }: { it: Iteration }) {
  const v = VERDICT[it.verdict];
  return (
    <li className={`flex flex-col rounded-[16px] border border-[var(--border-light)] bg-white p-4 ${it.verdict === "dropped" ? "opacity-85" : ""}`}>
      {it.media && <Figure m={it.media} compact />}
      <div className={`flex items-start justify-between gap-3 ${it.media ? "mt-3" : ""}`}>
        <span className="text-[16px] font-semibold leading-snug text-[var(--text)]">{it.name}</span>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${v.cls}`}>{v.label}</span>
      </div>
      <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--text-secondary)]">{it.summary}</p>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--text)]">
        <span className="font-medium">Why: </span>
        {it.reason}
      </p>
    </li>
  );
}

function DataTable({ t }: { t: Table }) {
  return (
    <figure className="min-w-0">
      <div className="overflow-x-auto rounded-[14px] border border-[var(--border-light)] bg-white">
        <table className="w-full min-w-[520px] text-left text-[14px]">
          <thead className="bg-[var(--surface-light)] text-[12px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
            <tr>
              {t.head.map((h) => (
                <th key={h} className="px-4 py-2.5 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&>tr+tr]:border-t [&>tr+tr]:border-[var(--border-light)]">
            {t.rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, k) => (
                  <td key={k} className={`px-4 py-2.5 align-top ${k === 0 ? "font-medium text-[var(--text)]" : "text-[var(--text-secondary)]"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-2 text-[14px] text-[var(--text-tertiary)]">{t.caption}</figcaption>
    </figure>
  );
}

function StageBlock({ s, i, last }: { s: Stage; i: number; last: boolean }) {
  const media = s.media ?? [];
  return (
    <li id={`stage-${i + 1}`} className="relative grid scroll-mt-24 gap-4 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10">
      {/* the rail: a numbered dot per stage joined by one line, dates read down the left edge */}
      <div className="relative flex items-start gap-3 md:block md:pt-1 md:text-right">
        <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--text-tertiary)] md:block">{s.date}</span>
        <span className="text-[13px] font-medium text-[var(--accent-on-light)] md:mt-1 md:block">{s.phase}</span>
        <span
          aria-hidden
          className="absolute -right-[29px] top-1 hidden h-[18px] w-[18px] place-items-center rounded-full border-2 border-[var(--accent)] bg-white text-[9px] font-semibold text-[var(--accent-on-light)] md:grid"
        >
          {i + 1}
        </span>
      </div>
      {!last && <span aria-hidden className="absolute bottom-[-56px] left-[200px] top-6 hidden w-px bg-[var(--border-light)] md:block" />}

      <div className="min-w-0 pb-2">
        <h3 className="text-[clamp(1.45rem,2.4vw,2rem)] leading-[1.12] text-[var(--text)]">{s.title}</h3>
        <p className="mt-3 max-w-[70ch] text-[16px] leading-relaxed text-[var(--text-secondary)]">{s.summary}</p>
        {s.points && s.points.length > 0 && (
          <ul className="mt-4 max-w-[70ch] space-y-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {s.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                {p}
              </li>
            ))}
          </ul>
        )}
        {s.stats && s.stats.length > 0 && (
          <dl className="mt-5 grid max-w-[720px] grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-[var(--border-light)] sm:grid-cols-4">
            {s.stats.map((x) => (
              <div key={x.label} className="flex flex-col-reverse bg-white px-4 py-3">
                <dt className="text-xs text-[var(--text-tertiary)]">{x.label}</dt>
                <dd className="font-mono text-xl tabular-nums text-[var(--text)]">{x.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {media.length > 0 && (
          <div className={`mt-6 grid gap-5 ${media.length === 1 ? "max-w-[820px]" : media.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
            {media.map((m) => (
              <Figure key={m.src} m={m} />
            ))}
          </div>
        )}
        {s.iterations && s.iterations.length > 0 && (
          <div className="mt-8">
            <h4 className="text-[15px] font-semibold text-[var(--text)]">Design iterations</h4>
            <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.iterations.map((it) => (
                <IterationCard key={it.name} it={it} />
              ))}
            </ul>
          </div>
        )}
        {s.tables?.map((t) => (
          <div key={t.caption} className="mt-8">
            <DataTable t={t} />
          </div>
        ))}
        {s.calcs && s.calcs.length > 0 && (
          <div className="mt-8 space-y-4">
            {s.calcs.map((c) => (
              <CalcCard key={c.title} c={c} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

/** The project's technical story as a numbered timeline, with an index of stages to jump between. */
export default function TechTimeline({ dive, anchor }: { dive: TechDive; anchor?: string }) {
  return (
    <section className="light mt-24 py-20 md:mt-32 md:py-28">
      <div className={WRAP}>
        <h2 id={anchor} className="scroll-mt-20 text-balance text-[clamp(2rem,4vw,3.25rem)]">{dive.heading}</h2>
        <p className="mt-4 max-w-[64ch] text-[17px] leading-relaxed text-[var(--text-secondary)]">{dive.intro}</p>
        <p className="mt-3 max-w-[64ch] text-[14px] text-[var(--text-tertiary)]">
          Drawings and calculation pages are the originals, some in French. The English text beside each one explains it. Click any image for full size.
        </p>

        {/* stage index: a scannable overview before the detail */}
        <ol className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {dive.stages.map((s, i) => (
            <li key={s.title} className="shrink-0">
              <a href={`#stage-${i + 1}`} className="flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--border-light)] bg-white px-3.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]">
                <span className="font-mono tabular-nums text-[var(--accent-on-light)]">{String(i + 1).padStart(2, "0")}</span>
                {s.phase}
              </a>
            </li>
          ))}
        </ol>

        <ol className="mt-14 space-y-20 md:space-y-24">
          {dive.stages.map((s, i) => (
            <StageBlock key={s.title} s={s} i={i} last={i === dive.stages.length - 1} />
          ))}
        </ol>

        {dive.sources.length > 0 && (
          <div className="mt-20 border-t border-[var(--border-light)] pt-6">
            <h4 className="text-[13px] font-medium text-[var(--text-tertiary)]">Built from</h4>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[var(--text-tertiary)]">
              {dive.sources.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
