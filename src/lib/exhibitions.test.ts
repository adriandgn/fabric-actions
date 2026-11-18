import { describe, expect, it } from 'vitest';
import { exhibitionStatus } from './exhibitions';

describe('exhibition dates', () => {
  it('classifies future, inclusive current, open ended and past dates', () => {
    const today = '2026-11-18';
    expect(exhibitionStatus(null, null, today)).toBeNull();
    expect(exhibitionStatus('2026-11-19', null, today)).toBe('next');
    expect(exhibitionStatus('2026-11-18', null, today)).toBe('current');
    expect(exhibitionStatus('2026-11-01', '2026-11-18', today)).toBe('current');
    expect(exhibitionStatus('2026-11-01', '2026-11-17', today)).toBe('latest');
  });
});
