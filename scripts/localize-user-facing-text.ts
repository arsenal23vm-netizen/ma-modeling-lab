import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { displayTermMap } from "../src/data/practical-japanese";

const roots = ["src/app", "src/components", "src/data", "scripts"];
const ignoredFiles = new Set([
  "src/data/practical-japanese.ts",
  "src/data/dcf-series.ts",
  "src/data/editorial.ts",
  "scripts/localize-user-facing-text.ts",
]);
const replacements = Object.entries(displayTermMap).sort(([left], [right]) => right.length - left.length);

async function sourceFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(root, entry.name).replaceAll("\\", "/");
    if (entry.isDirectory()) return sourceFiles(target);
    return /\.(ts|tsx)$/u.test(entry.name) ? [target] : [];
  }));
  return nested.flat();
}

function belongsToKeywords(node: ts.Node) {
  let current: ts.Node | undefined = node;
  while (current) {
    if (ts.isPropertyAssignment(current) && current.name.getText() === "keywords") return true;
    current = current.parent;
  }
  return false;
}

function translate(value: string) {
  return replacements.reduce((translated, [english, japanese]) => translated.replaceAll(english, japanese), value);
}

async function localize(file: string) {
  if (ignoredFiles.has(file) || /scripts\/(test|validate)-/u.test(file)) return false;
  const source = await readFile(file, "utf8");
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edits: { start: number; end: number; value: string }[] = [];

  function visit(node: ts.Node) {
    if ((ts.isStringLiteralLike(node) || ts.isJsxText(node)) && !belongsToKeywords(node)) {
      const isJsx = ts.isJsxText(node);
      const start = isJsx ? node.getStart(sourceFile) : node.getStart(sourceFile) + 1;
      const end = isJsx ? node.getEnd() : node.getEnd() - 1;
      const raw = source.slice(start, end);
      const value = translate(raw);
      if (value !== raw) edits.push({ start, end, value });
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  if (edits.length === 0) return false;
  const updated = edits.sort((left, right) => right.start - left.start).reduce(
    (value, edit) => `${value.slice(0, edit.start)}${edit.value}${value.slice(edit.end)}`,
    source,
  );
  await writeFile(file, updated, "utf8");
  return true;
}

async function main() {
  const files = (await Promise.all(roots.map(sourceFiles))).flat();
  const changed: string[] = [];
  for (const file of files) if (await localize(file)) changed.push(file);
  console.log(`Localized ${changed.length} files`);
}

void main();
