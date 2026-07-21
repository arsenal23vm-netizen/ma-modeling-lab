import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FinancialModelingPage, { metadata as financialModelingMetadata } from "../src/app/financial-modeling/page";
import MaModelingPage, { metadata as maModelingMetadata } from "../src/app/ma-modeling/page";
import ValuationPage, { metadata as valuationMetadata } from "../src/app/valuation/page";
import ExcelTemplatesPage, { metadata as excelTemplatesMetadata } from "../src/app/excel-templates/page";
import sitemap from "../src/app/sitemap";
import { contentCatalog, type ContentEntry } from "../src/data/content-catalog";

const deploymentBase = "https://arsenal23vm-netizen.github.io/ma-modeling-lab";
const unpublishedHrefs = new Set([
  "/valuation/dcf",
  "/valuation/dcf/fcff",
  "/valuation/dcf/wacc",
  "/valuation/dcf/terminal-value",
  "/valuation/dcf/sensitivity-analysis",
  "/valuation/dcf/enterprise-to-equity",
  "/downloads/dcf-valuation-model",
]);

const hubs = [
  {
    route: "financial-modeling",
    topic: "financial-modeling",
    page: FinancialModelingPage,
    metadata: financialModelingMetadata,
  },
  {
    route: "valuation",
    topic: "valuation",
    page: ValuationPage,
    metadata: valuationMetadata,
  },
  {
    route: "ma-modeling",
    topic: "ma-modeling",
    page: MaModelingPage,
    metadata: maModelingMetadata,
  },
  {
    route: "excel-templates",
    topic: "excel",
    page: ExcelTemplatesPage,
    metadata: excelTemplatesMetadata,
  },
] as const;

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

function getExpectedLinks(topic: ContentEntry["topic"], currentHref: string) {
  return contentCatalog
    .filter((item) => item.topic === topic && item.href !== currentHref && !unpublishedHrefs.has(item.href))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title, "ja"))
    .map((item) => item.href);
}

for (const hub of hubs) {
  const pageSource = readFileSync(`src/app/${hub.route}/page.tsx`, "utf8");
  const markup = renderToStaticMarkup(createElement(hub.page));
  const h1 = markup.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const hrefs = [...markup.matchAll(/<a[^>]+href="([^"]+)"/g)].map((match) => match[1]);
  const expectedLinks = getExpectedLinks(hub.topic, `/${hub.route}`);

  assert.match(pageSource, /<TopicHub/);
  assert.ok(h1, `${hub.route} needs one rendered H1`);
  assert.ok(!headings.has(h1[1]), `${hub.route} must have a unique H1`);
  headings.add(h1[1]);
  assert.ok(typeof hub.metadata.description === "string" && hub.metadata.description.length > 0, `${hub.route} needs a metadata description`);
  assert.equal(hub.metadata.alternates?.canonical, `${deploymentBase}/${hub.route}`, `${hub.route} needs its deployment canonical`);
  assert.ok(home.includes(`/${hub.route}`), `Home must link to /${hub.route}`);

  assert.equal((markup.match(/STEP \d\d/g) ?? []).length, 3, `${hub.route} must render exactly three learning steps`);
  assert.deepEqual(markup.match(/STEP \d\d/g), ["STEP 01", "STEP 02", "STEP 03"]);
  assert.match(markup, /こんな方のためのテーマです/);
  assert.match(markup, /現在利用できるコンテンツ/);
  assert.match(markup, /今後扱うテーマ/);
  assert.deepEqual(hrefs, expectedLinks, `${hub.route} must render only its available catalog content in featured-first order`);
  assert.equal(new Set(hrefs).size, hrefs.length, `${hub.route} must not duplicate hrefs`);
  assert.ok(hrefs.every((href) => contentCatalog.some((item) => item.href === href)), `${hub.route} contains an unknown href`);
  assert.ok(hrefs.every((href) => !unpublishedHrefs.has(href)), `${hub.route} links to unpublished content`);
  assert.ok(hrefs.every((href) => !/\/(ppa|lbo|sources-and-uses)/.test(href)), `${hub.route} links to an unpublished future topic`);
}

const sitemapEntries = sitemap();
for (const hub of hubs) {
  const entry = sitemapEntries.find((item) => item.url === `${deploymentBase}/${hub.route}`);
  assert.ok(entry, `Sitemap must include /${hub.route}`);
  assert.equal(entry.changeFrequency, "monthly");
  assert.equal(entry.priority, 0.9);
  assert.ok(entry.lastModified instanceof Date && entry.lastModified.getTime() >= new Date("2026-07-21T00:00:00+09:00").getTime());
}

for (const item of expectedNavigation) {
  assert.ok(siteData.includes(item), `Primary navigation is missing ${item}`);
}
assert.equal((siteData.match(/href: "\//g) ?? []).length, expectedNavigation.length, "Primary navigation must only include the five planned links");
assert.ok(home.includes("学習テーマから探す"));
assert.ok(!home.includes("/valuation/ppa"));
assert.ok(!home.includes("/ma-modeling/lbo"));

console.log("Growth hub validation passed");
