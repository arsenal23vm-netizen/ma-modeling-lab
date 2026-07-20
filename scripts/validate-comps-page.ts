import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { candidatePeers, peerSelectionFaqs } from "../src/data/comps-selection";

const pagePath = join(process.cwd(), "src/app/comps-peer-selection/page.tsx");
const page = readFileSync(pagePath, "utf8");
const sitemap = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf8");
const caseStudy = page.slice(page.indexOf('id="case-study"'), page.indexOf('id="excel-workflow"'));

const expectedMetadata = [
  'title: "Compsの選定方法｜類似上場会社を選ぶ実務フレームワーク"',
  '"Comps候補の探し方、事業モデル・規模・成長率・利益率による比較、Core Peerと除外企業の整理、Excel選定マトリクスまで解説します。"',
];

for (const expected of expectedMetadata) assert.ok(page.includes(expected), `metadata must include: ${expected}`);
assert.ok(page.includes("30〜45分"), "hero must state a 30〜45分 duration");
assert.equal((page.match(/\/downloads\/Comps_Selection_Worksheet\.xlsx/g) ?? []).length, 2, "worksheet CTA must appear at article top and end");
assert.equal(peerSelectionFaqs.length, 5, "FAQ data must contain exactly five questions");

for (const expected of ["セクター漏れ", "規模不一致", "成長率・利益率の不一致", "会計基準不一致", "データ取得都合", "中央値の盲目的採用"]) {
  assert.ok(page.includes(expected), `common failures must include: ${expected}`);
}

for (const expected of ["悪い例", "良い採用例", "良い除外例"]) {
  assert.ok(page.includes(expected), `review memo must include: ${expected}`);
}

assert.ok(caseStudy.includes("targetProfile"), "case study must show the target profile");
assert.ok(caseStudy.includes("candidatePeers.map"), "case study must render all candidates from candidatePeers");
assert.equal(candidatePeers.length, 12, "case-study source must contain 12 fictional candidates");
assert.ok(page.includes("<caption className=\"sr-only\">{caption}</caption>"), "generic tables must expose captions");
assert.ok(page.includes("<th scope=\"col\""), "generic table headers must use column scope");
assert.ok(page.includes('caption="12の選定基準"'), "criteria table must have a useful accessible caption");
assert.ok(sitemap.includes('item.path === "/comps-peer-selection" ? new Date("2026-07-20T00:00:00+09:00")'), "new Comps route must use its 2026-07-20 lastModified date");

console.log("Comps page validation passed: metadata / CTAs / 5 FAQs / failures / review memo / 12 candidates");
