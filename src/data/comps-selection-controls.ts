export type PeerRoleControlRow = {
  id: string;
  role: string;
  rationale: string;
  criticalMismatch: boolean;
  dataGaps: string;
  coreEligibilityBlocked: boolean;
};

export type PeerRoleControlKey =
  | "missingRoles"
  | "missingReasons"
  | "duplicateIds"
  | "coreCritical"
  | "coreDataGap"
  | "coreBlocked"
  | "corePeers"
  | "candidateCount";

type PeerRoleControl = {
  key: PeerRoleControlKey;
  label: string;
  formula: string;
  standard: string;
  evaluate: (rows: PeerRoleControlRow[]) => number;
};

const roleRange = "'Peer Roles'!$C$5:$C$16";

export const peerRoleControls: PeerRoleControl[] = [
  { key: "missingRoles", label: "Role未入力", formula: `COUNTBLANK(${roleRange})`, standard: "0であること", evaluate: (rows) => rows.filter((row) => row.role === "").length },
  { key: "missingReasons", label: "理由未入力", formula: "COUNTBLANK('Peer Roles'!$D$5:$D$16)", standard: "0であること", evaluate: (rows) => rows.filter((row) => row.rationale === "").length },
  {
    key: "duplicateIds",
    label: "ID重複",
    formula: "SUMPRODUCT((COUNTIF('Peer Roles'!$A$5:$A$16,'Peer Roles'!$A$5:$A$16)>1)*1)",
    standard: "0であること",
    evaluate: (rows) => {
      const counts = new Map<string, number>();
      rows.forEach((row) => counts.set(row.id, (counts.get(row.id) ?? 0) + 1));
      return rows.filter((row) => (counts.get(row.id) ?? 0) > 1).length;
    },
  },
  { key: "coreCritical", label: "Core＋重大不一致", formula: `COUNTIFS(${roleRange},"core_peer",'Peer Roles'!$G$5:$G$16,TRUE)`, standard: "0であること", evaluate: (rows) => rows.filter((row) => row.role === "core_peer" && row.criticalMismatch).length },
  { key: "coreDataGap", label: "Core＋データ欠損", formula: `COUNTIFS(${roleRange},"core_peer",'Peer Roles'!$H$5:$H$16,"?*")`, standard: "0であること", evaluate: (rows) => rows.filter((row) => row.role === "core_peer" && row.dataGaps !== "").length },
  { key: "coreBlocked", label: "Core適格性ブロック", formula: `COUNTIFS(${roleRange},"core_peer",'Peer Roles'!$I$5:$I$16,TRUE)`, standard: "0であること", evaluate: (rows) => rows.filter((row) => row.role === "core_peer" && row.coreEligibilityBlocked).length },
  { key: "corePeers", label: "Core Peer数", formula: `COUNTIF(${roleRange},"core_peer")`, standard: "5〜8社を目安", evaluate: (rows) => rows.filter((row) => row.role === "core_peer").length },
  { key: "candidateCount", label: "候補社数", formula: "COUNTA('Peer Roles'!$A$5:$A$16)", standard: "12社であること", evaluate: (rows) => rows.filter((row) => row.id !== "").length },
];

export function evaluatePeerRoleControls(rows: PeerRoleControlRow[]): Record<PeerRoleControlKey, number> {
  return Object.fromEntries(peerRoleControls.map((control) => [control.key, control.evaluate(rows)])) as Record<PeerRoleControlKey, number>;
}
