import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import DownloadsPage from "../src/app/downloads/page";
import Page, { metadata } from "../src/app/downloads/dcf-valuation-model/page";
import ExcelTemplatesPage from "../src/app/excel-templates/page";
import sitemap from "../src/app/sitemap";
import ValuationPage from "../src/app/valuation/page";
import { contentCatalog } from "../src/data/content-catalog";

const workbookHref = "/downloads/06_DCF評価モデル.xlsx";
const landingHref = "/downloads/dcf-valuation-model";
assert.ok(existsSync("public/downloads/06_DCF評価モデル.xlsx"), "generated DCF workbook must exist");

const html = renderToStaticMarkup(<Page />);
const directLinks = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]).filter((href) => href === workbookHref);
assert.ok(directLinks.length >= 2, "landing page must include at least two exact direct-download links");
for (const heading of ["対象読者", "シート構成", "入力方法", "主要数式", "Checks", "利用上の注意"]) assert.ok(html.includes(heading), `missing section: ${heading}`);
for (const sheet of ["Cover", "Inputs", "Assumptions", "PL", "BS", "CF", "Schedules", "DCF", "Checks"]) assert.ok(html.includes(sheet), `missing sheet role: ${sheet}`);
assert.match(html, /<caption[^>]*>[^<]*DCF[^<]*ワークシート[^<]*プレビュー[^<]*<\/caption>/u, "worksheet preview must have an accessible caption");
assert.match(html, /aria-label="数式バー"/u);
assert.match(html, /scope="col"/u);
assert.match(html, /scope="row"/u);
assert.match(html, /aria-label="ワークシートタブ"/u);
for (const legend of ["青セル：入力", "計算セル：数式", "出力セル：評価結果"]) assert.ok(html.includes(legend), `missing legend: ${legend}`);
for (const href of ["/valuation/dcf/fcff", "/valuation/dcf/wacc", "/valuation/dcf/terminal-value", "/valuation/dcf/sensitivity-analysis", "/valuation/dcf/enterprise-to-equity"]) assert.match(html, new RegExp(`href="${href}"`), `missing lesson link: ${href}`);
for (const wording of ["教育目的", "実案件", "Microsoft Excel 2021", "Microsoft 365", "LibreOffice"]) assert.ok(html.includes(wording), `missing landing copy: ${wording}`);

assert.equal(metadata.alternates?.canonical, "https://arsenal23vm-netizen.github.io/ma-modeling-lab/downloads/dcf-valuation-model");
assert.ok(sitemap().some((entry) => entry.url.endsWith(landingHref)), "sitemap must explicitly include the landing route");
const catalogEntry = contentCatalog.find((entry) => entry.href === landingHref);
assert.ok(catalogEntry);
assert.equal(catalogEntry.type, "download");
assert.equal(catalogEntry.topic, "valuation");
assert.match(catalogEntry.summary, /9シート/u);
for (const [name, hubHtml] of [["Excel Templates", renderToStaticMarkup(<ExcelTemplatesPage />)], ["Valuation", renderToStaticMarkup(<ValuationPage />)]]) {
  assert.match(hubHtml, new RegExp(`href="${landingHref}"`), `${name} hub must link to the DCF workbook landing page`);
}

const landingSource = readFileSync("src/app/downloads/dcf-valuation-model/page.tsx", "utf8");
assert.equal((landingSource.match(/<Link href=\{workbookHref\}/g) ?? []).length, 2, "Next Link must apply the deployment base path to both workbook CTAs");
assert.doesNotMatch(landingSource, /<a href=\{workbookHref\}/u);
const downloadCardSource = readFileSync("src/components/DownloadCard.tsx", "utf8");
assert.match(downloadCardSource, /<Link href=\{detailsHref\}/u, "details link must apply the deployment base path");
const previewSource = readFileSync("src/components/DcfWorkbookPreview.tsx", "utf8");
assert.doesNotMatch(previewSource, /role="tablist"|role="tab"/u, "static sheet labels must not expose interactive tab semantics");
assert.match(previewSource, /Inputs!B19:B21/u, "preview must identify the editable WACC assumptions on the Inputs sheet");
assert.match(previewSource, /DCF!B25:G25/u, "preview must identify DCF row 25 as the sensitivity header row");
assert.match(html, /<th[^>]*scope="col"[^>]*>WACC \/ g<\/th>/u, "DCF row 25 must render WACC / g as a sensitivity column header");
assert.doesNotMatch(html, /<tr><th[^>]*>25<\/th><th[^>]*>WACC \/ g<\/th><td class="workbook-input/u, "DCF row 25 must not present base WACC or g as editable input cells");

const downloadCenterHtml = renderToStaticMarkup(<DownloadsPage />);
const dcfCardStart = downloadCenterHtml.indexOf("DCF評価モデル");
assert.notEqual(dcfCardStart, -1);
const dcfCardHtml = downloadCenterHtml.slice(dcfCardStart, downloadCenterHtml.indexOf("</article>", dcfCardStart));
assert.match(dcfCardHtml, new RegExp(`href="${workbookHref}"`));
assert.match(dcfCardHtml, new RegExp(`href="${landingHref}"`));
assert.ok(dcfCardHtml.includes("詳しい使い方を見る"));

console.log("DCF workbook landing validation passed");
