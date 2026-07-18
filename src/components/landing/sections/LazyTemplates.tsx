"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-loads the below-fold Templates showcase (the heaviest client section on
 * the landing page). Rendered with ssr:false so its JS chunk is fetched only
 * when the browser reaches it, cutting initial bundle work.
 */
const TemplatesSection = dynamic(
  () => import("./Templates").then((m) => ({ default: m.Templates })),
  {
    ssr: false,
    loading: () => (
      <section
        aria-hidden="true"
        className="min-h-[640px] w-full animate-pulse bg-gradient-to-b from-transparent via-paper/50 to-transparent"
      />
    ),
  }
);

export function LazyTemplates() {
  return <TemplatesSection />;
}
