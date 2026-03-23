import type { TempoEvent } from '../../types/midi';

/**
 * Scale all tempo events by the given ratio.
 * ratio = 1.0 means no change; 0.5 = half speed; 2.0 = double speed.
 */
export function scaleTempoEvents(
  events: readonly TempoEvent[],
  ratio: number,
): TempoEvent[] {
  if (ratio <= 0) {
    throw new Error(`Tempo ratio must be positive, got ${ratio}`);
  }
  return events.map((e) => ({
    ...e,
    microsecondsPerBeat: Math.round(e.microsecondsPerBeat / ratio),
    bpm: e.bpm * ratio,
  }));
}

/**
 * Extract BPM from the first tempo event.
 * Returns 120 (MIDI default) if no tempo events exist.
 */
export function getOriginalBpm(events: readonly TempoEvent[]): number {
  if (events.length === 0) return 120;
  return events[0].bpm;
}
