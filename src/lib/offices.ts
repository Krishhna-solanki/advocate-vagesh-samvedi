import data from '../../content/offices.json';

// Office locations, managed in the CMS under Settings → Office Locations (add, remove or reorder freely;
// up to four are shown). Entries marked `placeholder` show a "Coming soon" card with no pin or links.
export type Office = {
  title: string;
  name?: string;
  address: string;
  city?: string;
  lat?: number;
  lng?: number;
  mapUrl?: string;
  phone?: string;
  placeholder?: boolean;
};

export type OfficeView = Office & {
  /** Pin position, only when valid coordinates are given */
  position?: [number, number];
  /** Opens Google Maps directions from the visitor's own location */
  directionsHref?: string;
  /** Opens the location in Google Maps */
  viewHref?: string;
};

const MAX_OFFICES = 4;

const validCoord = (lat?: number, lng?: number) =>
  typeof lat === 'number' && typeof lng === 'number' && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && !(lat === 0 && lng === 0);

// Google Maps "dir" links copied from a phone start at the copier's location ("/dir/LAT,LNG/destination").
// Removing that starting point makes the link start from each visitor's own location instead.
function directionsFrom(o: Office, position?: [number, number]) {
  const pasted = o.mapUrl?.trim();
  if (pasted && /^https:\/\//i.test(pasted)) {
    return pasted.replace(/(\/maps\/dir\/)-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?\//, '$1/');
  }
  if (position) return `https://www.google.com/maps/dir/?api=1&destination=${position.join(',')}`;
  const query = [o.name, o.address, o.city].filter(Boolean).join(', ');
  return o.address?.trim() ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}` : undefined;
}

function view(o: Office): OfficeView {
  if (o.placeholder) return { ...o };
  const position = validCoord(o.lat, o.lng) ? ([o.lat!, o.lng!] as [number, number]) : undefined;
  const query = position ? position.join(',') : encodeURIComponent([o.name, o.address, o.city].filter(Boolean).join(', '));
  return {
    ...o,
    position,
    directionsHref: directionsFrom(o, position),
    viewHref: o.address?.trim() || position ? `https://www.google.com/maps/search/?api=1&query=${query}` : undefined,
  };
}

export const offices: OfficeView[] = (data.offices as Office[])
  .filter((o) => (o.title ?? o.name)?.trim())
  .map((o) => ({ ...o, title: o.title || o.name || '' }))
  .slice(0, MAX_OFFICES)
  .map(view);
