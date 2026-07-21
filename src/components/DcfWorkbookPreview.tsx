import { buildSensitivityMatrix, calculateDcf, calculateEquityBridge, calculateFcff, dcfCase } from "@/data/dcf-series";

const money = (value: number) => value.toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function DcfWorkbookPreview() {
  const valuation = calculateDcf(dcfCase);
  const bridge = calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge);
  const sensitivity = buildSensitivityMatrix(dcfCase);

  return (
    <figure className="dcf-workbook-preview">
      <figcaption>DCFシート：期末割引によるEnterprise ValueとEquity Value</figcaption>
      <div className="dcf-workbook-legend" aria-label="セルの凡例">
        <span className="legend-input">青セル：入力</span>
        <span className="legend-formula">計算セル：数式</span>
        <span className="legend-output">出力セル：評価結果</span>
      </div>
      <p className="mt-3 text-sm text-[#607080]">
        青いWACC前提は <code>Inputs!B19:B21</code>（Equity Weight、Debt Weight、Terminal Growth）で編集します。
        <code>DCF!B25:G25</code> は感応度表の見出しと横軸値であり、基本ケースの入力セルではありません。
      </p>
      <div className="workbook-formula-bar" aria-label="数式バー">
        <span className="cell-reference">B12</span><span className="fx" aria-hidden="true">fx</span>
        <code>=IF(Assumptions!$B$11&lt;=Assumptions!$B$12,NA(),B11/(Assumptions!$B$11-Assumptions!$B$12))</code>
      </div>
      <div className="data-scroll">
        <table className="data-table workbook-preview-sheet min-w-[840px]">
          <caption>DCFワークシートのプレビュー。行・列見出し、数式、入力セル、評価結果を表示。</caption>
          <thead>
            <tr className="excel-column-letters"><th scope="col" aria-label="行番号" /><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th><th scope="col">D</th><th scope="col">E</th><th scope="col">F</th><th scope="col">G</th></tr>
            <tr><th scope="col" className="row-number">4</th><th scope="col">Valuation</th>{dcfCase.forecasts.map((forecast) => <th scope="col" key={forecast.year}>{forecast.year}</th>)}<th scope="col" aria-label="未使用列" /></tr>
          </thead>
          <tbody>
            <tr><th scope="row" className="row-number">5</th><th scope="row">FCFF</th>{dcfCase.forecasts.map((forecast) => <td className="workbook-formula number" key={forecast.year}>{money(calculateFcff(forecast))}</td>)}<td /></tr>
            <tr><th scope="row" className="row-number">11</th><th scope="row">FCFF (n+1)</th><td className="workbook-formula number" colSpan={6}>{money(calculateFcff(dcfCase.forecasts[4]) * (1 + dcfCase.terminalGrowthRate))}</td></tr>
            <tr><th scope="row" className="row-number">12</th><th scope="row">Terminal Value</th><td className="workbook-formula number" colSpan={6}>{money(valuation.terminalValue)}</td></tr>
            <tr><th scope="row" className="row-number">14</th><th scope="row">Enterprise Value</th><td className="workbook-output number" colSpan={6}>{money(valuation.enterpriseValue)}</td></tr>
            <tr><th scope="row" className="row-number">20</th><th scope="row">Equity Value</th><td className="workbook-output number" colSpan={6}>{money(bridge.equityValue)}</td></tr>
            <tr><th scope="row" className="row-number">24</th><th scope="row" colSpan={7}>Enterprise Value Sensitivity</th></tr>
            <tr><th scope="row" className="row-number">25</th><td /><th scope="col">WACC / g</th>{dcfCase.sensitivity.terminalGrowthRates.map((growth) => <th scope="col" className="workbook-formula number" key={growth}>{(growth * 100).toFixed(1)}%</th>)}</tr>
            {sensitivity.map((row, index) => <tr key={row.wacc}><th scope="row" className="row-number">{26 + index}</th><td /><th scope="row" className="workbook-formula number">{(row.wacc * 100).toFixed(1)}%</th>{row.cells.map((cell) => <td className="workbook-formula number" key={cell.terminalGrowthRate}>{cell.enterpriseValue === null ? "N/A" : money(cell.enterpriseValue)}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <ul className="workbook-sheet-tabs" aria-label="ワークシートタブ">
        {["Cover", "Inputs", "Assumptions", "PL", "BS", "CF", "Schedules", "DCF", "Checks"].map((sheet) => (
          <li key={sheet} className={sheet === "DCF" ? "active" : undefined}>{sheet}</li>
        ))}
      </ul>
    </figure>
  );
}
