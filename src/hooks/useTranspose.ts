import { useCallback, useMemo } from 'react';
import { useMidiStore } from '../stores/useMidiStore';
import { semitoneToKey, keyToSemitone, getAllKeySignatures } from '../engine/midi/music-theory';
import { MAX_TRANSPOSE_SEMITONES, MIN_TRANSPOSE_SEMITONES } from '../utils/constants';
import type { KeyName, KeySignatureDisplay } from '../types/music';

type UseTransposeReturn = {
  semitones: number;
  currentKey: KeySignatureDisplay | null;
  allKeys: KeySignatureDisplay[];
  increment: () => void;
  decrement: () => void;
  setByKey: (keyName: KeyName) => void;
  setSemitones: (n: number) => void;
};

export function useTranspose(): UseTransposeReturn {
  const transposeSemitones = useMidiStore((s) => s.transposeSemitones);
  const originalKeySignature = useMidiStore((s) => s.originalKeySignature);
  const setTransposeSemitones = useMidiStore((s) => s.setTransposeSemitones);

  const mode = originalKeySignature?.mode ?? 'major';

  const currentKey = useMemo((): KeySignatureDisplay | null => {
    if (!originalKeySignature) return null;
    const origSemitone = keyToSemitone(originalKeySignature.key as KeyName) ?? 0;
    return semitoneToKey(origSemitone + transposeSemitones, originalKeySignature.mode);
  }, [originalKeySignature, transposeSemitones]);

  const allKeys = useMemo((): KeySignatureDisplay[] => {
    return getAllKeySignatures(mode);
  }, [mode]);

  const increment = useCallback((): void => {
    setTransposeSemitones(transposeSemitones + 1);
  }, [setTransposeSemitones, transposeSemitones]);

  const decrement = useCallback((): void => {
    setTransposeSemitones(transposeSemitones - 1);
  }, [setTransposeSemitones, transposeSemitones]);

  const setByKey = useCallback((keyName: KeyName): void => {
    if (!originalKeySignature) return;
    const origSemitone = keyToSemitone(originalKeySignature.key as KeyName) ?? 0;
    const targetSemitone = keyToSemitone(keyName) ?? 0;
    let diff = targetSemitone - origSemitone;
    // Clamp to valid transpose range
    diff = Math.max(MIN_TRANSPOSE_SEMITONES, Math.min(MAX_TRANSPOSE_SEMITONES, diff));
    setTransposeSemitones(diff);
  }, [originalKeySignature, setTransposeSemitones]);

  return {
    semitones: transposeSemitones,
    currentKey,
    allKeys,
    increment,
    decrement,
    setByKey,
    setSemitones: setTransposeSemitones,
  };
}
