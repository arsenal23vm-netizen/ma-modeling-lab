import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { ExcelSelectionMatrix, PeerRoleMap, SelectionFunnel, TargetComparisonCards } from "../src/components/CompsSelectionFigures";
import { candidatePeers, selectionCriteria, targetProfile } from "../src/data/comps-selection";

const cards = renderToStaticMarkup(<TargetComparisonCards target={targetProfile} peers={candidatePeers} />);
assert.equal((cards.match(/<article/g) ?? []).length, 4, "comparison renders target plus Core, Secondary, and Negative examples only");
assert.doesNotMatch(cards, /Aspirational peer/, "comparison excludes Aspirational examples");
for (const label of ["売上高", "成長率", "EBITDA margin", "メンテナンス・サービス比率"]) {
  assert.equal((cards.match(new RegExp(label, "g")) ?? []).length, 4, `each comparison card shows ${label}`);
}
assert.match(cards, /成長率<\/dt><dd>N\/A<\/dd>/, "target growth is explicitly unavailable");

const funnel = renderToStaticMarkup(<SelectionFunnel />);
for (const [label, count] of [["業種候補", 30], ["事業モデル", 18], ["財務比較", 12], ["Core", 6]]) {
  assert.match(funnel, new RegExp(`<strong>${label}<\\/strong>`), `funnel includes the ${label} stage`);
  assert.match(funnel, new RegExp(`>${count}社<`), `funnel includes ${count} companies for ${label}`);
}

const roleMap = renderToStaticMarkup(<PeerRoleMap peers={candidatePeers} />);
for (const label of ["中核（Core）", "補助（Secondary）", "将来像（Aspirational）", "不採用例（Negative）", "近接除外", "比較限定"]) {
  assert.match(roleMap, new RegExp(label), `role map uses the ${label} role label`);
}

const matrix = renderToStaticMarkup(<ExcelSelectionMatrix peers={candidatePeers} criteria={selectionCriteria} />);
const closePeer = candidatePeers.find((peer) => peer.dataGaps.length > 0);
assert.ok(closePeer, "case data includes a peer without available data");
const closeRow = matrix.match(new RegExp(`<tr[^>]*>.*?${closePeer.name}.*?</tr>`));
assert.ok(closeRow, "matrix renders the unavailable peer");
assert.equal((closeRow[0].match(/>N\/A<\/td>/g) ?? []).length, closePeer.dataGaps.length, "only unavailable criteria render N/A");
assert.match(closeRow[0], /class="number average-score">[0-3]\.[0-9]<\/td>/, "available observations still produce an average score");
assert.match(matrix, /class="formula-bar"/, "matrix shows a formula bar");
assert.match(matrix, /=AVERAGE\(D2:O2\)/, "formula bar averages the 12 score columns");
assert.doesNotMatch(matrix, /=AVERAGE\(C2:N2\)/, "formula bar does not include the role column");
assert.match(matrix, /class="excel-column-letters"/, "matrix shows column letters");
assert.match(matrix, /class="row-number"/, "matrix shows row numbers");
assert.match(matrix, /近接除外/, "matrix uses the Japanese close-exclusion role label");
assert.match(matrix, /比較限定/, "matrix uses the Japanese limited-comparison role label");
for (const label of ["中核（Core）", "補助（Secondary）", "将来像（Aspirational）", "不採用例（Negative）"]) {
  assert.match(matrix, new RegExp(label), `matrix uses the ${label} role label`);
}
assert.doesNotMatch(matrix, /<th scope="row" class="row-number"/, "row numbers are data cells, not row headers");
assert.equal((matrix.match(/scope="row"/g) ?? []).length, candidatePeers.length, "each matrix row has one company row header");
assert.equal((matrix.match(/class="matrix-warning"/g) ?? []).length, candidatePeers.filter((peer) => peer.criticalMismatch).length, "matrix visibly flags every critical mismatch");
assert.equal((matrix.match(/class="matrix-data-gap"/g) ?? []).length, candidatePeers.filter((peer) => peer.dataGaps.length > 0).length, "matrix separately flags every data gap");
assert.match(matrix, /aria-label="比較対象選定マトリクス"/, "matrix table has an accessible label");

console.log("Comps selection figure validation passed.");
