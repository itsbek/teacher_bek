"use client";

/**
 * LocationMap
 * Static address card with an "Open in Google Maps" link.
 * No map tiles, no Leaflet, no API key — the map is opened externally.
 */

import { useTranslations } from "next-intl";
import { MapPin, ArrowUpRight } from "lucide-react";

const ADDRESS = "Golden Mansion 1, 119 Phổ Quang, Phú Nhuận, TP. Hồ Chí Minh";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

export default function LocationMap() {
  const t = useTranslations("location");

  return (
    <div className="flex flex-col gap-6 border border-foreground/15 bg-transparent p-6 md:p-8">
      <div className="flex items-start gap-4">
        <MapPin className="mt-1 h-5 w-5 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
        <p className="font-sans text-[1.0625rem] leading-relaxed text-foreground">{ADDRESS}</p>
      </div>
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex min-h-[44px] w-full items-center justify-between gap-3 border border-foreground/40 px-5 py-3 text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground sm:w-auto sm:justify-start"
      >
        <span className="font-sans text-[12px] uppercase tracking-[0.16em]">{t("openInMaps")}</span>
        <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} aria-hidden="true" />
      </a>
    </div>
  );
}
