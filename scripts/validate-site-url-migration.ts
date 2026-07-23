import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const newSlug = "financial-modeling-lab";
const oldSlug = "ma-modeling-lab";
const newSiteUrl = `https://arsenal23vm-netizen.github.io/${newSlug}`;
const roots = [".github", "src", "scripts"];
const standaloneFiles = [".env.example", "package.json", "package-lock.json", "README.md"];
const ignoredFiles = new Set(["scripts/validate-site-url-migration.ts"]);

async function listFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(root, entry.name).replaceAll("\\", "/");
    return entry.isDirectory() ? listFiles(target) : [target];
  }));
  return nested.flat();
}

async function main() {
  const workflow = await readFile(".github/workflows/deploy-pages.yml", "utf8");
  const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
    name?: string;
    scripts?: Record<string, string>;
  };

  assert.equal(packageJson.name, newSlug, "package name must match the new repository");
  assert.equal(
    packageJson.scripts?.["validate:url-migration"],
    "tsx scripts/validate-site-url-migration.ts",
    "package scripts must expose the URL migration validation",
  );
  assert.match(workflow, /PAGES_BASE_PATH: \/financial-modeling-lab/u);
  assert.match(workflow, /NEXT_PUBLIC_BASE_PATH: \/financial-modeling-lab/u);
  assert.ok(
    workflow.includes(`NEXT_PUBLIC_SITE_URL: ${newSiteUrl}`),
    "deployment workflow must publish the new site URL",
  );

  const files = [
    ...standaloneFiles,
    ...(await Promise.all(roots.map(listFiles))).flat(),
  ].filter((file) => !ignoredFiles.has(file));
  const violations: string[] = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (source.includes(oldSlug)) violations.push(file);
  }

  assert.deepEqual(
    violations,
    [],
    `old repository slug remains in production files:\n${violations.join("\n")}`,
  );

  console.log("Site URL migration validation passed.");
}

void main();
