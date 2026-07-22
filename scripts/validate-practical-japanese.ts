import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { allowedEnglishTerms, bannedDisplayTerms, displayTermMap } from "../src/data/practical-japanese";
import { contentCatalog } from "../src/data/content-catalog";
import { downloads, roadmapSteps } from "../src/data/lab";
import { navItems } from "../src/data/site";

const roots = ["src/app", "src/components", "src/data", "scripts"];
const ignoredFiles = new Set([
  "src/data/practical-japanese.ts",
  "src/data/dcf-series.ts",
  "src/data/editorial.ts",
  "scripts/validate-practical-japanese.ts",
]);

async function sourceFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(root, entry.name).replaceAll("\\", "/");
    if (entry.isDirectory()) return sourceFiles(target);
    return /\.(ts|tsx)$/u.test(entry.name) ? [target] : [];
  }));
  return nested.flat();
}

async function main() {
assert.equal(navItems[0]?.label, "ホーム", "主ナビゲーションの先頭は「ホーム」と表示する");
assert.deepEqual(
  allowedEnglishTerms.slice(0, 4),
  ["Valuation", "Enterprise Value", "Equity Value", "Base / Upside / Downside"],
  "利用者が指定した英語表記を保護する",
);
assert.equal(displayTermMap["Core Peer"], "主要比較会社");
assert.equal(displayTermMap["Terminal Growth"], "永久成長率");
assert.ok(contentCatalog.some((item) => item.keywords.includes("Core Peer")), "旧英語でも検索できる別名を残す");
assert.ok(contentCatalog.some((item) => item.keywords.includes("主要比較会社")), "日本語の新用語でも検索できる");
for (const item of contentCatalog) {
  for (const term of bannedDisplayTerms) {
    assert.ok(!`${item.title}\n${item.summary}`.includes(term), `${item.href}の表示文に${term}が残っている`);
  }
}
assert.ok(downloads.every((item) => !/Inputs|Assumptions|Schedules|Checks/u.test(item.content)), "配布Excelの説明を日本語にする");
assert.ok(roadmapSteps.every((item) => !/Inputs|Assumptions|Schedules|Checks/u.test(item.done)), "ロードマップの到達基準を日本語にする");

const violations: string[] = [];
for (const file of (await Promise.all(roots.map(sourceFiles))).flat()) {
  if (ignoredFiles.has(file) || /scripts\/(test|validate)-/u.test(file)) continue;
  const source = await readFile(file, "utf8");
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

  const belongsToKeywords = (node: ts.Node) => {
    let current: ts.Node | undefined = node;
    while (current) {
      if (ts.isPropertyAssignment(current) && current.name.getText(sourceFile) === "keywords") return true;
      current = current.parent;
    }
    return false;
  };

  const visit = (node: ts.Node) => {
    const isTemplateToken = [ts.SyntaxKind.TemplateHead, ts.SyntaxKind.TemplateMiddle, ts.SyntaxKind.TemplateTail].includes(node.kind);
    if ((ts.isStringLiteralLike(node) || ts.isJsxText(node) || isTemplateToken) && !belongsToKeywords(node)) {
      const value = node.getText(sourceFile);
      for (const term of bannedDisplayTerms) {
        if (value.includes(term)) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
          violations.push(`${file}:${line}: ${term}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

assert.deepEqual(violations, [], `不要な英語表示が残っています:\n${violations.join("\n")}`);
console.log("Practical Japanese terminology validation passed");
}

void main();
