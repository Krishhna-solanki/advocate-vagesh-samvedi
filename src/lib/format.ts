export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(
    new Date(iso),
  );

/** Day, short month and year, for the date blocks in the News timeline. */
export const dateParts = (iso: string) => {
  const d = new Date(iso);
  const part = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-IN', { ...opts, timeZone: 'Asia/Kolkata' }).format(d);
  return { day: part({ day: '2-digit' }), month: part({ month: 'short' }), year: part({ year: 'numeric' }) };
};
