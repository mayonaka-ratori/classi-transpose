import { describe, it, expect } from 'vitest';
import { scaleTempoEvents, getOriginalBpm } from './tempo';
import type { TempoEvent } from '../../types/midi';

const makeTempo = (bpm: number): TempoEvent => ({
  time: 0,
  tick: 0,
  microsecondsPerBeat: Math.round(60_000_000 / bpm),
  bpm,
});

describe('scaleTempoEvents', () => {
  it('doubles BPM when ratio is 2.0', () => {
    const events = [makeTempo(120)];
    const result = scaleTempoEvents(events, 2.0);
    expect(result[0].bpm).toBe(240);
  });

  it('halves BPM when ratio is 0.5', () => {
    const events = [makeTempo(120)];
    const result = scaleTempoEvents(events, 0.5);
    expect(result[0].bpm).toBe(60);
  });

  it('scales microseconds inversely', () => {
    const events = [makeTempo(120)];
    const result = scaleTempoEvents(events, 2.0);
    expect(result[0].microsecondsPerBeat).toBe(250000); // 500000 / 2
  });

  it('throws on non-positive ratio', () => {
    expect(() => scaleTempoEvents([makeTempo(120)], 0)).toThrow();
    expect(() => scaleTempoEvents([makeTempo(120)], -1)).toThrow();
  });

  it('does not mutate original events', () => {
    const events = [makeTempo(120)];
    scaleTempoEvents(events, 2.0);
    expect(events[0].bpm).toBe(120);
  });
});

describe('getOriginalBpm', () => {
  it('returns BPM of first event', () => {
    expect(getOriginalBpm([makeTempo(96)])).toBe(96);
  });

  it('returns 120 when no events exist', () => {
    expect(getOriginalBpm([])).toBe(120);
  });
});
