import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPortfolioItemBySlug } from "@/lib/portfolio";
import { LUNAR_PROJECT_HREF, LUNAR_PROJECT_SLUG } from "./projectData";

export default function LunarChapter({ id }: { id: string }) {
  const project = getPortfolioItemBySlug(LUNAR_PROJECT_SLUG);
  if (!project) return null;

  return (
    <section
      id={id}
      data-theme="light"
      aria-labelledby="lunar-chapter-title"
      className="light scroll-mt-12 border-y border-[var(--border-light)] px-6 py-14 sm:py-20 md:px-10 xl:px-16"
    >
      <div className="mx-auto grid max-w-[1352px] items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
        <div>
          <p className="font-mono text-xs font-medium tracking-wide text-[var(--accent-on-light)]">
            CSA LEAP OASIS · Structure team lead
          </p>
          <h2 id="lunar-chapter-title" className="mt-4 text-[clamp(2rem,10vw,3.75rem)] md:text-[clamp(2.25rem,4.4vw,4rem)]">
            {project.title}
          </h2>
          <p className="mt-5 max-w-[41ch] text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            I led the seven-person team that designed the structure and interfaces of a telescoping tube carrying a rail-guided wagon between a lunar greenhouse and a habitat.
          </p>
          <ul className="mt-6 grid gap-x-5 gap-y-2 border-y border-[var(--border-light)] py-4 text-sm font-medium text-[var(--text)] sm:grid-cols-2">
            {project.metrics.map((metric) => <li key={metric}>{metric}</li>)}
          </ul>
          <Link
            href={LUNAR_PROJECT_HREF}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--text)] px-4 text-sm font-semibold text-[var(--bg)] motion-safe:transition-colors hover:bg-[var(--mat-graphite-hi)]"
          >
            Explore the design process <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <figure className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-[var(--surface-light)]">
          <Image
            src="/media/csa/prototype-overview.jpg"
            width={800}
            height={706}
            sizes="(min-width: 1024px) 52vw, (min-width: 768px) 46vw, 100vw"
            alt="Foil-lined bench prototype with its rail-guided wagon and control wiring exposed"
            className="aspect-[4/3] w-full object-cover object-center"
          />
          <figcaption className="border-t border-[var(--border-light)] px-4 py-3 text-sm text-[var(--text-secondary)]">
            The structure team’s bench prototype, with the wagon and rail interface exposed.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
