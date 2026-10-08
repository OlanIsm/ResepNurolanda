# Resep Nurolanda

Animated hero prototype based on the owner's references. Food and headline placeholders are intentional. Menu and WhatsApp buttons explain their pending setup.

## Run

```sh
npm install
npm run dev
```

`npm run build` creates `dist/`. `npm test` runs browser checks using installed Google Chrome. Intro plays once per tab session; use "Putar ulang intro" to replay.

Local fonts: Lobster Two and DM Sans, licensed under SIL Open Font License; licenses live in `public/fonts/`. Intro lettering is inline SVG generated from Lobster Two. To regenerate, install Python fonttools and run `python scripts/lettering.py`.
