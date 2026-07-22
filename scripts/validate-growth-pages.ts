import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FinancialModelingPage, { metadata as financialModelingMetadata } from "../src/app/financial-modeling/page";
import MaModelingPage, { metadata as maModelingMetadata } from "../src/app/ma-modeling/page";
import ValuationPage, { metadata as valuationMetadata } from "../src/app/valuation/page";
import ExcelTemplatesPage, { metadata as excelTemplatesMetadata } from "../src/app/excel-templates/page";
import DcfHubPage, { metadata as dcfHubMetadata } from "../src/app/valuation/dcf/page";
import FcffPage, { metadata as fcffMetadata } from "../src/app/valuation/dcf/fcff/page";
import WaccPage, { metadata as waccMetadata } from "../src/app/valuation/dcf/wacc/page";
import TerminalValuePage, { metadata as terminalValueMetadata } from "../src/app/valuation/dcf/terminal-value/page";
import SensitivityAnalysisPage, { metadata as sensitivityAnalysisMetadata } from "../src/app/valuation/dcf/sensitivity-analysis/page";
import EnterpriseToEquityPage, { metadata as enterpriseToEquityMetadata } from "../src/app/valuation/dcf/enterprise-to-equity/page";
import { SensitivityFigure } from "../src/components/DcfFigures";
import sitemap from "../src/app/sitemap";
import { contentCatalog, type ContentEntry } from "../src/data/content-catalog";
import { buildSensitivityMatrix, calculateDcf, calculateEquityBridge, calculateFcff, calculateWacc, dcfCase } from "../src/data/dcf-series";

const deploymentBase = "https://arsenal23vm-netizen.github.io/ma-modeling-lab";
const unpublishedHrefs = new Set<string>();

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
  '{ href: "/", label: "ホーム" }',
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
    .filter((item) => (
      item.topic === topic || (topic === "excel" && item.href === "/downloads/dcf-valuation-model")
    ) && item.href !== currentHref && !unpublishedHrefs.has(item.href))
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

  assert.equal((markup.match(/手順 \d\d/g) ?? []).length, 3, `${hub.route} must render exactly three learning steps`);
  assert.deepEqual(markup.match(/手順 \d\d/g), ["手順 01", "手順 02", "手順 03"]);
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

const dcfLessonHrefs = [
  "/valuation/dcf/fcff",
  "/valuation/dcf/wacc",
  "/valuation/dcf/terminal-value",
  "/valuation/dcf/sensitivity-analysis",
  "/valuation/dcf/enterprise-to-equity",
] as const;

const dcfLessonRoutes = [
  {
    slug: "fcff",
    href: dcfLessonHrefs[0],
    page: FcffPage,
    metadata: fcffMetadata,
    formula: "FCFF = EBIT × (1 − 税率) + 減価償却費 − 設備投資 − 運転資本増加",
    numericMarker: calculateFcff(dcfCase.forecasts[0]).toFixed(1),
    previous: "/valuation/dcf",
    next: dcfLessonHrefs[1],
  },
  {
    slug: "wacc",
    href: dcfLessonHrefs[1],
    page: WaccPage,
    metadata: waccMetadata,
    formula: "WACC = 株主資本構成比 × 株主資本コスト + 負債構成比 × 税引後負債コスト",
    numericMarker: `${(calculateWacc(dcfCase.wacc) * 100).toFixed(2)}%`,
    previous: dcfLessonHrefs[0],
    next: dcfLessonHrefs[2],
  },
  {
    slug: "terminal-value",
    href: dcfLessonHrefs[2],
    page: TerminalValuePage,
    metadata: terminalValueMetadata,
    formula: "継続価値 = FCFF(n+1) / (WACC − g)",
    numericMarker: calculateDcf(dcfCase).terminalValue.toFixed(1),
    previous: dcfLessonHrefs[1],
    next: dcfLessonHrefs[3],
  },
  {
    slug: "sensitivity-analysis",
    href: dcfLessonHrefs[3],
    page: SensitivityAnalysisPage,
    metadata: sensitivityAnalysisMetadata,
    formula: "WACC × 永久成長率",
    numericMarker: calculateDcf(dcfCase).enterpriseValue.toFixed(1),
    previous: dcfLessonHrefs[2],
    next: dcfLessonHrefs[4],
  },
  {
    slug: "enterprise-to-equity",
    href: dcfLessonHrefs[4],
    page: EnterpriseToEquityPage,
    metadata: enterpriseToEquityMetadata,
    formula: "Equity Value = Enterprise Value + 現金及び現金同等物 − 有利子負債 − 有利子負債類似項目 − 非支配持分",
    numericMarker: calculateEquityBridge(calculateDcf(dcfCase).enterpriseValue, dcfCase.bridge).equityValue.toFixed(1),
    previous: dcfLessonHrefs[3],
    next: "/valuation/dcf",
  },
] as const;

const dcfHubMarkup = renderToStaticMarkup(createElement(DcfHubPage));
const dcfHubSource = readFileSync("src/app/valuation/dcf/page.tsx", "utf8");
const hubLessonLinks = [...dcfHubMarkup.matchAll(/<a[^>]+href="(\/valuation\/dcf\/[^"]+)"/g)]
  .map((match) => match[1]);
assert.equal((dcfHubMarkup.match(/<h1(?:\s|>)/g) ?? []).length, 1, "DCF hub needs exactly one H1");
assert.doesNotMatch(dcfHubMarkup, /<main(?:\s|>)/, "Root layout already supplies the page's main landmark");
assert.equal(dcfHubMetadata.alternates?.canonical, `${deploymentBase}/valuation/dcf`);
assert.ok(dcfHubSource.includes("dcfCase"), "DCF hub must source its sample assumptions from dcfCase");
assert.ok(dcfHubMarkup.indexOf("Enterprise Value（企業価値）") < dcfHubMarkup.indexOf(`href="${dcfLessonHrefs[0]}"`));
assert.ok(dcfHubMarkup.indexOf("Equity Value（株主価値）") < dcfHubMarkup.indexOf(`href="${dcfLessonHrefs[0]}"`));
assert.deepEqual(hubLessonLinks, [...dcfLessonHrefs], "DCF hub must link the five lessons once and in valuation order");
assert.match(dcfHubMarkup, /サンプル部品株式会社/);
assert.match(dcfHubMarkup, /百万円/);
assert.match(dcfHubMarkup, /教育目的/);
assert.match(dcfHubMarkup, /意思決定に利用できる状態ではありません/);
assert.match(dcfHubMarkup, /href="\/downloads\/dcf-valuation-model"/);

for (const route of dcfLessonRoutes) {
  const source = readFileSync(`src/app/valuation/dcf/${route.slug}/page.tsx`, "utf8");
  const markup = renderToStaticMarkup(createElement(route.page));

  assert.equal((markup.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${route.href} needs exactly one H1`);
  assert.ok(typeof route.metadata.title === "string" && route.metadata.title.length > 0, `${route.href} needs a title`);
  assert.ok(typeof route.metadata.description === "string" && route.metadata.description.length > 0, `${route.href} needs a description`);
  assert.equal(route.metadata.alternates?.canonical, `${deploymentBase}${route.href}`, `${route.href} needs its deployment canonical`);
  assert.ok(source.includes("dcfCase"), `${route.href} must use the shared dcfCase`);
  assert.ok(markup.includes(route.formula), `${route.href} is missing its required formula marker`);
  assert.ok(markup.includes(route.numericMarker), `${route.href} is missing its shared-case numeric example`);
  assert.match(markup, /定義と使う場面/);
  assert.match(markup, /ステップ計算/);
  assert.match(markup, /Excelセル式/);
  assert.match(markup, /class="[^"]*data-scroll/);
  assert.match(markup, /<table/);
  assert.match(markup, /<caption/);
  assert.match(markup, /scope="col"/);
  assert.match(markup, /百万円|%/);
  assert.equal((markup.match(/data-dcf-common-error="true"/g) ?? []).length, 2, `${route.href} needs exactly two common errors`);
  assert.equal((markup.match(/data-dcf-review-check="true"/g) ?? []).length, 1, `${route.href} needs exactly one review check`);
  assert.match(markup, new RegExp(`href="${route.previous}"`), `${route.href} needs its previous-stage link`);
  assert.match(markup, new RegExp(`href="${route.next}"`), `${route.href} needs its next-stage link`);
  assert.match(markup, /href="\/downloads\/dcf-valuation-model"/, `${route.href} needs the workbook CTA`);
  assert.match(markup, /aria-label="パンくずリスト"/);
  assert.match(markup, /編集情報/);
  assert.match(markup, /参考資料/);
  assert.match(markup, /変更履歴/);
  assert.match(markup, /教育目的/);
  assert.match(markup, /意思決定に利用できる状態ではありません/);
}

const waccMarkup = renderToStaticMarkup(createElement(WaccPage));
const waccSource = readFileSync("src/app/valuation/dcf/wacc/page.tsx", "utf8");
assert.doesNotMatch(waccSource, /75\.0%|25\.0%|6\.51%/, "WACC review values must be rendered from dcfCase");
assert.match(waccMarkup, /75\.0%/);
assert.match(waccMarkup, /25\.0%/);
assert.match(waccMarkup, /100\.0%/);
assert.match(waccMarkup, /WACC &gt; g/);
const terminalMarkup = renderToStaticMarkup(createElement(TerminalValuePage));
assert.match(terminalMarkup, /継続価値の構成比/);
assert.match(terminalMarkup, /期末時点/);
assert.ok(
  terminalMarkup.includes("=IF(B10&lt;=B9,NA(),B8*(1+B9)/(B10-B9))"),
  "Terminal Value lesson must publish the guarded Excel formula",
);
const sensitivityMarkup = renderToStaticMarkup(createElement(SensitivityAnalysisPage));
const sensitivitySource = readFileSync("src/app/valuation/dcf/sensitivity-analysis/page.tsx", "utf8");
assert.doesNotMatch(sensitivitySource, /WACC 5\.5%|g 0\.5%|gを2\.5%|WACCを7\.5%/, "Sensitivity labels must be rendered from dcfCase");
for (const rate of ["5.5%", "6.0%", "6.5%", "7.0%", "7.5%", "0.5%", "1.0%", "1.5%", "2.0%", "2.5%"] ) {
  assert.ok(sensitivityMarkup.includes(rate), `Sensitivity table is missing ${rate}`);
}
assert.match(sensitivityMarkup, /WACCが上がるとEnterprise Valueは下が/);
assert.match(sensitivityMarkup, /永久成長率が上がるとEnterprise Valueは上が/);
assert.ok(
  sensitivityMarkup.includes("データテーブルの左上セルは、WACC ≤ gでNA()を返す計算条件を組み込んだEnterprise Value出力を参照します。"),
  "Sensitivity lesson must instruct the Data Table to reference the guarded output",
);
assert.match(sensitivityMarkup, /基準ケースに最も近いグリッド点/);
const exactBaseWacc = calculateWacc(dcfCase.wacc);
const nearestGridWacc = dcfCase.sensitivity.waccRates.reduce((nearest, rate) =>
  Math.abs(rate - exactBaseWacc) < Math.abs(nearest - exactBaseWacc) ? rate : nearest,
);
const nearestGridCell = buildSensitivityMatrix(dcfCase)
  .find((row) => row.wacc === nearestGridWacc)?.cells
  .find((cell) => cell.terminalGrowthRate === dcfCase.terminalGrowthRate);
assert.ok(nearestGridCell?.enterpriseValue !== null && nearestGridCell?.enterpriseValue !== undefined);
const nearestGridAccessibleName = `Enterprise Value ${nearestGridCell.enterpriseValue.toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} 百万円。Baseに最も近い組合せ：WACC ${(nearestGridWacc * 100).toFixed(1)}%、永久成長率 ${(dcfCase.terminalGrowthRate * 100).toFixed(1)}%。BaseのWACCは${(exactBaseWacc * 100).toFixed(4)}%です。`;
assert.ok(
  sensitivityMarkup.includes(`aria-label="${nearestGridAccessibleName}"`),
  "Nearest sensitivity cell accessible name must include its value, unit, and proxy explanation",
);
assert.match(sensitivityMarkup, /該当なし/, "Sensitivity lesson must explain the invalid-cell state");
const invalidSensitivityFigureMarkup = renderToStaticMarkup(createElement(SensitivityFigure, {
  matrix: buildSensitivityMatrix({
    ...dcfCase,
    sensitivity: { waccRates: [0.015], terminalGrowthRates: [0.015] },
  }),
}));
assert.match(
  invalidSensitivityFigureMarkup,
  /<td[^>]+data-sensitivity-status="invalid"[^>]*>該当なし<\/td>/,
  "SensitivityFigure must render an invalid matrix cell as N/A",
);
const bridgeMarkup = renderToStaticMarkup(createElement(EnterpriseToEquityPage));
for (const label of ["現金及び現金同等物", "有利子負債", "有利子負債類似項目", "非支配持分"] ) {
  assert.ok(bridgeMarkup.includes(label), `EV-to-equity bridge is missing ${label}`);
}

for (const href of ["/valuation/dcf", ...dcfLessonHrefs]) {
  const entry = sitemapEntries.find((item) => item.url === `${deploymentBase}${href}`);
  assert.ok(entry, `Sitemap must include ${href}`);
  assert.equal(entry.changeFrequency, "monthly");
  assert.ok(entry.lastModified instanceof Date && entry.lastModified.getTime() >= new Date("2026-07-21T00:00:00+09:00").getTime());
}

console.log("Growth hub and DCF page validation passed");
