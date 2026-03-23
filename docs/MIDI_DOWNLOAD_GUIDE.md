# MIDI Download Guide

All MIDI files must be placed in `public/presets/` before they appear in the library.
Every piece in `src/data/midi-catalog.ts` has a `sourceUrl` field — use it to download the file,
then rename it to match the `filename` field in the same entry.

## Quick Start

```bash
# macOS / Linux
cd public/presets

# Windows (PowerShell)
cd public\presets
```

Download each file listed below with your browser or with curl / wget, then
rename it to the filename shown in the second column.

---

## Baroque

### J.S. Bach (BWV)

| filename | sourceUrl |
|---|---|
| `bach-invention-01.mid` | http://www.piano-midi.de/midis/bach/bach_invention_01.mid |
| `bach-invention-04.mid` | http://www.piano-midi.de/midis/bach/bach_invention_04.mid |
| `bach-invention-08.mid` | http://www.piano-midi.de/midis/bach/bach_invention_08.mid |
| `bach-invention-13.mid` | http://www.piano-midi.de/midis/bach/bach_invention_13.mid |
| `bach-wtc1-prelude-c.mid` | http://www.piano-midi.de/midis/bach/bach_846.mid |
| `bach-wtc1-fugue-cm.mid` | http://www.piano-midi.de/midis/bach/bach_847.mid |
| `bach-toccata-dm.mid` | https://www.midiworld.com/download/3869 |
| `bach-air-g-string.mid` | http://www.piano-midi.de/midis/bach/bach_air.mid |
| `bach-jesu-joy.mid` | https://www.mfiles.co.uk/midi/Jesu-Joy-of-Mans-Desiring.mid |
| `bach-minuet-g.mid` | https://www.mfiles.co.uk/midi/minuet-in-g-major.mid |

### G.F. Handel

| filename | sourceUrl |
|---|---|
| `handel-hallelujah.mid` | https://www.midiworld.com/download/3886 |
| `handel-sarabande-dm.mid` | https://www.mfiles.co.uk/midi/Sarabande.mid |
| `handel-water-music.mid` | https://www.midiworld.com/download/4006 |

### A. Vivaldi

| filename | sourceUrl |
|---|---|
| `vivaldi-spring.mid` | https://www.midiworld.com/download/4048 |
| `vivaldi-summer.mid` | https://www.midiworld.com/download/4050 |
| `vivaldi-winter.mid` | https://www.midiworld.com/download/4052 |

### J. Pachelbel

| filename | sourceUrl |
|---|---|
| `pachelbel-canon.mid` | https://www.midiworld.com/download/4035 |

---

## Classical Period

### W.A. Mozart

| filename | sourceUrl |
|---|---|
| `mozart-eine-kleine-k525-1.mid` | http://www.piano-midi.de/midis/mozart/moz_k525_1.mid |
| `mozart-sonata-k331-1.mid` | http://www.piano-midi.de/midis/mozart/moz_331_1.mid |
| `mozart-sonata-k545-1.mid` | http://www.piano-midi.de/midis/mozart/moz_545_1.mid |
| `mozart-rondo-alla-turca.mid` | http://www.piano-midi.de/midis/mozart/moz_331_3.mid |
| `mozart-requiem-lacrimosa.mid` | https://www.midiworld.com/download/3895 |

### L.v. Beethoven

| filename | sourceUrl |
|---|---|
| `beethoven-fur-elise.mid` | http://www.piano-midi.de/midis/beethoven/beethoven_fuer_elise.mid |
| `beethoven-moonlight-1.mid` | http://www.piano-midi.de/midis/beethoven/mond_1.mid |
| `beethoven-sonata-op13-2.mid` | http://www.piano-midi.de/midis/beethoven/pathetique_2.mid |
| `beethoven-ode-to-joy.mid` | https://www.midiworld.com/download/3861 |
| `beethoven-bagatelle-op119-1.mid` | https://www.mfiles.co.uk/midi/Bagatelle-op119-no1.mid |

---

## Romantic Period

### F. Chopin

| filename | sourceUrl |
|---|---|
| `chopin-nocturne-op9-2.mid` | http://www.piano-midi.de/midis/chopin/chp_op9_2.mid |
| `chopin-nocturne-op48-1.mid` | http://www.piano-midi.de/midis/chopin/chp_op48_1.mid |
| `chopin-etude-op10-3.mid` | http://www.piano-midi.de/midis/chopin/chp_op10_3.mid |
| `chopin-waltz-op64-2.mid` | http://www.piano-midi.de/midis/chopin/chp_op64_2.mid |
| `chopin-prelude-op28-4.mid` | http://www.piano-midi.de/midis/chopin/chp_op28_4.mid |
| `chopin-fantaisie-impromptu.mid` | http://www.piano-midi.de/midis/chopin/chp_op66.mid |

### F. Schubert

| filename | sourceUrl |
|---|---|
| `schubert-serenade.mid` | https://www.midiworld.com/download/4038 |
| `schubert-ave-maria.mid` | https://www.midiworld.com/download/3856 |
| `schubert-moment-musical-3.mid` | http://www.piano-midi.de/midis/schubert/sch_mmt3.mid |
| `schubert-impromtu-op90-2.mid` | http://www.piano-midi.de/midis/schubert/sch_op90_2.mid |

### R. Schumann

| filename | sourceUrl |
|---|---|
| `schumann-traumerei.mid` | http://www.piano-midi.de/midis/schumann/sch_traum.mid |
| `schumann-about-foreign-lands.mid` | http://www.piano-midi.de/midis/schumann/sch_kl1.mid |

### F. Liszt

| filename | sourceUrl |
|---|---|
| `liszt-liebestraum-3.mid` | http://www.piano-midi.de/midis/liszt/lieb_3.mid |
| `liszt-hungarian-rhapsody-2.mid` | http://www.piano-midi.de/midis/liszt/liszt_hungarian_rhapsody_no2.mid |
| `liszt-consolation-3.mid` | http://www.piano-midi.de/midis/liszt/liszt_consolation_3.mid |

### P.I. Tchaikovsky

| filename | sourceUrl |
|---|---|
| `tchaikovsky-swan-lake-theme.mid` | https://www.midiworld.com/download/4045 |
| `tchaikovsky-sleeping-beauty-waltz.mid` | https://www.midiworld.com/download/4043 |
| `tchaikovsky-piano-concerto-1.mid` | https://www.midiworld.com/download/4042 |
| `tchaikovsky-june-barcarolle.mid` | http://www.piano-midi.de/midis/tschaikowsky/tsch_op37_06.mid |

### J. Brahms

| filename | sourceUrl |
|---|---|
| `brahms-waltz-op39-15.mid` | http://www.piano-midi.de/midis/brahms/brahms_walzer_op39_15.mid |
| `brahms-intermezzo-op118-2.mid` | http://www.piano-midi.de/midis/brahms/brahms_op118_2.mid |
| `brahms-lullaby.mid` | https://www.mfiles.co.uk/midi/Brahms-Lullaby.mid |

### E. Grieg

| filename | sourceUrl |
|---|---|
| `grieg-in-the-hall-mountain-king.mid` | https://www.midiworld.com/download/3890 |
| `grieg-morning-mood.mid` | https://www.midiworld.com/download/3889 |
| `grieg-piano-concerto-a-minor.mid` | https://www.midiworld.com/download/3891 |
| `grieg-solveigs-song.mid` | https://www.mfiles.co.uk/midi/Solveigs-Song.mid |

### A. Dvořák

| filename | sourceUrl |
|---|---|
| `dvorak-humoresque-op101-7.mid` | https://www.midiworld.com/download/3877 |
| `dvorak-new-world-2.mid` | https://www.midiworld.com/download/3876 |

### E. Satie

| filename | sourceUrl |
|---|---|
| `satie-gymnopedie-1.mid` | http://www.piano-midi.de/midis/satie/gno1.mid |
| `satie-gymnopedie-2.mid` | http://www.piano-midi.de/midis/satie/gno2.mid |
| `satie-gymnopedie-3.mid` | http://www.piano-midi.de/midis/satie/gno3.mid |
| `satie-gnossienne-1.mid` | http://www.piano-midi.de/midis/satie/gno1.mid |

### N. Rimsky-Korsakov

| filename | sourceUrl |
|---|---|
| `rimsky-flight-of-bumblebee.mid` | https://www.midiworld.com/download/4037 |
| `rimsky-scheherazade.mid` | https://www.midiworld.com/download/4036 |

### S. Rachmaninoff

| filename | sourceUrl |
|---|---|
| `rachmaninoff-vocalise.mid` | https://www.midiworld.com/download/4034 |
| `rachmaninoff-prelude-op3-2.mid` | http://www.piano-midi.de/midis/rachmaninoff/rac_op3_2.mid |
| `rachmaninoff-piano-concerto-2.mid` | https://www.midiworld.com/download/4033 |

---

## Impressionist

### C. Debussy

| filename | sourceUrl |
|---|---|
| `debussy-clair-de-lune.mid` | http://www.piano-midi.de/midis/debussy/deb_clai.mid |
| `debussy-arabesque-1.mid` | http://www.piano-midi.de/midis/debussy/deb_arab1.mid |
| `debussy-reverie.mid` | http://www.piano-midi.de/midis/debussy/deb_reve.mid |
| `debussy-golliwogs-cakewalk.mid` | http://www.piano-midi.de/midis/debussy/deb_golliwogg.mid |

### M. Ravel

| filename | sourceUrl |
|---|---|
| `ravel-bolero.mid` | https://www.midiworld.com/download/4015 |
| `ravel-pavane.mid` | https://www.mfiles.co.uk/midi/Pavane-pour-une-infante-defunte.mid |

---

## Japanese Folk / 日本の民謡・童謡

| filename | note |
|---|---|
| `sakura-sakura.mid` | Search "sakura sakura piano midi" — many free MIDI sites |
| `furusato.mid` | Search "ふるさと piano midi" |
| `kojo-no-tsuki.mid` | Search "荒城の月 piano midi" |
| `hana.mid` | Search "花（瀧廉太郎）piano midi" |
| `akatonbo.mid` | Search "赤とんぼ piano midi" |

---

## World Folk / 世界の民謡

| filename | note |
|---|---|
| `amazing-grace.mid` | https://www.mfiles.co.uk/midi/Amazing-Grace.mid |
| `greensleeves.mid` | https://www.mfiles.co.uk/midi/Greensleeves.mid |
| `danny-boy.mid` | https://www.mfiles.co.uk/midi/Danny-Boy-Londonderry-Air.mid |
| `ave-maria-bach-gounod.mid` | https://www.midiworld.com/download/3857 |

---

## Ragtime

### S. Joplin

| filename | sourceUrl |
|---|---|
| `joplin-maple-leaf-rag.mid` | https://www.midiworld.com/download/3896 |
| `joplin-entertainer.mid` | https://www.midiworld.com/download/3897 |
| `joplin-elite-syncopations.mid` | https://www.midiworld.com/download/3898 |

---

## Notes

- **License**: All pieces listed are in the public domain worldwide (composers deceased > 70 years).
- **MIDI files themselves** may have their own licenses from the arrangers. The sources listed (piano-midi.de, midiworld.com, mfiles.co.uk) generally allow free personal use; check each site's terms.
- If a URL returns a 404, search the filename or piece title on [Musescore](https://musescore.com/sheetmusic?instrument=1&license=to_share) or [IMSLP](https://imslp.org) for alternative MIDI downloads.
- After placing files in `public/presets/`, restart the Vite dev server (`npm run dev`).
