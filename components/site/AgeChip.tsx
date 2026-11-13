"use client";

import { usePathname } from "next/navigation";

interface AgeChipProps {
  locale: string;
  /** "Page" */
  page: string;
  /** "cover" — shown until the first page is reached */
  cover: string;
  /** number of pages in the story */
  total: number;
}

/**
 * The "Page n / 9" chip in the header. Only the story (home) page has it; elsewhere an empty span keeps the
 * header's three-part layout. lib/notebook/story.ts updates #age while you scroll.
 */
export function AgeChip({ locale, page, cover, total }: AgeChipProps) {
  const pathname = usePathname();
  if (pathname !== `/${locale}` && pathname !== `/${locale}/`) return <span />;
  return (
    <p className="age-chip is-cover" aria-hidden="true">
      {`${page} `}
      <b id="age">{cover}</b>
      <span>{`/ ${total}`}</span>
    </p>
  );
}
