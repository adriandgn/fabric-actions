export function exhibitionStatus(start: string | null, end: string | null | undefined, today: string): 'next' | 'current' | 'latest' | null {
  if (!start) return null;
  if (start.slice(0, 10) > today) return 'next';
  if (end && end.slice(0, 10) < today) return 'latest';
  return 'current';
}
