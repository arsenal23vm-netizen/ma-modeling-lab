import assert from "node:assert/strict";
import { candidatePeers, selectionCriteria } from "../src/data/comps-selection";

assert.equal(candidatePeers.length, 12, "候補企業は12社であること");
assert.equal(new Set(candidatePeers.map((peer) => peer.id)).size, 12, "候補IDは重複しないこと");
assert.equal(selectionCriteria.length, 12, "評価軸は12項目であること");

const validRoles = new Set([
  "core_peer", "secondary_peer", "aspirational_peer",
  "negative_peer", "excluded_close_peer", "not_clean_comp",
]);

for (const peer of candidatePeers) {
  assert.ok(validRoles.has(peer.role), `${peer.name}: Roleが有効であること`);
  assert.ok(peer.rationale.length >= 20, `${peer.name}: 判断理由を具体的に記載すること`);
  assert.equal(Object.keys(peer.scores).length, selectionCriteria.length, `${peer.name}: 全評価軸を採点すること`);
  for (const score of Object.values(peer.scores)) assert.ok(Number.isInteger(score) && score >= 0 && score <= 3);
  if (peer.role === "core_peer") assert.equal(peer.criticalMismatch, false, `${peer.name}: Coreに重大不一致がないこと`);
}

const corePeers = candidatePeers.filter((peer) => peer.role === "core_peer");
assert.equal(corePeers.length, 6, "模範回答のCore Peerは6社であること");
console.log("Comps case validation passed: 12 candidates / 6 core peers");
