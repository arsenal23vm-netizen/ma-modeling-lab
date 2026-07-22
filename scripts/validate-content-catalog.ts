import assert from "node:assert/strict";
import { contentCatalog, getRelatedContent, type ContentEntry } from "../src/data/content-catalog";
import { normalizeSearchText, scoreContent, searchContent } from "../src/lib/content-search";

const expectedHrefs = [
  "/financial-modeling", "/valuation", "/ma-modeling", "/excel-templates",
  "/model-design", "/assumptions", "/revenue-kpi", "/pl-model", "/bs-model", "/cf-model", "/excel-functions", "/roadmap", "/three-statements",
  "/private-company-valuation", "/comps-peer-selection",
  "/valuation/dcf", "/valuation/dcf/fcff", "/valuation/dcf/wacc", "/valuation/dcf/terminal-value", "/valuation/dcf/sensitivity-analysis", "/valuation/dcf/enterprise-to-equity",
  "/downloads", "/downloads/01_仕訳演習.xlsx", "/downloads/02_前提条件入力.xlsx", "/downloads/03_PLモデル練習.xlsx", "/downloads/04_BS_CF統合練習.xlsx", "/downloads/05_完成3表モデル.xlsx", "/downloads/06_DCF評価モデル.xlsx", "/downloads/07_モデル品質チェックリスト.xlsx", "/downloads/Comps_Selection_Worksheet.xlsx", "/downloads/dcf-valuation-model",
  "/tools", "/journal-lab", "/learning-roadmap", "/quality-standard", "/books", "/editorial-policy",
];
assert.deepEqual(new Set(contentCatalog.map((item) => item.href)), new Set(expectedHrefs));
assert.equal(new Set(contentCatalog.map((item) => item.href)).size, contentCatalog.length);

assert.equal(normalizeSearchText(" ＷＡＣＣ\u3000評価 "), "wacc評価");
assert.equal(normalizeSearchText("\u00a0Ｆｕｌｌ\tWidth\n"), "fullwidth");

const fixture = (overrides: Partial<ContentEntry>): ContentEntry => ({
  href: "/fixture",
  title: "other title",
  summary: "other summary",
  type: "article",
  topic: "valuation",
  level: "test",
  readingTime: "test",
  keywords: ["other keyword"],
  featured: false,
  ...overrides,
});
const needle = normalizeSearchText("Needle");
assert.equal(scoreContent(fixture({ title: "Needle", keywords: ["Needle"], summary: "Needle" }), needle), 100);
assert.equal(scoreContent(fixture({ title: "Needle title" }), needle), 50);
assert.equal(scoreContent(fixture({ keywords: ["Needle keyword"] }), needle), 25);
assert.equal(scoreContent(fixture({ summary: "Needle summary" }), needle), 10);
assert.equal(scoreContent(fixture({ title: "Needle title", keywords: ["Needle keyword"], summary: "Needle summary" }), needle), 85);

assert.deepEqual(
  searchContent("needle", [fixture({ href: "/i", title: "い", keywords: ["needle"] }), fixture({ href: "/a", title: "あ", keywords: ["needle"] })]).map((item) => item.href),
  ["/a", "/i"],
);
assert.equal(searchContent("WACC")[0]?.href, "/valuation/dcf/wacc");
assert.ok(searchContent("割引率").some((item) => item.href === "/valuation/dcf/wacc"));
assert.ok(searchContent("").every((item) => item.featured));

const related = getRelatedContent("/valuation/dcf/fcff", 3);
assert.ok(related.every((item) => item.href !== "/valuation/dcf/fcff"));
assert.equal(new Set(related.map((item) => item.href)).size, related.length);
assert.ok(related.every((item) => item.topic === "valuation"));
assert.ok(related.length <= 3);

console.log("Content catalog validation passed");
