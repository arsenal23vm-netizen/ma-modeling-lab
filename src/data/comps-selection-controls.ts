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

const roleRange = "'比較上の位置づけ'!$C$5:$C$16";

export const peerRoleControls: PeerRoleControl[] = [
  { key: "missingRoles", label: "位置づけ未入力", formula: `COUNTBLANK(${roleRange})`, standard: "0であること", evaluate: (rows) => rows.filter((row) => row.role === "").length },
  { key: "missingReasons", label: "理由未入力", formula: "COUNTBLANK('比較上の位置づけ'!$D$5:$D$16)", standard: "0であること", evaluate: (rows) => rows.filter((row) => row.rationale === "").length },
  {
    key: "duplicateIds",
    label: "ID重複",
    formula: "SUMPRODUCT((COUNTIF('比較上の位置づけ'!$A$5:$A$16,'比較上の位置づけ'!$A$5:$A$16)>1)*1)",
    standard: "0であること",
    evaluate: (rows) => {
      const counts = new Map<string, number>();
      rows.forEach((row) => counts.set(row.id, (counts.get(row.id) ?? 0) + 1));
      return rows.filter((row) => (counts.get(row.id) ?? 0) > 1).length;
    },
  },
  { key: "coreCritical", label: "主要比較会社・重大不一致", formula: `COUNTIFS(${roleRange},"主要比較会社",'比較上の位置づけ'!$G$5:$G$16,TRUE)`, standard: "0であること", evaluate: (rows) => rows.filter((row) => row.role === "主要比較会社" && row.criticalMismatch).length },
  { key: "coreDataGap", label: "主要比較会社・データ欠損", formula: `COUNTIFS(${roleRange},"主要比較会社",'比較上の位置づけ'!$H$5:$H$16,"?*")`, standard: "0であること", evaluate: (rows) => rows.filter((row) => row.role === "主要比較会社" && row.dataGaps !== "").length },
  { key: "coreBlocked", label: "主要比較会社への採用不可", formula: `COUNTIFS(${roleRange},"主要比較会社",'比較上の位置づけ'!$I$5:$I$16,TRUE)`, standard: "0であること", evaluate: (rows) => rows.filter((row) => row.role === "主要比較会社" && row.coreEligibilityBlocked).length },
  { key: "corePeers", label: "主要比較会社数", formula: `COUNTIF(${roleRange},"主要比較会社")`, standard: "5〜8社を目安", evaluate: (rows) => rows.filter((row) => row.role === "主要比較会社").length },
  { key: "candidateCount", label: "候補社数", formula: "COUNTA('比較上の位置づけ'!$A$5:$A$16)", standard: "12社であること", evaluate: (rows) => rows.filter((row) => row.id !== "").length },
];

export function evaluatePeerRoleControls(rows: PeerRoleControlRow[]): Record<PeerRoleControlKey, number> {
  return Object.fromEntries(peerRoleControls.map((control) => [control.key, control.evaluate(rows)])) as Record<PeerRoleControlKey, number>;
}
