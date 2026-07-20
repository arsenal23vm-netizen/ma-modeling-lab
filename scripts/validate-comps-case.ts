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
  const derivedCriticalMismatch = selectionCriteria
    .filter((criterion) => criterion.critical && !peer.dataGaps.includes(criterion.id))
    .some((criterion) => peer.scores[criterion.id] < 2);
  assert.equal(peer.criticalMismatch, derivedCriticalMismatch, `${peer.name}: 重大不一致が観察可能な重大基準スコアと一致すること`);
  assert.equal(peer.coreEligibilityBlocked, peer.criticalMismatch || peer.dataGaps.length > 0, `${peer.name}: Core適格性ブロックが重大不一致またはデータ欠損と一致すること`);
  if (peer.role === "core_peer") assert.equal(peer.coreEligibilityBlocked, false, `${peer.name}: Core適格性を阻害する要因がないこと`);
}

const servicePeer = candidatePeers.find((peer) => peer.id === "service");
assert.ok(servicePeer?.criticalMismatch, "サービス企業の資本集約度0点は重大不一致として扱うこと");
const closePeer = candidatePeers.find((peer) => peer.id === "close");
assert.deepEqual(closePeer?.dataGaps, ["margin", "liquidity"], "近接企業の欠損項目を限定して記録すること");
assert.equal(closePeer?.criticalMismatch, false, "近接企業のデータ欠損を重大不一致と混同しないこと");
assert.equal(closePeer?.coreEligibilityBlocked, true, "近接企業のデータ欠損はCore適格性を阻害すること");

const corePeers = candidatePeers.filter((peer) => peer.role === "core_peer");
assert.equal(corePeers.length, 6, "模範回答のCore Peerは6社であること");
console.log("Comps case validation passed: 12 candidates / 6 core peers");
