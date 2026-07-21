import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const routes = ["financial-modeling", "valuation", "ma-modeling", "excel-templates"] as const;
const expectedNavigation = [
  '{ href: "/", label: "Home" }',
  '{ href: "/financial-modeling", label: "財務モデリング" }',
  '{ href: "/valuation", label: "Valuation" }',
  '{ href: "/ma-modeling", label: "M&Aモデル" }',
  '{ href: "/excel-templates", label: "Excel教材" }',
];

const home = readFileSync("src/app/page.tsx", "utf8");
const siteData = readFileSync("src/data/site.ts", "utf8");
const headings = new Set<string>();

for (const route of routes) {
  const page = readFileSync(`src/app/${route}/page.tsx`, "utf8");
  const h1 = page.match(/title=\"([^\"]+)\"/);

  assert.match(page, /<TopicHub/);
  assert.match(page, /description:/);
  assert.ok(h1, `${route} needs a TopicHub title`);
  assert.ok(!headings.has(h1[1]), `${route} must have a unique H1`);
  headings.add(h1[1]);
  assert.ok(home.includes(`/${route}`), `Home must link to /${route}`);
}

for (const item of expectedNavigation) {
  assert.ok(siteData.includes(item), `Primary navigation is missing ${item}`);
}
assert.equal((siteData.match(/href: \"\//g) ?? []).length, expectedNavigation.length, "Primary navigation must only include the five planned links");
assert.ok(home.includes("学習テーマから探す"));
assert.ok(!home.includes("/valuation/ppa"));
assert.ok(!home.includes("/ma-modeling/lbo"));

console.log("Growth hub validation passed");
