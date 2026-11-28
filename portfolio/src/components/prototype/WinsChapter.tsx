import Link from "next/link";

import { ALSO_COMPETED, COMMUNITY, FOCUS, FRAMING, SCHOLARSHIPS, WINS, allProjects, type Recognition } from "./projectData";

/** The winning project's own image, aimed like the Projects chapter (named region or focal point). */
function WinImage({ slug, alt }: { slug: string; alt: string }) {
  const item = allProjects.find((p) => p.slug === slug);
  if (!item?.image) return null;
  const crop = FRAMING[item.id];
  if (crop) {
    // the named region was framed for 16:10; this 4:3 frame is taller, so zoom into its centre until it fills
    const zoom = 1.5;
    const left = crop.x + (crop.w - crop.w / zoom) / 2;
    return (
      <img
        src={item.image}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute left-0 top-0 h-auto max-w-none"
        style={{ width: `${(100 / crop.w) * zoom}%`, transform: `translate(-${left * 100}%, -${crop.y * 100}%)` }}
      />
    );
  }
  return (
    <img
      src={item.image}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
      style={{ objectPosition: FOCUS[item.id] ?? "center" }}
    />
  );
}

/**
 * One entry as a picture card, like the wins: the 16:10 card from /game, then the role, organisation,
 * date (or amount) and one sentence. The whole card links when there is a case study.
 */
function RecordCard({ r, money, className }: { r: Recognition; money?: boolean; className?: string }) {
  const body = (
    <>
      <span className="relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-[var(--border-light)] bg-white shadow-[0_24px_48px_-30px_rgba(0,0,0,0.35)]">
        {r.image ? (
          <img
            src={r.image}
            alt={r.org}
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
          />
        ) : (
          r.logo && <img src={r.logo} alt={r.org} loading="lazy" decoding="async" className="h-full w-full object-contain p-10" />
        )}
      </span>
      <span className="mt-5 flex items-baseline justify-between gap-4">
        <span className="text-sm text-[var(--text-on-light-secondary)]">{r.org}</span>
        {r.meta && (
          <span className={money ? "shrink-0 whitespace-nowrap text-lg font-semibold tabular-nums text-[var(--text-on-light)]" : "shrink-0 whitespace-nowrap font-mono text-xs tabular-nums text-[var(--text-on-light-secondary)]"}>
            {r.meta}
          </span>
        )}
      </span>
      <h4 className="mt-2 text-[1.35rem] leading-[1.15] text-[var(--text-on-light)] transition-colors group-hover:text-[var(--accent-on-light)]">
        {r.title}
        {r.href && (
          <span aria-hidden className="ml-1.5 inline-block text-[var(--accent-on-light)] transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        )}
      </h4>
      {r.detail && <span className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-[var(--text-on-light-secondary)]">{r.detail}</span>}
    </>
  );
  return <li className={className}>{r.href ? <Link href={r.href} className="group flex h-full flex-col">{body}</Link> : <div className="group flex h-full flex-col">{body}</div>}</li>;
}

/**
 * A titled grid of picture cards, all one width. Three across on a six-column grid: a short last row is centred
 * (and a lone last card on two columns too), so no row ends in an empty slot. `pair` lays two cards side by side.
 */
function Panel({ title, items, money, pair }: { title: string; items: Recognition[]; money?: boolean; pair?: boolean }) {
  const n = items.length;
  const place = (i: number) => {
    if (pair) return undefined;
    const c = ["lg:col-span-2"];
    if (n % 2 === 1 && i === n - 1) c.push("sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)] lg:mx-0 lg:w-auto");
    const lastRow = n - (n % 3 || 3);
    if (i === lastRow && n % 3 === 2) c.push("lg:col-start-2");
    if (i === lastRow && n % 3 === 1) c.push("lg:col-start-3");
    return c.join(" ");
  };
  return (
    <div className="mt-24">
      <h3 className="text-lg text-[var(--text-on-light)]">{title}</h3>
      <ul className={`mt-5 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:gap-x-8 ${pair ? "" : "lg:grid-cols-6"}`}>
        {items.map((r, i) => (
          <RecordCard key={r.title + r.org} r={r} money={money} className={place(i)} />
        ))}
      </ul>
    </div>
  );
}

/** A project's image filling a wide card (the 4:3 framing above is tuned for the win cards, not this ratio). */
function ProjectThumb({ slug }: { slug: string }) {
  const item = allProjects.find((p) => p.slug === slug);
  if (!item?.image) return null;
  return (
    <img
      src={item.image}
      alt=""
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
      style={{ objectPosition: FOCUS[item.id] ?? "center" }}
    />
  );
}

/** Static light section: no pinning, just the record. Wins lead with what was built; the rest reads as two lists. */
export default function WinsChapter({ id }: { id: string }) {
  return (
    <section id={id} data-theme="light" className="white px-6 md:px-10 xl:px-16 pb-28 pt-28">
      <div className="mx-auto max-w-[1352px]">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="max-w-3xl text-[clamp(2.25rem,4.5vw,3.75rem)]">Three hackathon wins.</h2>
          <p className="max-w-[26rem] text-[1.0625rem] leading-[1.55] text-[var(--text-on-light-secondary)]">
            Each one built over a hackathon weekend, with a full write-up in the projects below.
          </p>
        </div>

        {/* the project photo is the card: no boxes, the image and the type carry it */}
        <ol className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-3 lg:gap-x-8">
          {WINS.map((w) => (
            <li key={w.event}>
              <Link href={`/portfolio/${w.slug}`} className="group flex h-full flex-col">
                <span className="relative block aspect-[4/3] overflow-hidden rounded-[18px] bg-[var(--mat-ink)] shadow-[0_24px_48px_-30px_rgba(0,0,0,0.45)]">
                  <WinImage slug={w.slug} alt={w.project} />
                </span>
                <span className="mt-5 text-sm text-[var(--text-on-light-secondary)]">
                  {w.event} · {w.date}
                </span>
                <h3 className="mt-2 text-[1.6rem] leading-[1.12] text-[var(--text-on-light)]">{w.prize}</h3>
                {w.sponsor && <span className="mt-1.5 text-sm text-[var(--text-on-light-secondary)]">{w.sponsor}</span>}
                <span aria-hidden className="min-h-4 flex-1" />
                <span className="mt-4 flex items-baseline justify-between gap-4 border-t border-[var(--border-light)] pt-3.5 text-[15px]">
                  <span className="font-medium text-[var(--text-on-light)]">{w.project}</span>
                  <span className="whitespace-nowrap text-[var(--accent-on-light)]">
                    Case study{" "}
                    <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {/* the other hackathon builds: the project's own image leads, the event's logo sits beside the name */}
        <div className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2">
            <h3 className="text-lg text-[var(--text-on-light)]">Also built at hackathons</h3>
            <p className="text-sm text-[var(--text-on-light-secondary)]">Each one has a full case study.</p>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
            {ALSO_COMPETED.map((c) => (
              <li key={c.event}>
                <Link href={`/portfolio/${c.slug}`} className="group block">
                  <span className="relative block aspect-[16/10] overflow-hidden rounded-[16px] bg-[var(--mat-ink)] shadow-[0_18px_36px_-26px_rgba(0,0,0,0.5)]">
                    <ProjectThumb slug={c.slug} />
                  </span>
                  <span className="mt-3 flex items-start gap-2.5 sm:mt-4 sm:items-center sm:gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[var(--border-light)] sm:h-12 sm:w-12"
                      style={{ background: c.logoBg ?? "#ffffff" }}
                    >
                      {c.logo ? (
                        <img src={c.logo} alt="" width={44} height={44} loading="lazy" decoding="async" className={`h-full w-full ${c.bleed ? "object-cover" : "object-contain p-1"}`} />
                      ) : (
                        <span aria-hidden className="text-base font-semibold text-[var(--text-on-light)]">
                          {c.event.charAt(0)}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[16px] font-semibold leading-snug text-[var(--text-on-light)] transition-colors group-hover:text-[var(--accent-on-light)]">
                        {c.project}
                      </span>
                      <span className="block text-sm text-[var(--text-on-light-secondary)]">
                        {c.event} · {c.date}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* the rest of the record, as picture cards like the wins */}
        <Panel title="Beyond the hackathons" items={COMMUNITY} />
        <Panel title="Scholarships" items={SCHOLARSHIPS} money pair />
      </div>
    </section>
  );
}
