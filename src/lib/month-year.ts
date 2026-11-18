export function monthYear(month?: number | null, year?: number | null): string {
  if (!month || !year || month < 1 || month > 12) return '';
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, 1)));
}
