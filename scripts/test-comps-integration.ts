import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const checks = [
  ["src/data/lab.ts", 'file: "Comps_Selection_Worksheet.xlsx"', "download entry"],
  ["src/data/lab.ts", 'size: "約21KB"', "measured download size"],
  ["src/data/site.ts", 'href: "/comps-peer-selection", label: "Comps選定"', "navigation entry"],
  ["src/app/sitemap.ts", '{ path: "/comps-peer-selection", priority: 0.9, changeFrequency: "monthly" as const }', "sitemap entry"],
  ["README.md", '`/comps-peer-selection`', "README page entry"],
  ["README.md", "npm run generate:comps-workbook", "README workbook generation command"],
  ["README.md", "npm run test:comps-workbook", "README workbook test command"],
] as const;

for (const [file, expected, label] of checks) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (!source.includes(expected)) {
    throw new Error(`Missing ${label} in ${file}: ${expected}`);
  }
}

console.log("Comps peer-selection integration checks passed.");
