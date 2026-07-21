import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { metadata as financialModelingMetadata } from "../src/app/financial-modeling/page";
import { metadata as valuationMetadata } from "../src/app/valuation/page";
import { metadata as maModelingMetadata } from "../src/app/ma-modeling/page";
import { metadata as excelTemplatesMetadata } from "../src/app/excel-templates/page";
import { metadata as dcfMetadata } from "../src/app/valuation/dcf/page";
import { metadata as fcffMetadata } from "../src/app/valuation/dcf/fcff/page";
import { metadata as waccMetadata } from "../src/app/valuation/dcf/wacc/page";
import { metadata as terminalValueMetadata } from "../src/app/valuation/dcf/terminal-value/page";
import { metadata as sensitivityAnalysisMetadata } from "../src/app/valuation/dcf/sensitivity-analysis/page";
import { metadata as enterpriseToEquityMetadata } from "../src/app/valuation/dcf/enterprise-to-equity/page";
import { metadata as dcfWorkbookMetadata } from "../src/app/downloads/dcf-valuation-model/page";
import { metadata as threeStatementsMetadata } from "../src/app/three-statements/page";
import sitemap from "../src/app/sitemap";
import { contentCatalog } from "../src/data/content-catalog";

const siteOrigin = "https://arsenal23vm-netizen.github.io";
const pagesBasePath = "/ma-modeling-lab";
const deploymentBase = `${siteOrigin}${pagesBasePath}`;
const outRoot = path.resolve("out");
const expectedLastModified = new Date("2026-07-21T00:00:00+09:00").getTime();

const routes: Array<{
  route: string;
  metadata: Metadata;
  priority: number;
}> = [
  { route: "/financial-modeling", metadata: financialModelingMetadata, priority: 0.9 },
  { route: "/valuation", metadata: valuationMetadata, priority: 0.9 },
  { route: "/ma-modeling", metadata: maModelingMetadata, priority: 0.9 },
  { route: "/excel-templates", metadata: excelTemplatesMetadata, priority: 0.9 },
  { route: "/valuation/dcf", metadata: dcfMetadata, priority: 0.9 },
  { route: "/valuation/dcf/fcff", metadata: fcffMetadata, priority: 0.85 },
  { route: "/valuation/dcf/wacc", metadata: waccMetadata, priority: 0.85 },
  { route: "/valuation/dcf/terminal-value", metadata: terminalValueMetadata, priority: 0.85 },
  { route: "/valuation/dcf/sensitivity-analysis", metadata: sensitivityAnalysisMetadata, priority: 0.85 },
  { route: "/valuation/dcf/enterprise-to-equity", metadata: enterpriseToEquityMetadata, priority: 0.85 },
  { route: "/downloads/dcf-valuation-model", metadata: dcfWorkbookMetadata, priority: 0.9 },
  { route: "/three-statements", metadata: threeStatementsMetadata, priority: 0.85 },
];

function metadataText(value: Metadata["title"] | Metadata["description"], label: string) {
  if (typeof value !== "string") assert.fail(`${label} must be an explicit string`);
  assert.ok(value.trim().length > 0, `${label} must not be empty`);
  return value;
}

function canonicalText(metadata: Metadata, route: string) {
  const canonical = metadata.alternates?.canonical;
  assert.ok(canonical, `${route} must define alternates.canonical explicitly`);
  return canonical instanceof URL ? canonical.toString() : String(canonical);
}

function urlText(value: string | URL | null | undefined, label: string) {
  assert.ok(value, `${label} must be explicit`);
  return value instanceof URL ? value.toString() : value;
}

function htmlAttribute(html: string, tagName: string, identifyingAttribute: string, identifyingValue: string, valueAttribute: string) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
  for (const tag of tags) {
    const attributes = Object.fromEntries(
      [...tag.matchAll(/([\w-]+)=(?:"([^"]*)"|'([^']*)')/g)]
        .map((match) => [match[1].toLowerCase(), match[2] ?? match[3]]),
    );
    if (attributes[identifyingAttribute] === identifyingValue) {
      return attributes[valueAttribute];
    }
  }
  return undefined;
}

function exportedRouteFile(route: string) {
  return path.join(outRoot, `${route.slice(1)}.html`);
}

function exportedPathFor(pathname: string) {
  const decodedPath = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, "");
  if (!decodedPath) return path.join(outRoot, "index.html");

  const publicFile = path.join(outRoot, decodedPath);
  if (existsSync(publicFile) && statSync(publicFile).isFile()) return publicFile;

  const flatPage = path.join(outRoot, `${decodedPath}.html`);
  if (existsSync(flatPage) && statSync(flatPage).isFile()) return flatPage;

  return undefined;
}

function exportedUserFacingPath(pathname: string) {
  const decodedPath = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, "");
  if (!decodedPath) return path.join(outRoot, "index.html");

  const flatPage = path.join(outRoot, `${decodedPath}.html`);
  if (existsSync(flatPage) && statSync(flatPage).isFile()) return flatPage;

  const publicRoot = path.resolve("public");
  const publicSource = path.resolve(publicRoot, decodedPath);
  const exportedPublicFile = path.join(outRoot, decodedPath);
  if (
    publicSource.startsWith(`${publicRoot}${path.sep}`)
    && existsSync(publicSource)
    && statSync(publicSource).isFile()
    && existsSync(exportedPublicFile)
    && statSync(exportedPublicFile).isFile()
  ) return exportedPublicFile;

  return undefined;
}

function sha256(filePath: string) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function decodeHtmlText(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'");
}

function listFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(root, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

const sitemapEntries = sitemap();
const titles = new Set<string>();
const descriptions = new Set<string>();
const canonicals = new Set<string>();
const exportedTitles = new Set<string>();
const exportedDescriptions = new Set<string>();
const generatedSitemap = readFileSync(path.join(outRoot, "sitemap.xml"), "utf8");

for (const item of routes) {
  const expectedCanonical = `${deploymentBase}${item.route}`;
  const title = metadataText(item.metadata.title, `${item.route} metadata title`);
  const description = metadataText(item.metadata.description, `${item.route} metadata description`);
  const canonical = canonicalText(item.metadata, item.route);
  const openGraphTitle = metadataText(item.metadata.openGraph?.title, `${item.route} Open Graph title`);
  const openGraphDescription = metadataText(item.metadata.openGraph?.description, `${item.route} Open Graph description`);
  const openGraphUrl = urlText(item.metadata.openGraph?.url, `${item.route} Open Graph URL`);

  assert.ok(!titles.has(title), `${item.route} duplicates metadata title: ${title}`);
  assert.ok(!descriptions.has(description), `${item.route} duplicates metadata description: ${description}`);
  assert.ok(!canonicals.has(canonical), `${item.route} duplicates canonical: ${canonical}`);
  assert.ok(!title.endsWith("| Finance Modeling Lab"), `${item.route} title must rely on the root title template for the site name`);
  assert.equal(canonical, expectedCanonical, `${item.route} canonical must match its deployment URL`);
  assert.equal(openGraphUrl, expectedCanonical, `${item.route} Open Graph URL must match its deployment URL`);
  titles.add(title);
  descriptions.add(description);
  canonicals.add(canonical);

  const sitemapEntry = sitemapEntries.find((entry) => entry.url === expectedCanonical);
  assert.ok(sitemapEntry, `Sitemap must include ${item.route}`);
  assert.equal(sitemapEntry.changeFrequency, "monthly", `${item.route} sitemap frequency must be monthly`);
  assert.equal(sitemapEntry.priority, item.priority, `${item.route} sitemap priority is incorrect`);
  assert.ok(sitemapEntry.lastModified instanceof Date, `${item.route} sitemap lastModified must be a Date`);
  assert.equal(sitemapEntry.lastModified.getTime(), expectedLastModified, `${item.route} sitemap lastModified must be 2026-07-21`);
  assert.ok(generatedSitemap.includes(`<loc>${expectedCanonical}</loc>`), `Generated sitemap must include ${item.route}`);

  assert.equal(contentCatalog.filter((entry) => entry.href === item.route).length, 1, `Catalog must contain ${item.route} exactly once`);

  const htmlPath = exportedRouteFile(item.route);
  assert.ok(existsSync(htmlPath), `Static export must contain flat file out/${item.route.slice(1)}.html`);
  assert.ok(!existsSync(path.join(outRoot, item.route.slice(1), "index.html")), `${item.route} must use a flat export, not a nested index.html`);
  const html = readFileSync(htmlPath, "utf8");
  const htmlTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  const htmlDescription = htmlAttribute(html, "meta", "name", "description", "content");
  const htmlCanonical = htmlAttribute(html, "link", "rel", "canonical", "href");
  const htmlOpenGraphTitle = htmlAttribute(html, "meta", "property", "og:title", "content");
  const htmlOpenGraphDescription = htmlAttribute(html, "meta", "property", "og:description", "content");
  const htmlOpenGraphUrl = htmlAttribute(html, "meta", "property", "og:url", "content");
  assert.ok(htmlTitle, `${item.route} exported title is missing`);
  assert.equal(decodeHtmlText(htmlTitle), `${title} | Finance Modeling Lab`, `${item.route} exported title differs from route metadata and root template`);
  assert.ok(htmlDescription, `${item.route} exported description is missing`);
  assert.equal(decodeHtmlText(htmlDescription), description, `${item.route} exported description differs from route metadata`);
  assert.equal(htmlCanonical, expectedCanonical, `${item.route} exported canonical is incorrect`);
  assert.ok(htmlOpenGraphTitle, `${item.route} exported Open Graph title is missing`);
  assert.equal(decodeHtmlText(htmlOpenGraphTitle), openGraphTitle, `${item.route} exported Open Graph title is incorrect`);
  assert.ok(htmlOpenGraphDescription, `${item.route} exported Open Graph description is missing`);
  assert.equal(decodeHtmlText(htmlOpenGraphDescription), openGraphDescription, `${item.route} exported Open Graph description is incorrect`);
  assert.equal(htmlOpenGraphUrl, expectedCanonical, `${item.route} exported Open Graph URL is incorrect`);
  assert.ok(!exportedTitles.has(htmlTitle), `${item.route} duplicates an exported title`);
  assert.ok(!exportedDescriptions.has(htmlDescription), `${item.route} duplicates an exported description`);
  exportedTitles.add(htmlTitle);
  exportedDescriptions.add(htmlDescription);
}

for (const publicDownload of listFiles(path.resolve("public/downloads"))) {
  const relativePath = path.relative(path.resolve("public"), publicDownload);
  assert.ok(existsSync(path.join(outRoot, relativePath)), `Static export is missing public file ${relativePath}`);
}

const workbookRelativePath = path.join("downloads", "06_DCF評価モデル.xlsx");
const sourceWorkbook = path.resolve("public", workbookRelativePath);
const exportedWorkbook = path.join(outRoot, workbookRelativePath);
assert.equal(sha256(exportedWorkbook), sha256(sourceWorkbook), "Exported DCF workbook must be byte-identical to public/downloads");

for (const entry of contentCatalog) {
  assert.ok(entry.href.startsWith("/"), `Catalog href must be root-relative: ${entry.href}`);
  assert.ok(exportedUserFacingPath(entry.href), `Catalog href does not resolve to an exported page or public file: ${entry.href}`);
}

for (const htmlPath of listFiles(outRoot).filter((filePath) => filePath.endsWith(".html"))) {
  const html = readFileSync(htmlPath, "utf8");
  const references = [...html.matchAll(/(?:href|src)=(?:"([^"]*)"|'([^']*)')/gi)]
    .map((match) => match[1] ?? match[2]);
  const anchorReferences = [...html.matchAll(/<a\b[^>]*href=(?:"([^"]*)"|'([^']*)')/gi)]
    .map((match) => match[1] ?? match[2]);

  for (const reference of references) {
    if (!reference || reference.startsWith("#") || /^(?:data|mailto|tel|javascript|blob):/i.test(reference)) continue;

    const absoluteUrl = new URL(reference, `${deploymentBase}/`);
    if (absoluteUrl.origin !== siteOrigin) continue;

    const pathname = absoluteUrl.pathname;
    assert.ok(
      pathname === pagesBasePath || pathname.startsWith(`${pagesBasePath}/`),
      `${path.relative(outRoot, htmlPath)} contains an unprefixed Pages internal link: ${reference}`,
    );

    const deploymentPath = pathname.slice(pagesBasePath.length) || "/";
    assert.ok(
      exportedPathFor(deploymentPath),
      `${path.relative(outRoot, htmlPath)} contains a broken internal link: ${reference}`,
    );
  }

  for (const reference of anchorReferences) {
    if (!reference || reference.startsWith("#") || /^(?:mailto|tel|javascript):/i.test(reference)) continue;
    const absoluteUrl = new URL(reference, `${deploymentBase}/`);
    if (absoluteUrl.origin !== siteOrigin) continue;
    const deploymentPath = absoluteUrl.pathname.slice(pagesBasePath.length) || "/";
    assert.ok(
      exportedUserFacingPath(deploymentPath),
      `${path.relative(outRoot, htmlPath)} contains a user-facing link that is not an exported page or public file: ${reference}`,
    );
  }
}

console.log("Organic growth static export validation passed");
