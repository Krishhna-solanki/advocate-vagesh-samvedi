import { offices } from '@/lib/offices';
import SectionHeading from './SectionHeading';
import OfficeExplorer from './OfficeExplorer';

// Office locations: an interactive map with a pin per office, beside cards with Google Maps directions.
export default function OfficeLocations() {
  if (offices.length === 0) return null;

  return (
    <section aria-labelledby="offices-heading" className="border-t border-line py-24 md:py-32">
      <div className="container">
        <SectionHeading
          id="offices-heading"
          align="split"
          label="Offices"
          title="Office Locations"
          intro="Select an office to see it on the map, or choose “Get Directions” to open the route in Google Maps."
        />
        <div className="mt-14">
          <OfficeExplorer offices={offices} />
        </div>
      </div>
    </section>
  );
}
