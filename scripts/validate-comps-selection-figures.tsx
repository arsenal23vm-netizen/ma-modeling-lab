import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { ExcelSelectionMatrix, TargetComparisonCards } from "../src/components/CompsSelectionFigures";
import { candidatePeers, selectionCriteria, targetProfile } from "../src/data/comps-selection";

const cards = renderToStaticMarkup(<TargetComparisonCards target={targetProfile} peers={candidatePeers} />);
assert.equal((cards.match(/<article/g) ?? []).length, 4, "comparison renders target plus Core, Secondary, and Negative examples only");
assert.doesNotMatch(cards, /Aspirational peer/, "comparison excludes Aspirational examples");
for (const label of ["売上高", "成長率", "EBITDA margin", "メンテナンス・サービス比率"]) {
  assert.equal((cards.match(new RegExp(label, "g")) ?? []).length, 4, `each comparison card shows ${label}`);
}
assert.match(cards, /成長率<\/dt><dd>N\/A<\/dd>/, "target growth is explicitly unavailable");

const matrix = renderToStaticMarkup(<ExcelSelectionMatrix peers={candidatePeers} criteria={selectionCriteria} />);
const closePeer = candidatePeers.find((peer) => !peer.dataAvailable);
assert.ok(closePeer, "case data includes a peer without available data");
const closeRow = matrix.match(new RegExp(`<tr[^>]*>.*?${closePeer.name}.*?</tr>`));
assert.ok(closeRow, "matrix renders the unavailable peer");
assert.match(closeRow[0], /class="number average-score">N\/A<\/td>/, "unavailable peers render N/A for the average score");
assert.match(matrix, /class="formula-bar"/, "matrix shows a formula bar");
assert.match(matrix, /class="excel-column-letters"/, "matrix shows column letters");
assert.match(matrix, /class="row-number"/, "matrix shows row numbers");
assert.match(matrix, /近接除外/, "matrix uses the Japanese close-exclusion role label");
assert.match(matrix, /比較限定/, "matrix uses the Japanese limited-comparison role label");
assert.equal((matrix.match(/class="matrix-warning"/g) ?? []).length, candidatePeers.filter((peer) => peer.criticalMismatch).length, "matrix visibly flags every critical mismatch");

console.log("Comps selection figure validation passed.");
