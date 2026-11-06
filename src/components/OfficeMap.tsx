'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import type { OfficeView } from '@/lib/offices';

export type MapSelection = { index: number; fly: boolean };

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/**
 * Interactive map of the offices (Leaflet with OpenStreetMap tiles, darkened and warmed to the site's gold palette in CSS).
 * Loads only when scrolled near, never captures the scroll wheel, and leaves one-finger swipes to the page on
 * touch screens. Selecting a pin calls onSelect; `selection` highlights a pin and (when fly is set) pans to it.
 */
export default function OfficeMap({
  offices,
  selection,
  onSelect,
}: {
  offices: OfficeView[];
  selection: MapSelection | null;
  onSelect: (index: number) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef(new Map<number, Marker>());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [ready, setReady] = useState(false);
  const pinned = offices.map((o, i) => ({ o, i })).filter(({ o }) => o.position);

  // Create the map once it is near the viewport
  useEffect(() => {
    const node = el.current;
    if (!node || pinned.length === 0) return;
    let cancelled = false;
    let created: LeafletMap | null = null;

    const init = async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !node) return;
      const touch = window.matchMedia('(hover: none)').matches;
      created = L.map(node, { scrollWheelZoom: false, dragging: !touch, zoomControl: true, attributionControl: true });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(created);

      pinned.forEach(({ o, i }, n) => {
        const icon = L.divIcon({
          className: 'office-pin-wrap',
          html: `<span class="office-pin"><span class="office-pin__num">${n + 1}</span></span>`,
          iconSize: [38, 48],
          iconAnchor: [19, 46],
          popupAnchor: [0, -42],
        });
        const popup =
          `<p class="office-popup__title">${escapeHtml(o.title)}</p>` +
          (o.name ? `<p class="office-popup__name">${escapeHtml(o.name)}</p>` : '') +
          `<p class="office-popup__address">${escapeHtml(o.address)}</p>` +
          (o.directionsHref
            ? `<a class="office-popup__link" href="${escapeHtml(o.directionsHref)}" target="_blank" rel="noopener noreferrer">Get directions ↗</a>`
            : '');
        const marker = L.marker(o.position!, { icon, title: o.title, alt: o.title, keyboard: true, riseOnHover: true })
          .addTo(created!)
          .bindPopup(popup, { className: 'office-popup', closeButton: true, autoPanPadding: [40, 40] })
          .on('click', () => onSelectRef.current(i));
        markers.current.set(i, marker);
      });

      const bounds = L.latLngBounds(pinned.map(({ o }) => o.position!));
      created.fitBounds(bounds, { padding: [70, 70], maxZoom: 13 });
      map.current = created;
      setReady(true);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          init();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(node);
    return () => {
      cancelled = true;
      io.disconnect();
      created?.remove();
      map.current = null;
      markers.current.clear();
    };
    // Offices come from static content; the map is built once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect the selected office on the map
  useEffect(() => {
    if (!ready || !map.current) return;
    markers.current.forEach((m, i) => m.getElement()?.classList.toggle('is-active', selection?.index === i));
    const marker = selection ? markers.current.get(selection.index) : undefined;
    if (!marker) return;
    // Pins open their own popup when clicked; a chosen card pans to its pin and opens it
    if (selection?.fly) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      map.current.flyTo(marker.getLatLng(), Math.max(map.current.getZoom(), 14), { animate: !reduce, duration: 1.2 });
      marker.openPopup();
    }
  }, [selection, ready]);

  const showAll = () => {
    if (!map.current || pinned.length === 0) return;
    map.current.closePopup();
    import('leaflet').then(({ default: L }) =>
      map.current?.flyToBounds(L.latLngBounds(pinned.map(({ o }) => o.position!)), { padding: [70, 70], maxZoom: 13, duration: 1 }),
    );
  };

  return (
    <div className="office-map relative h-full w-full overflow-hidden border border-gold/30 bg-ink">
      <div ref={el} className="absolute inset-0" role="region" aria-label="Map of office locations" />
      {!ready && (
        <div aria-hidden className="absolute inset-0 flex items-center justify-center text-[11px] uppercase tracking-[0.2em] text-muted">
          Loading map…
        </div>
      )}
      {ready && pinned.length > 1 && (
        <button
          type="button"
          onClick={showAll}
          className="absolute right-3 top-3 z-[500] border border-gold/50 bg-ink/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-light backdrop-blur transition-colors hover:border-gold hover:bg-ink"
        >
          Show all offices
        </button>
      )}
      <span aria-hidden className="pointer-events-none absolute inset-0 z-[400] shadow-[inset_0_0_60px_rgba(0,0,0,0.55)]" />
    </div>
  );
}
