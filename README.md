# Resep Nurolanda

Animated hero prototype based on the owner's references. Food and headline placeholders are intentional. Menu and WhatsApp buttons explain their pending setup.

## Run

```sh
npm install
npm run dev
```

`npm run build` creates `dist/`. `npm test` runs browser checks using installed Google Chrome. Intro plays once per tab session; use "Putar ulang intro" to replay.

Local fonts: Lobster Two and DM Sans, licensed under SIL Open Font License; licenses live in `public/fonts/`. Intro uses connected Pacifico pen strokes from [Vara](https://github.com/akzhy/Vara/tree/master/fonts/Pacifico), also under SIL OFL, animated sequentially with [Vivus](https://github.com/maxwellito/vivus). The subset and attribution live in `scripts/handwriting-font.json`. Regenerate the inline SVG with `node scripts/lettering.mjs` (uses installed Chrome).

Resep finishes before Nurolanda starts. Writing takes 2.8 seconds; glow then leads into the upward curtain reveal. Food placeholders enter quickly, overshoot slightly, dip, then settle. Skip and reduced motion cancel pending handwriting and transitions.
