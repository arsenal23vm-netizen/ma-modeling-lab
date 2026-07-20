import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { ExcelSelectionMatrix, TargetComparisonCards } from "../src/components/CompsSelectionFigures";
import { candidatePeers, selectionCriteria, targetProfile } from "../src/data/comps-selection";

const cards = renderToStaticMarkup(<TargetComparisonCards target={targetProfile} peers={candidatePeers} />);
assert.equal((cards.match(/<article/g) ?? []).length, 4, "comparison renders target plus Core, Secondary, and Negative examples only");
assert.doesNotMatch(cards, /Aspirational peer/, "comparison excludes Aspirational examples");

const matrix = renderToStaticMarkup(<ExcelSelectionMatrix peers={candidatePeers} criteria={selectionCriteria} />);
const closePeer = candidatePeers.find((peer) => !peer.dataAvailable);
assert.ok(closePeer, "case data includes a peer without available data");
const closeRow = matrix.match(new RegExp(`<tr[^>]*>.*?${closePeer.name}.*?</tr>`));
assert.ok(closeRow, "matrix renders the unavailable peer");
assert.match(closeRow[0], /class="number average-score">N\/A<\/td>/, "unavailable peers render N/A for the average score");

console.log("Comps selection figure validation passed.");
