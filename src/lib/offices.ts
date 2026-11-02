import data from '../../content/offices.json';

// Office locations, managed in the CMS under Settings → Office Locations (add, remove or reorder freely).
// Entries marked `placeholder` are shown with a "Placeholder" badge and no map link until real details are entered.
export type Office = {
  name: string;
  address: string;
  city?: string;
  mapUrl?: string;
  phone?: string;
  placeholder?: boolean;
};

export type OfficeView = Office & { mapHref?: string };

// A pasted Google Maps link wins; otherwise Maps searches for the confirmed address.
// Only https links are accepted, so a typo in the CMS cannot produce an unsafe link.
function mapHref(o: Office): string | undefined {
  if (o.placeholder) return undefined;
  const pasted = o.mapUrl?.trim();
  if (pasted && /^https:\/\//i.test(pasted)) return pasted;
  const query = [o.name, o.address, o.city].filter(Boolean).join(', ');
  return o.address?.trim() ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : undefined;
}

export const offices: OfficeView[] = (data.offices as Office[])
  .filter((o) => o.name?.trim())
  .map((o) => ({ ...o, mapHref: mapHref(o) }));
