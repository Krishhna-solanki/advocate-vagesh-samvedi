// Madhya Pradesh government holidays used to block appointment dates.
//
// HOW TO MAINTAIN
// - `general`: holidays when no appointments are offered. Every entry here blocks booking on that date.
// - `optional`: restricted/optional holidays. They do NOT block booking unless you move them into `general`.
// - `verified: true` only once the date has been checked against the official notification of the General
//   Administration Department (GAD), Government of Madhya Pradesh (gad.mp.gov.in / the MP Gazette).
// - Add each new year's list when the GAD notifies it (usually in December). Dates are YYYY-MM-DD (IST).
//
// STATUS (7 November 2026): the 2026 list below was compiled from two published holiday calendars
// (greythr.com and govtcalendar.org, both stating the GAD as their source; they agree on all 30 dates) and a news
// report of the additional Holi holiday on 4 March. Apart from the three national days, these dates have NOT been
// checked against the gazette notification itself, and moon-dependent dates (Id, Muharram, Milad-un-Nabi) can
// shift. Treat the list as unverified and possibly incomplete until it is checked. For 2027 only the fixed
// national holidays are included so far.

export type Holiday = { date: string; name: string; verified: boolean };

export const holidays: { general: Holiday[]; optional: Holiday[] } = {
  general: [
    // 2026
    { date: '2026-01-26', name: 'Republic Day', verified: true },
    { date: '2026-03-03', name: 'Holi', verified: false },
    { date: '2026-03-04', name: 'Holi (additional holiday)', verified: false },
    { date: '2026-03-19', name: 'Gudi Padwa', verified: false },
    { date: '2026-03-20', name: 'Cheti Chand', verified: false },
    { date: '2026-03-21', name: 'Id-ul-Fitr', verified: false },
    { date: '2026-03-27', name: 'Ram Navami', verified: false },
    { date: '2026-03-31', name: 'Mahavir Jayanti', verified: false },
    { date: '2026-04-03', name: 'Good Friday', verified: false },
    { date: '2026-04-14', name: 'Dr. Ambedkar Jayanti', verified: false },
    { date: '2026-04-20', name: 'Parshuram Jayanti', verified: false },
    { date: '2026-05-01', name: 'Buddha Purnima', verified: false },
    { date: '2026-05-27', name: 'Id-ul-Zuha (Bakrid)', verified: false },
    { date: '2026-06-17', name: 'Maharana Pratap Jayanti / Chhatrasal Jayanti', verified: false },
    { date: '2026-06-26', name: 'Muharram', verified: false },
    { date: '2026-06-29', name: 'Sant Kabir Jayanti', verified: false },
    { date: '2026-08-15', name: 'Independence Day', verified: true },
    { date: '2026-08-26', name: 'Milad-un-Nabi', verified: false },
    { date: '2026-08-28', name: 'Raksha Bandhan', verified: false },
    { date: '2026-09-04', name: 'Janmashtami', verified: false },
    { date: '2026-09-14', name: 'Ganesh Chaturthi', verified: false },
    { date: '2026-10-02', name: 'Gandhi Jayanti', verified: true },
    { date: '2026-10-11', name: 'Maharaja Agrasen Jayanti', verified: false },
    { date: '2026-10-20', name: 'Dussehra (Vijaya Dashami)', verified: false },
    { date: '2026-10-26', name: 'Maharishi Valmiki Jayanti', verified: false },
    { date: '2026-10-29', name: 'Karwa Chauth', verified: false },
    { date: '2026-11-09', name: 'Govardhan Puja / Vishwakarma Day', verified: false },
    { date: '2026-11-11', name: 'Bhai Dooj', verified: false },
    { date: '2026-11-15', name: 'Chhath Puja', verified: false },
    { date: '2026-11-24', name: 'Guru Nanak Jayanti', verified: false },
    { date: '2026-12-25', name: 'Christmas', verified: false },
    // 2027 — fixed national holidays only; add the rest when the GAD notifies the 2027 list
    { date: '2027-01-26', name: 'Republic Day', verified: true },
    { date: '2027-08-15', name: 'Independence Day', verified: true },
    { date: '2027-10-02', name: 'Gandhi Jayanti', verified: true },
  ],
  // The GAD also notifies optional holidays (employees choose a few). None are listed here yet, and they never
  // block booking unless moved into `general`.
  optional: [],
};

const byDate = new Map(holidays.general.map((h) => [h.date, h]));

/** The general holiday on this date (YYYY-MM-DD, IST), if any */
export const holidayOn = (date: string): Holiday | undefined => byDate.get(date);
