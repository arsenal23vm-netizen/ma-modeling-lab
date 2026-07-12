type Cell = {
  address: string;
  label: string;
  kind: "input" | "formula" | "link" | "check" | "error";
};

const cells: Cell[] = [
  { address: "H8", label: "販売数量", kind: "input" },
  { address: "H9", label: "平均単価", kind: "input" },
  { address: "H10", label: "=H8*H9", kind: "formula" },
  { address: "H12", label: "=Assumptions!H20", kind: "link" },
  { address: "H30", label: "BS一致 OK", kind: "check" },
  { address: "H31", label: "CF差額 0", kind: "check" },
];

const kindLabel: Record<Cell["kind"], string> = {
  input: "入力",
  formula: "同一シート数式",
  link: "他シート参照",
  check: "チェック",
  error: "エラー",
};

export function ExcelWorksheetDiagram() {
  return (
    <figure className="my-8 overflow-hidden border border-[#d8e0e5] bg-white">
      <figcaption className="border-b border-[#d8e0e5] bg-[#f7f8f6] px-4 py-3 text-sm font-bold text-[#102235]">
        Excelワークシート図解：色とラベルでセル種別を区別
      </figcaption>
      <div className="border-b border-[#d8e0e5] bg-white px-4 py-3 font-mono text-sm text-[#334456]">
        数式バー： <span className="text-[#217346]">=Assumptions!H20</span>
      </div>
      <div className="data-scroll border-0">
        <table className="data-table min-w-[760px]" aria-describedby="excel-diagram-legend">
          <thead>
            <tr>
              <th>行</th>
              <th>G / FY2025実績</th>
              <th>H / FY2026予測</th>
              <th>I / FY2027予測</th>
              <th>J / FY2028予測</th>
            </tr>
          </thead>
          <tbody>
            {[8, 9, 10, 12, 30, 31].map((row, index) => {
              const cell = cells[index];
              return (
                <tr key={row}>
                  <td className="font-mono">{row}</td>
                  <td className="text-[#607080]">実績値</td>
                  <td className={`cell-${cell.kind}`}>
                    <strong>{cell.address}</strong>｜{kindLabel[cell.kind]}｜{cell.label}
                  </td>
                  <td className={cell.kind === "input" ? "cell-input" : "cell-formula"}>{cell.kind === "input" ? "前提入力" : "横コピー"}</td>
                  <td className={cell.kind === "check" ? "cell-check" : "cell-formula"}>{cell.kind === "check" ? "OK / 差額0" : "横コピー"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div id="excel-diagram-legend" className="grid gap-2 border-t border-[#d8e0e5] p-4 text-xs md:grid-cols-4">
        <span className="cell-input px-2 py-1">青：入力セル</span>
        <span className="cell-formula px-2 py-1">黒：同一シート数式</span>
        <span className="cell-link px-2 py-1">緑：他シート参照</span>
        <span className="cell-check px-2 py-1">チェック：OK/差額表示</span>
      </div>
      <div className="flex gap-2 border-t border-[#d8e0e5] bg-[#f7f8f6] px-4 py-3 text-xs">
        <span className="rounded-t border border-[#d8e0e5] bg-white px-3 py-1">Inputs</span>
        <span className="rounded-t border border-[#d8e0e5] bg-white px-3 py-1">PL</span>
        <span className="rounded-t border border-[#d8e0e5] bg-white px-3 py-1">BS</span>
        <span className="rounded-t border border-[#d8e0e5] bg-white px-3 py-1">Checks</span>
      </div>
    </figure>
  );
}
