// scripts/build-tokens.js
//
// Generates src/shared/theme/tokens.css from tokens.ts, so CSS variables
// and Tailwind config can never drift out of sync — there is exactly one
// place (tokens.ts) a human edits.
//
// Run automatically via `npm run dev` / `npm run build` (see package.json).

const fs = require("fs");
const path = require("path");

// Lightweight require of the .ts file's plain-object exports.
const tokensPath = path.join(__dirname, "../src/shared/theme/tokens.ts");
const source = fs.readFileSync(tokensPath, "utf-8");

function extractObject(name) {
  const match = source.match(new RegExp(`export const ${name} = ({[\\s\\S]*?}) as const;`));
  if (!match) throw new Error(`Could not find ${name} in tokens.ts`);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return ${match[1]};`)();
}

const colors = extractObject("colors");
const radius = extractObject("radius");
const spacing = extractObject("spacing");

let css = `/* AUTO-GENERATED from src/shared/theme/tokens.ts — do not edit directly.\n   Run \`npm run build:tokens\` after changing tokens.ts. */\n\n:root {\n`;

for (const [key, value] of Object.entries(colors)) {
  css += `  --color-${key}: ${value};\n`;
}
for (const [key, value] of Object.entries(radius)) {
  css += `  --radius-${key}: ${value};\n`;
}
for (const [key, value] of Object.entries(spacing)) {
  css += `  --space-${key}: ${value};\n`;
}
css += `}\n`;

const outPath = path.join(__dirname, "../src/shared/theme/tokens.css");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, css);
console.log(`✓ Generated ${outPath}`);
