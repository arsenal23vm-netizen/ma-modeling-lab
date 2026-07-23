import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { EditorialDetails } from "../src/components/EditorialDetails";
import {
  EDITORIAL_AUTHOR,
  editorialRecords,
  getEditorialRecord,
} from "../src/data/editorial";

const articleRoutes = [
  "/model-design",
  "/assumptions",
  "/revenue-kpi",
  "/pl-model",
  "/bs-model",
  "/cf-model",
  "/excel-functions",
  "/roadmap",
  "/three-statements",
  "/private-company-valuation",
  "/comps-peer-selection",
  "/valuation/dcf/fcff",
  "/valuation/dcf/wacc",
  "/valuation/dcf/terminal-value",
  "/valuation/dcf/sensitivity-analysis",
  "/valuation/dcf/enterprise-to-equity",
] as const;

assert.deepEqual(EDITORIAL_AUTHOR, {
  name: "Finance Modeling Lab 編集部",
  url: "/about#editorial-team",
});

assert.deepEqual(
  editorialRecords.map((record) => record.href).sort(),
  [...articleRoutes].sort(),
  "editorial records must cover every current article route exactly once",
);

const modifiedDates = new Set<string>();
const dcfSourceExpectations = new Map<string, { title: string; hostname: string }>([
  ["/valuation/dcf/fcff", { title: "Free Cash Flow Valuation", hostname: "www.cfainstitute.org" }],
  ["/valuation/dcf/wacc", { title: "Cost of Capital: Advanced Topics", hostname: "www.cfainstitute.org" }],
  ["/valuation/dcf/terminal-value", { title: "Terminal Value", hostname: "pages.stern.nyu.edu" }],
  ["/valuation/dcf/sensitivity-analysis", { title: "Calculate multiple results by using a data table", hostname: "support.microsoft.com" }],
  ["/valuation/dcf/enterprise-to-equity", { title: "IFRS 13 Fair Value Measurement", hostname: "www.ifrs.org" }],
]);

assert.equal(new Set([...dcfSourceExpectations.values()].map((source) => source.title)).size, 5);

for (const href of articleRoutes) {
  const record = getEditorialRecord(href);
  assert.equal(record.href, href);
  assert.match(record.publishedDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(record.modifiedDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(record.modifiedDate >= record.publishedDate, `${href} cannot be modified before publication`);
  assert.ok(record.modifiedDate <= "2026-07-22", `${href} cannot publish future revision metadata`);
  modifiedDates.add(record.modifiedDate);
  assert.ok(record.revisionSummary.length >= 10, `${href} needs a substantive revision summary`);
  assert.ok(record.sources.length > 0, `${href} needs at least one external source`);

  for (const source of record.sources) {
    assert.ok(source.title.trim());
    assert.ok(source.publisher.trim());
    assert.match(source.url, /^https:\/\//);
    assert.match(source.accessedDate, /^\d{4}-\d{2}-\d{2}$/);
  }

  const expectedSource = dcfSourceExpectations.get(href);
  if (expectedSource) {
    assert.ok(
      record.sources.some((source) =>
        source.title === expectedSource.title && new URL(source.url).hostname === expectedSource.hostname,
      ),
      `${href} needs its route-relevant authoritative source`,
    );
  }

  const html = renderToStaticMarkup(
    <EditorialDetails
      record={record}
      breadcrumbs={[
        { name: "ホーム", href: "/" },
        { name: record.title, href: record.href },
      ]}
    />,
  );

  assert.match(html, /Finance Modeling Lab 編集部/);
  assert.match(html, /<time[^>]+dateTime=/);
  assert.match(html, /参考資料/);
  assert.match(html, /変更履歴/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.match(html, /"dateModified"/);
  assert.match(html, /"author":\{"@type":"Organization"/);
  assert.match(html, /https:\/\/data-lab-23\.github\.io\/financial-modeling-lab/);
}

assert.deepEqual([...modifiedDates], ["2026-07-22"], "all reviewed articles must carry the current revision date");
assert.throws(() => getEditorialRecord("/missing"), /editorial record/i);

console.log("Editorial validation passed");
