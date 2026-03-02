"use client";

/**
 * LocationMap
 * Free map with CartoDB Dark Matter tiles (OpenStreetMap data).
 * No Google, no API key, no billing.
 * Clicking anywhere opens native Maps / Google Maps with directions.
 */

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const LAT = 10.809185405016475;
const LNG = 106.67111255387708;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=119+%C4%90.+Ph%E1%BB%95+Quang%2C+Ph%C6%B0%E1%BB%9Dng+9%2C+Ph%C3%BA+Nhu%E1%BA%ADn%2C+H%E1%BB%93+Ch%C3%AD+Minh%2C+Vietnam`;

// Dark pin — visible against both CartoDB dark tiles and white fallback
const pinIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="34" viewBox="0 0 26 34"
              style="filter:drop-shadow(0 3px 6px rgba(0,0,0,0.5))">
           <path d="M13 0C5.82 0 0 5.82 0 13c0 9.1 13 21 13 21S26 22.1 26 13C26 5.82 20.18 0 13 0z"
                 fill="#101010" stroke="#f7f7f7" stroke-width="1.5"/>
           <circle cx="13" cy="13" r="4.5" fill="#f7f7f7"/>
         </svg>`,
  className: "",
  iconSize: [26, 34],
  iconAnchor: [13, 34],
});

export default function LocationMap() {
  return (
    <a
      href={DIRECTIONS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get directions to Golden Mansion, Phú Nhuận — opens in Maps"
      className="relative block w-full overflow-hidden border border-foreground/15 group"
      style={{ height: "300px" }}
    >
      {/* Location chip — above map layers */}
      <div className="absolute top-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm border border-foreground/10 px-4 py-2 group-hover:bg-foreground group-hover:text-background transition-all duration-300 pointer-events-none">
        <span className="font-sans text-[12px] uppercase tracking-[0.16em] font-light flex items-center gap-2">
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
            <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor"/>
          </svg>
          Golden Mansion, Phú Nhuận
        </span>
      </div>

      {/* Map — fills the container */}
      <MapContainer
        center={[LAT, LNG]}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        keyboard={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        <Marker position={[LAT, LNG]} icon={pinIcon} />
      </MapContainer>

      {/* Full-area click overlay — above Leaflet's own layer stack (z 400+) */}
      <div className="absolute inset-0 z-[999] cursor-pointer" />
    </a>
  );
}
