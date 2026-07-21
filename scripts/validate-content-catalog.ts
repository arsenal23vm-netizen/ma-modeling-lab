import assert from "node:assert/strict";
import { contentCatalog, getRelatedContent } from "../src/data/content-catalog";
import { normalizeSearchText, searchContent } from "../src/lib/content-search";

assert.equal(new Set(contentCatalog.map((item) => item.href)).size, contentCatalog.length);
for (const href of [
  "/private-company-valuation",
  "/comps-peer-selection",
  "/journal-lab",
  "/downloads",
  "/tools",
  "/valuation/dcf/wacc",
  "/downloads/dcf-valuation-model",
]) {
  assert.ok(contentCatalog.some((item) => item.href === href), `catalog includes ${href}`);
}
assert.equal(normalizeSearchText(" ＷＡＣＣ\u3000評価 "), "wacc評価");
assert.equal(searchContent("WACC")[0]?.href, "/valuation/dcf/wacc");
assert.ok(searchContent("割引率").some((item) => item.href === "/valuation/dcf/wacc"));
assert.ok(searchContent("").every((item) => item.featured));

const related = getRelatedContent("/valuation/dcf/fcff", 3);
assert.ok(related.every((item) => item.href !== "/valuation/dcf/fcff"));
assert.equal(new Set(related.map((item) => item.href)).size, related.length);
assert.ok(related.every((item) => item.topic === "valuation"));
assert.ok(related.length <= 3);

console.log("Content catalog validation passed");
