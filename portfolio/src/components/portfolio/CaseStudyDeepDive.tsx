import { TRADEOFFS } from "@/components/prototype/projectData";
import { DEEP_DIVES, type Figure } from "./deepDiveData";

const WRAP = "mx-auto w-full max-w-[1352px] px-5 md:px-10 xl:px-16";
const H2 = "text-balance text-[clamp(2rem,4vw,3.25rem)]";

/** Every design decision for a project and what it bought, numbered. */
export function Tradeoffs({ id, min = 1 }: { id: string; min?: number }) {
  const list = TRADEOFFS[id];
  if (!list || list.length < min) return null;
  return (
    <section className={`${WRAP} mt-24 md:mt-32`}>
      <h2 className={H2}>Design decisions and tradeoffs</h2>
      <ol className={`mt-10 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-light)] bg-[var(--border-light)] md:grid-cols-2 ${list.length === 3 ? "lg:grid-cols-3" : ""}`}>
        {list.map((t, i) => (
          // three cards sit in three columns; any other odd last item spans the row instead of leaving an empty grey cell
          <li key={t.choice} className={`flex gap-5 bg-white p-6 md:p-8 ${i === list.length - 1 && list.length % 2 ? `md:col-span-2 ${list.length === 3 ? "lg:col-span-1" : ""}` : ""}`}>
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

function Img({ f }: { f: Figure }) {
  const tall = f.shape === "tall";
  // drawings and CAD renders show whole on white; photos and screenshots fill the frame
  const cover = f.fit ? f.fit === "cover" : tall;
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
          className={`w-full ${tall ? "aspect-[4/5]" : "aspect-[16/10]"} ${cover ? "object-cover object-top" : "object-contain p-3"}`}
        />
        <span className="sr-only">(opens full size in a new tab)</span>
      </a>
      <figcaption className="mt-2.5 text-[14px] text-[var(--text-tertiary)]">{f.caption}</figcaption>
    </figure>
  );
}

/** A hardware project's subsystems, each with its numbers and figures; nothing for projects without one. */
export function DeepDive({ id, anchor }: { id: string; anchor?: string }) {
  const dive = DEEP_DIVES[id];
  if (!dive) return null;
  return (
    <section className="light mt-24 py-20 md:mt-32 md:py-28">
      <div className={WRAP}>
        <h2 id={anchor} className={`${H2} scroll-mt-20`}>{dive.heading}</h2>
        <div className="mt-14 space-y-24 md:space-y-32">
          {dive.parts.map((p, i) => {
            const figs = p.figures ?? [];
            return (
            <article key={p.kicker} className={`grid gap-10 lg:gap-16 ${figs.length ? "lg:grid-cols-2" : ""}`}>
              <div className={i % 2 && figs.length ? "lg:order-2 max-w-[68ch]" : "max-w-[68ch]"}>
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
              {figs.length > 0 && (
                <div className={`grid content-start gap-6 ${figs.length > 1 ? "sm:grid-cols-2" : ""} ${i % 2 ? "lg:order-1" : ""}`}>
                  {figs.map((f, k) => (
                    <div key={f.src} className={figs.length === 3 && k === 0 ? "sm:col-span-2" : ""}>
                      <Img f={f} />
                    </div>
                  ))}
                </div>
              )}
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
