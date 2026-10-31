# Gates: warm palette migration and motion

OWNS: styles/**, components/**, app/**, tailwind.config.ts, data/**, scripts/verify-palette.mjs

Scope: Replace the monochrome palette with the warm kumkuma / pasupu / skin scheme across
every page, add page-transition and section motion that works on laptop and mobile, and
keep every text pairing legible and every animation reduced-motion safe.

- [x] P1: The palette is warm, not greyscale, and every text pairing meets WCAG AA
  CHECK: node scripts/verify-palette.mjs tokens
  EXPECT: palette tokens verified
  EVIDENCE: automatic-evidence=v1; definition-sha256=e6ca34fe83418279d1d9a51dcc3c228fcbf599c4f8d646aa3fa045ec077f32c4; exit=0; EXPECT=matched; output-sha256=ca998f0776cef5ee82f523747c19b0b4187cc5cd3e060bfdbd2e6e4fa0b02813; output-bytes=24; shell=/bin/sh; cwd=/home/abito/companie; path=de8190d66eb8/17 entries

- [x] P2: No component still hardcodes the old monochrome hexes
  CHECK: node scripts/verify-palette.mjs nogrey
  EXPECT: no stray monochrome verified
  EVIDENCE: automatic-evidence=v1; definition-sha256=1e0aad0ce692110f4fc868dfcd7bce8eeb1ac69ef1712f2161be6758d49e3663; exit=0; EXPECT=matched; output-sha256=4e343912abf916db394e249fdbd576314946481d832dc3b4bb85d05b5c719f98; output-bytes=29; shell=/bin/sh; cwd=/home/abito/companie; path=de8190d66eb8/17 entries

- [x] P3: All five pages serve and carry the page-transition wrapper
  CHECK: node scripts/verify-palette.mjs pages
  EXPECT: pages and transitions verified
  EVIDENCE: automatic-evidence=v1; definition-sha256=fe4b4b57e6fa3107bd23227d1b0f9c2b4511b828b78b9fc91d7f88eabee29817; exit=0; EXPECT=matched; output-sha256=e12e18773406a6c1fae647b7e64e5c70b801c7c791366cf2065fb461df7d09bd; output-bytes=31; shell=/bin/sh; cwd=/home/abito/companie; path=de8190d66eb8/17 entries

- [x] P4: Motion still collapses under prefers-reduced-motion
  CHECK: node scripts/verify-palette.mjs reducedmotion
  EXPECT: reduced motion verified
  EVIDENCE: automatic-evidence=v1; definition-sha256=b9d777f605ba81ed33c7fc5cbdf8af7d159cace2aa3df73474a3b117a7da698e; exit=0; EXPECT=matched; output-sha256=09ba2eb9bf7d3fbb5250c5781478aa36eeae3073baccb4cf05b45ed7930cc3d5; output-bytes=24; shell=/bin/sh; cwd=/home/abito/companie; path=de8190d66eb8/17 entries

- [x] P5: The project typechecks and lints clean
  CHECK: npm run typecheck --silent && npm run lint --silent && echo PALETTE_STATIC_OK
  EXPECT: PALETTE_STATIC_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=70a809aaeeaf7b4115e7b1e5197f06eec72a9000ed7eb7fa968b29a5a9a943fa; exit=0; EXPECT=matched; output-sha256=a0d47b87429383d4a289096ddd516b5aa909db9a06c3d9aabaeedeb4fc8bf8c1; output-bytes=286; shell=/bin/sh; cwd=/home/abito/companie; path=de8190d66eb8/17 entries

- [x] P6: Every route still prerenders
  CHECK: node scripts/verify-build.mjs
  EXPECT: build routes verified
  EVIDENCE: automatic-evidence=v1; definition-sha256=9cdb8796ca96de986ae9320c7503369924f425474ecb92f1363c1dc3142e8e7c; exit=0; EXPECT=matched; output-sha256=a51b5f561811feae7f9a3295672fd9d2ec426050f0982030ce5de2569a751407; output-bytes=22; shell=/bin/sh; cwd=/home/abito/companie; path=de8190d66eb8/17 entries
