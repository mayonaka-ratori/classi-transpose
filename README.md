# ClassiTranspose

A browser-based web app for playing, transposing, and adjusting the tempo of classical MIDI files — then exporting the result as a standard MIDI file.

## Features
- Real-time transposition (±12 semitones, key name display)
- Real-time BPM adjustment (25%–400%)
- Track mute / solo
- A-B loop playback
- MIDI export with all modifications applied
- Light / high-quality SoundFont switching
- Mobile-first responsive design

## Development
```bash
npm install
npm run dev
```

## Tech Stack
React 19 · TypeScript · Vite 6 · Zustand · Tailwind CSS · Radix UI · spessasynth_lib

## License
MIT

## MIDI File Credits

Bundled MIDI files are sourced from **[piano-midi.de](http://www.piano-midi.de)** by Bernd Krueger,
licensed under [CC BY-SA 3.0 DE](http://creativecommons.org/licenses/by-sa/3.0/de/deed.en).

See [`public/presets/CREDITS.md`](public/presets/CREDITS.md) for the full list of files and their licenses.
