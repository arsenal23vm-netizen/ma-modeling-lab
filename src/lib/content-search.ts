import { contentCatalog, type ContentEntry } from "@/data/content-catalog";

export const normalizeSearchText = (value: string) => value.normalize("NFKC").toLowerCase().replace(/\s+/g, "");

export function scoreContent(entry: ContentEntry, needle: string) {
  const title = normalizeSearchText(entry.title);
  if (title === needle) return 100;

  return (title.includes(needle) ? 50 : 0)
    + (entry.keywords.some((word) => normalizeSearchText(word).includes(needle)) ? 25 : 0)
    + (normalizeSearchText(entry.summary).includes(needle) ? 10 : 0);
}

export function searchContent(query: string, entries: readonly ContentEntry[] = contentCatalog): ContentEntry[] {
  const needle = normalizeSearchText(query);
  if (!needle) return entries.filter((item) => item.featured);

  return entries
    .map((item) => ({ item, score: scoreContent(item, needle) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "ja"))
    .map(({ item }) => item);
}
