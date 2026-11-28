"use client";

import { ArrowLeft, ArrowUpRight, FileText, GitBranch, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import type { PortfolioItem } from "@/lib/portfolio";
import { CONTACT, OpenTo } from "@/components/prototype/stage";
import { DRAWINGS, FOCUS, photoFor } from "@/components/prototype/projectData";
import LunarEngineering from "./LunarEngineering";
import "@/components/prototype/prototype.css";
import { DeepDive, Tradeoffs } from "./CaseStudyDeepDive";
import TechTimeline from "./deepDives/TechTimeline";
import { techDiveFor } from "./deepDives";

/**
 * Case study page in the homepage's "Machined Product" system (portfolio/DESIGN.md): light page, Archivo set wide
 * for headings, one kapton accent, crisp hairlines. Everything is visible on first paint; the title's word mask is
 * the page's one entrance.
 */

const WRAP = "mx-auto w-full max-w-[1352px] px-5 md:px-10 xl:px-16";

// ── details text → structured blocks ─────────────────────────────────────────
// The data writes headings in capitals ("WHY WE BUILT IT", "RESULTS (no-hindsight replays)") and bullets as "• ".
type Block = { kind: "p"; text: string } | { kind: "h"; text: string } | { kind: "ul"; items: string[] };

const isHeading = (line: string) => {
  const head = line.split("(")[0].trim();
  return head.length > 2 && head.length < 48 && /[A-Z]/.test(head) && head === head.toUpperCase() && !/[.:]$/.test(head);
};

const sentenceCase = (line: string) => {
  const i = line.indexOf("(");
  const head = (i > 0 ? line.slice(0, i) : line).trim().toLowerCase();
  const rest = i > 0 ? ` ${line.slice(i)}` : "";
  return head.charAt(0).toUpperCase() + head.slice(1) + rest;
};

function parseDetails(details: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of details.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (/^[•\-–]\s*/.test(line)) {
      const text = line.replace(/^[•\-–]\s*/, "");
      const last = blocks[blocks.length - 1];
      if (last?.kind === "ul") last.items.push(text);
      else blocks.push({ kind: "ul", items: [text] });
    } else if (isHeading(line)) {
      blocks.push({ kind: "h", text: sentenceCase(line) });
    } else {
      blocks.push({ kind: "p", text: line });
    }
  }
  return blocks;
}

function Details({ text }: { text: string }) {
  const blocks = parseDetails(text);
  return (
    <div className="max-w-[68ch] text-pretty text-[17px] leading-[1.65] text-[var(--text-secondary)]">
      {blocks.map((b, i) => {
        if (b.kind === "h")
          return (
            <h3 key={i} className="mb-3 mt-12 text-[1.25rem] text-[var(--text)] first:mt-0">
              {b.text}
            </h3>
          );
        if (b.kind === "ul")
          return (
            <ul key={i} className="my-5 space-y-3">
              {b.items.map((item, j) => (
                <li key={j} className="relative pl-6">
                  <span aria-hidden className="absolute left-0 top-[0.72em] h-px w-3 bg-[var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i} className={i === 0 ? "text-[19px] leading-[1.6] text-[var(--text)]" : "my-5"}>
            {b.text}
          </p>
        );
      })}
    </div>
  );
}

// ── pieces ───────────────────────────────────────────────────────────────────
function LinkIcon({ kind }: { kind?: string }) {
  return kind === "github" ? <GitBranch aria-hidden className="h-4 w-4" /> : <ExternalLink aria-hidden className="h-4 w-4" />;
}

const BTN =
  "group inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-md)] border px-5 text-[15px] font-medium transition-[transform,background-color,border-color,box-shadow] duration-200 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0";
const BTN_PRIMARY = `${BTN} border-black/30 bg-[var(--text)] bg-linear-to-b from-white/12 to-transparent text-[var(--bg)] shadow-[inset_0_1px_0_rgba(255,255,255,.22),0_2px_5px_rgba(0,0,0,.15)] hover:bg-black`;
const BTN_GHOST = `${BTN} border-[var(--border-hover)] bg-[rgba(var(--bg-light-rgb),.88)] bg-linear-to-b from-white/90 to-transparent text-[var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,.85),0_2px_5px_rgba(0,0,0,.06)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg)]`;

function TopBar({ title }: { title: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-[rgba(var(--bg-rgb),.95)] bg-linear-to-b from-white/45 to-transparent shadow-[0_1px_4px_rgba(0,0,0,.04)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto grid h-12 max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:px-10 xl:px-16">
        <Link
          href="/#chapter-projects"
          className="group inline-flex min-h-[44px] items-center gap-2 justify-self-start whitespace-nowrap text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
        >
          <ArrowLeft aria-hidden className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:-translate-x-0.5" />
          All projects
        </Link>
        <Link href="/" className="wide inline-flex min-h-[44px] items-center whitespace-nowrap text-[15px] tracking-tight text-[var(--text)]">
          Louis Zhang
        </Link>
        <span className="hidden max-w-[220px] truncate justify-self-end text-[13px] text-[var(--text-tertiary)] md:block">{title}</span>
      </div>
    </header>
  );
}

function Hero({ item, logo, hasHardwareDetails }: { item: PortfolioItem; logo: string | null; hasHardwareDetails: boolean }) {
  const isLunar = item.slug === "lunar-transport-system";
  // every hero reads: category, title, meta row, buttons, then the media frame. The subtitle often carries the date already; say it once
  const meta = [...item.subtitle.split(" · "), item.date && !item.subtitle.includes(item.date) ? item.date : ""].filter(Boolean);
  const words = item.title.split(" ");
  return (
    <section className={`${WRAP} pb-10 pt-28 md:pt-36`}>
      <div className="flex items-center gap-4">
        {logo && (
          // logos come with their own ground (red Tesla, navy Lockheed), so the tile is the logo itself
          <img src={logo} alt={`${item.title} logo`} width={88} height={56} className="h-14 w-[88px] rounded-[var(--radius-md)] border border-[var(--border)] object-cover" />
        )}
        <p className="text-[15px] text-[var(--text-tertiary)]">{item.displaySector}</p>
      </div>
      <h1 className="mt-4 max-w-[14ch] text-balance text-[clamp(2.75rem,7vw,5.75rem)] text-[var(--text)]">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="word-mask">
              <span style={{ animationDelay: `${0.05 + i * 0.06}s` }}>{w}</span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </h1>
      {isLunar ? (
        <>
          <p className="mt-6 max-w-[40ch] text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.4] text-[var(--text)]">
            A telescoping 3 m tube that carries fresh produce from a lunar greenhouse to a habitat. I led the seven-student team that designed its structure and fitted four other teams’ subsystems into it.
          </p>
          <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-4 text-[15px] sm:grid-cols-4">
            {[["Role", "Team lead, structure and integration"], ["Program", "CSA LEAP OASIS design course (AER1110)"], ["School", "Polytechnique Montréal"], ["When", "Jan. to Apr. 2025"]].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[var(--text-tertiary)]">{k}</dt>
                <dd className="mt-0.5 text-[var(--text)]">{v}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <ul className="mt-6 flex max-w-3xl flex-wrap gap-x-3 gap-y-1 text-[17px] leading-[1.5] text-[var(--text-secondary)]">
          {meta.map((m, i) => (
            <li key={m} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--border-hover)]" />}
              {m}
            </li>
          ))}
        </ul>
      )}
      {(isLunar || hasHardwareDetails || item.links.length > 0 || item.documents.length > 0) && (
        <div className="mt-8 flex flex-wrap gap-3">
          {isLunar && <a href="#lunar-engineering" className={BTN_PRIMARY}>See the engineering work</a>}
          {hasHardwareDetails && <a href="#hardware-details" className={BTN_PRIMARY}>Explore the hardware</a>}
          {!isLunar && item.links.map((link, i) => (
            <a key={`${link.href}-${i}`} href={link.href} target="_blank" rel="noopener noreferrer" className={i === 0 && !hasHardwareDetails ? BTN_PRIMARY : BTN_GHOST}>
              <LinkIcon kind={link.kind} />
              {link.label}
              <ArrowUpRight aria-hidden className="h-3.5 w-3.5 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function Specs({ item }: { item: PortfolioItem }) {
  const cells = item.metrics.slice(0, 4).map((m) => {
    // only a leading number becomes the big value ("8.4 cm ...", "0.3 s ..."); a phrase like "No cameras" stays whole
    // a unit or ordinal word stays with its number ("8.4 cm", "24 hour", "1st place")
    const u = /^(\S*\d\S*(?: (?:mm|cm|m|km|s|ms|h|hour|hours|kg|g|N|kN|MPa|Hz|kHz|V|W|place))?),? (.+)$/.exec(m);
    return u ? { value: u[1], caption: u[2] } : { value: m, caption: "" };
  });
  // numbers get the big-figure cells; phrases ("Gmail auto-sync") read as one full-width line of plain text
  const nums = cells.filter((c) => c.caption);
  const phrases = cells.filter((c) => !c.caption);
  if (!cells.length) return null;
  return (
    <div className={`${WRAP} mt-12`}>
      {nums.length > 0 && (
        <dl className={`grid grid-cols-2 gap-px ${["", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4"][nums.length]}`}>
          {nums.map((c) => (
            <div key={c.value + c.caption} className="flex flex-col-reverse justify-end border-t border-[var(--text)] pb-2 pr-4 pt-4">
              <dt className="mt-2 text-[14px] text-[var(--text-tertiary)]">{c.caption}</dt>
              <dd className="wide text-[clamp(1.75rem,3.2vw,2.5rem)] leading-none tabular-nums text-[var(--text)]">{c.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {phrases.length > 0 && (
        <ul className={`flex flex-wrap gap-x-3 gap-y-1 border-t border-[var(--text)] pt-4 text-[17px] text-[var(--text)] ${nums.length ? "mt-4" : ""}`}>
          {phrases.map((c, i) => (
            <li key={c.value} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--accent)]" />}
              {c.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Gallery({ item, src }: { item: PortfolioItem; src: string[] }) {
  const pages = src.some((s) => s.includes("/portfolio-pages/full/"));
  // portrait photos (Nursie's sensor shots) get a portrait frame instead of a wide crop; measured once each loads
  const [tall, setTall] = useState<Record<string, boolean>>({});
  const measure = (s: string, el: HTMLImageElement | null) => {
    if (!el?.complete || !el.naturalWidth) return;
    const t = el.naturalHeight > el.naturalWidth;
    setTall((m) => (m[s] === t ? m : { ...m, [s]: t }));
  };
  const allTall = !pages && src.length > 1 && src.every((s) => tall[s]);
  if (!src.length) return null;
  return (
    <section className="light mt-24 py-20 md:py-28">
      <div className={WRAP}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-balance text-[clamp(2rem,4vw,3.25rem)]">{pages ? "Portfolio pages" : "Gallery"}</h2>
          {pages && item.documents[0] && (
            <a href={item.documents[0].href} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
              Full PDF
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
        <div className={`mt-10 grid gap-6 ${pages ? "mx-auto max-w-[940px]" : allTall ? "sm:grid-cols-2 lg:grid-cols-3" : src.length > 1 ? "md:grid-cols-2" : ""}`}>
          {src.map((s, i) => (
            <a
              key={s}
              data-lead={!pages && !allTall && src.length % 2 === 1 && i === 0 ? "" : undefined}
              href={s}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-light)] bg-white data-[lead]:md:col-span-2 shadow-[0_1px_0_rgba(0,0,0,.03),0_24px_48px_-28px_rgba(0,0,0,.28)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(0,0,0,.03),0_36px_60px_-28px_rgba(0,0,0,.35)]"
            >
              <div className={pages ? "aspect-[8.5/11] p-2" : allTall ? "aspect-[3/4] overflow-hidden" : "aspect-[16/10] overflow-hidden group-data-[lead]:md:aspect-[2/1]"}>
                <img
                  src={s}
                  alt={pages ? `${item.title}, portfolio page ${i + 1}` : `${item.title}, image ${i + 1}`}
                  width={pages ? 850 : 1600}
                  height={pages ? 1100 : 1000}
                  loading="lazy"
                  decoding="async"
                  ref={(el) => measure(s, el)}
                  onLoad={(e) => measure(s, e.currentTarget)}
                  className={`h-full w-full ${pages || (tall[s] && !allTall) ? "object-contain" : "object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025]"}`}
                />
              </div>
              <span className="sr-only">(opens full size in a new tab)</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Related({ item, related: all }: { item: PortfolioItem; related: PortfolioItem[] }) {
  // a card without a picture reads as a broken box, so only projects with one are suggested
  const related = all.filter((r) => r.image ?? r.gallery[0]);
  if (!related.length) return null;
  return (
    <section className={`${WRAP} py-20 md:py-28`}>
      <h2 className="text-balance text-[clamp(2rem,4vw,3.25rem)]">More in {item.displaySector.toLowerCase()}</h2>
      <ul className={`mt-10 grid gap-6 sm:grid-cols-2 ${related.length >= 3 ? "lg:grid-cols-3" : ""}`}>
        {related.map((rel) => {
          const thumb = rel.image ?? rel.gallery[0];
          return (
            <li key={rel.id}>
              <Link href={`/portfolio/${rel.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-light)] bg-[var(--bg-light)]">
                  {thumb && (
                    <img
                      src={thumb}
                      alt=""
                      width={800}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.03] ${
                        thumb.includes("/logo/") ? "object-contain p-10" : "object-cover"
                      }`}
                    />
                  )}
                </div>
                <h3 className="mt-4 flex items-center justify-between gap-3 text-[1.25rem] text-[var(--text)]">
                  {rel.title}
                  <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-[var(--accent-on-light)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </h3>
                <p className="mt-1 text-[15px] text-[var(--text-tertiary)]">{rel.metrics[0] ?? rel.subtitle}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className={`${WRAP} flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between`}>
        <div>
          <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)]">Let&apos;s build the next one.</h2>
          <OpenTo className="mt-5" />
        </div>
        <div className="flex flex-wrap items-center gap-x-6 text-[15px] [&>a]:inline-flex [&>a]:min-h-[44px] [&>a]:items-center">
          <a href={`mailto:${CONTACT.email}`} className="link font-medium">
            {CONTACT.email}
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]">
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]">
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href="/#chapter-projects" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]">
            All projects
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
export default function ProjectCaseStudy({ item, related }: { item: PortfolioItem; related: PortfolioItem[] }) {
  const isLunar = item.slug === "lunar-transport-system";
  const hasHardwareDetails = item.id === "P-3" || item.id === "P-5";
  // a real photo leads when there is one; a page of the PDF deck stays in the gallery
  const heroSrc = photoFor(item.id) ?? item.image ?? item.gallery[0] ?? null;
  const heroIsPage = heroSrc?.includes("/portfolio-pages/full/") ?? false;
  const heroIsLogo = heroSrc?.includes("/logo/") ?? false;
  // diagrams, drawings and CAD show whole in the frame; photos and screenshots fill it
  const heroWhole = DRAWINGS.has(item.id) || /\/diagrams\/|drawing|cutaway/.test(heroSrc ?? "");
  // a page or logo already shown as the hero isn't repeated in the gallery
  const gallery = item.gallery.filter((s) => !(heroIsLogo && s === heroSrc));

  return (
    <main className="proto min-h-screen overflow-x-clip">
      <TopBar title={item.title} />
      <Hero item={item} logo={heroIsLogo ? heroSrc : null} hasHardwareDetails={hasHardwareDetails} />

      {heroSrc && !heroIsPage && !heroIsLogo && (
        <div className={WRAP}>
          <div
            className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border-light)] bg-[var(--bg-light)] shadow-[0_1px_0_rgba(0,0,0,.03),0_40px_80px_-40px_rgba(0,0,0,.35)]"
          >
            <img
              src={heroSrc}
              alt={`${item.title}, featured image`}
              width={1600}
              height={800}
              fetchPriority="high"
              decoding="async"
              className={`aspect-video w-full ${heroWhole ? "bg-white object-contain p-3 md:p-6" : "object-cover"}`}
              style={{ objectPosition: FOCUS[item.id] }}
            />
          </div>
        </div>
      )}

      <Specs item={item} />

      {isLunar && <LunarEngineering demos={item.links} />}

      {!isLunar && (
      <section className={`${WRAP} mt-20 grid gap-12 md:mt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16`}>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-balance text-[clamp(2rem,4vw,3.25rem)]">Overview</h2>
          {item.skills.length > 0 && (
            <>
              <h3 className="mt-10 text-[15px] font-medium [font-stretch:100%] text-[var(--text-tertiary)]">Tools and skills</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {item.skills.map((s) => (
                  <li key={s} className="rounded-[var(--radius-sm)] border border-[var(--border)] px-2.5 py-1 text-[13px] text-[var(--text-secondary)]">
                    {s}
                  </li>
                ))}
              </ul>
            </>
          )}
          {item.documents.length > 0 && (
            <>
              <h3 className="mt-10 text-[15px] font-medium [font-stretch:100%] text-[var(--text-tertiary)]">Documents</h3>
              <ul className="mt-3 border-t border-[var(--border)]">
                {item.documents.map((d) => (
                  <li key={d.href} className="border-b border-[var(--border)]">
                    <a href={d.href} target="_blank" rel="noopener noreferrer" className="group flex min-h-[48px] items-center gap-3 text-[15px] text-[var(--text)]">
                      <FileText aria-hidden className="h-4 w-4 text-[var(--text-tertiary)]" />
                      <span className="flex-1">{d.label}</span>
                      <ArrowUpRight aria-hidden className="h-4 w-4 text-[var(--accent-on-light)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
        <Details text={item.details} />
      </section>
      )}

      {!isLunar && (
        <>
          {/* a single decision card reads as unfinished; the timeline's own decisions stage covers it */}
          <Tradeoffs id={item.id} min={techDiveFor(item.id) ? 2 : 1} />
          {techDiveFor(item.id) ? (
            <TechTimeline dive={techDiveFor(item.id)!} anchor={hasHardwareDetails ? "hardware-details" : undefined} />
          ) : (
            <DeepDive id={item.id} anchor={hasHardwareDetails ? "hardware-details" : undefined} />
          )}
          <Gallery item={item} src={gallery} />
        </>
      )}
      {isLunar && techDiveFor(item.id) && <TechTimeline dive={techDiveFor(item.id)!} collapsed="Full engineering record: stages, calculations and drawings" />}
      <Related item={item} related={related} />
      <Footer />
    </main>
  );
}
