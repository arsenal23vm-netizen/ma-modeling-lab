import {
  buildSensitivityMatrix,
  calculateDcf,
  calculateEquityBridge,
  calculateFcff,
  calculateWacc,
  dcfCase,
  type SensitivityRow,
} from "@/data/dcf-series";

const money = (value: number) => value.toLocaleString("ja-JP", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percent = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`;

function FigureFrame({
  caption,
  formula,
  children,
}: {
  caption: string;
  formula: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="dcf-figure">
      <figcaption>{caption}</figcaption>
      <div className="sheet-tabs" aria-hidden="true"><span className="active">DCF</span><span>Checks</span></div>
      <div className="formula-bar"><span>fx</span><code>{formula}</code></div>
      {children}
    </figure>
  );
}

export function FcffFigure() {
  return (
    <FigureFrame caption="FCFF予測（単位：百万円、FY2026–FY2030）" formula="=B8*(1-B9)+B10-B11-B12">
      <div className="data-scroll">
        <table className="data-table dcf-sheet min-w-[860px]">
          <caption>サンプル部品株式会社のFCFF計算表。すべて百万円単位。</caption>
          <thead><tr><th scope="col">年度末</th><th scope="col" className="number">EBIT（百万円）</th><th scope="col" className="number">税率（%）</th><th scope="col" className="number">D&amp;A（百万円）</th><th scope="col" className="number">Capex（百万円）</th><th scope="col" className="number">NWC増加（百万円）</th><th scope="col" className="number">FCFF（百万円）</th></tr></thead>
          <tbody>{dcfCase.forecasts.map((row) => <tr key={row.year}><th scope="row">{row.year}</th><td className="number">{money(row.ebit)}</td><td className="number">{percent(row.taxRate)}</td><td className="number">{money(row.depreciation)}</td><td className="number">({money(row.capex)})</td><td className="number">({money(row.increaseInNwc)})</td><td className="number dcf-output">{money(calculateFcff(row))}</td></tr>)}</tbody>
        </table>
      </div>
    </FigureFrame>
  );
}

export function WaccFigure() {
  const costOfEquity = dcfCase.wacc.riskFreeRate + dcfCase.wacc.beta * dcfCase.wacc.equityRiskPremium;
  const afterTaxDebtCost = dcfCase.wacc.preTaxCostOfDebt * (1 - dcfCase.wacc.taxRate);
  const wacc = calculateWacc(dcfCase.wacc);
  return (
    <FigureFrame caption="WACC計算（率はすべて年率）" formula="=B8*B11+B9*B12">
      <div className="data-scroll">
        <table className="data-table dcf-sheet min-w-[620px]">
          <caption>株主資本コストと税引後負債コストを目標資本構成で加重したWACC。</caption>
          <thead><tr><th scope="col">資本</th><th scope="col" className="number">コスト（%）</th><th scope="col" className="number">構成比（%）</th><th scope="col" className="number">寄与度（%）</th></tr></thead>
          <tbody><tr><th scope="row">株主資本</th><td className="number">{percent(costOfEquity, 2)}</td><td className="number">{percent(dcfCase.wacc.equityWeight)}</td><td className="number">{percent(costOfEquity * dcfCase.wacc.equityWeight, 2)}</td></tr><tr><th scope="row">有利子負債</th><td className="number">{percent(afterTaxDebtCost, 2)}</td><td className="number">{percent(dcfCase.wacc.debtWeight)}</td><td className="number">{percent(afterTaxDebtCost * dcfCase.wacc.debtWeight, 2)}</td></tr></tbody>
          <tfoot><tr><th scope="row">合計 / WACC</th><td className="number">—</td><td className="number">{percent(dcfCase.wacc.equityWeight + dcfCase.wacc.debtWeight)}</td><td className="number dcf-output">{percent(wacc, 2)}</td></tr></tfoot>
        </table>
      </div>
    </FigureFrame>
  );
}

export function TerminalValueFigure() {
  const valuation = calculateDcf(dcfCase);
  const terminalShare = valuation.pvTerminalValue / valuation.enterpriseValue;
  return (
    <FigureFrame caption="継続価値と企業価値の構成（単位：百万円、各年度末割引）" formula="=B8*(1+B9)/(B10-B9)">
      <div className="data-scroll">
        <table className="data-table dcf-sheet min-w-[620px]">
          <caption>Gordon Growth法による期末時点の継続価値と現在価値への割引。</caption>
          <thead><tr><th scope="col">計算項目</th><th scope="col" className="number">金額（百万円）</th><th scope="col" className="number">企業価値構成比（%）</th></tr></thead>
          <tbody><tr><th scope="row">明示予測期間のFCFF現在価値</th><td className="number">{money(valuation.pvExplicitFcff)}</td><td className="number">{percent(valuation.pvExplicitFcff / valuation.enterpriseValue)}</td></tr><tr><th scope="row">継続価値（FY2030期末時点）</th><td className="number">{money(valuation.terminalValue)}</td><td className="number">割引前</td></tr><tr><th scope="row">継続価値の現在価値</th><td className="number">{money(valuation.pvTerminalValue)}</td><td className="number dcf-output">{percent(terminalShare)}</td></tr></tbody>
          <tfoot><tr><th scope="row">Enterprise Value</th><td className="number dcf-output">{money(valuation.enterpriseValue)}</td><td className="number">100.0%</td></tr></tfoot>
        </table>
      </div>
    </FigureFrame>
  );
}

export function SensitivityFigure({ matrix = buildSensitivityMatrix(dcfCase) }: { matrix?: SensitivityRow[] }) {
  const growthRates = matrix[0]?.cells.map((cell) => cell.terminalGrowthRate) ?? [];
  const baseWacc = calculateWacc(dcfCase.wacc);
  const nearestBaseWacc = dcfCase.sensitivity.waccRates.reduce((nearest, rate) =>
    Math.abs(rate - baseWacc) < Math.abs(nearest - baseWacc) ? rate : nearest,
  );
  return (
    <FigureFrame caption="WACC × Terminal Growth 感応度（Enterprise Value、単位：百万円）" formula="=TABLE($B$4,$B$3)">
      <div className="data-scroll">
        <table className="data-table dcf-sheet sensitivity-sheet min-w-[720px]">
          <caption>WACCを行、永久成長率を列に置いた企業価値の感応度表。</caption>
          <thead><tr><th scope="col">WACC \ Terminal Growth</th>{growthRates.map((growth) => <th scope="col" className="number" key={growth}>{percent(growth)}</th>)}</tr></thead>
          <tbody>{matrix.map((row) => <tr key={row.wacc}><th scope="row">{percent(row.wacc)}</th>{row.cells.map((cell) => {
            const invalid = cell.status === "N/A" || cell.enterpriseValue === null;
            return <td data-sensitivity-status={invalid ? "invalid" : undefined} className={`number ${row.wacc === nearestBaseWacc && cell.terminalGrowthRate === dcfCase.terminalGrowthRate ? "dcf-output" : ""}`} key={cell.terminalGrowthRate}>{invalid ? "N/A" : money(cell.enterpriseValue!)}</td>;
          })}</tr>)}</tbody>
          <tfoot><tr><th scope="row">入力ガード</th><td colSpan={growthRates.length}>WACC ≤ g のセルは N/A</td></tr></tfoot>
        </table>
      </div>
    </FigureFrame>
  );
}

export function EnterpriseToEquityFigure() {
  const valuation = calculateDcf(dcfCase);
  const bridge = calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge);
  const rows = [
    ["Enterprise Value", valuation.enterpriseValue, "+"],
    ["Cash", bridge.cash, "+"],
    ["Debt", bridge.debt, "−"],
    ["Debt-like Items", bridge.debtLikeItems, "−"],
    ["Non-controlling Interests", bridge.nonControllingInterests, "−"],
  ] as const;
  return (
    <FigureFrame caption="EV-to-Equity Bridge（単位：百万円）" formula="=B8+B9-B10-B11-B12">
      <div className="data-scroll">
        <table className="data-table dcf-sheet min-w-[620px]">
          <caption>企業価値から現金、負債、負債類似項目、非支配株主持分を調整する株主価値ブリッジ。</caption>
          <thead><tr><th scope="col">調整項目</th><th scope="col">符号</th><th scope="col" className="number">金額（百万円）</th></tr></thead>
          <tbody>{rows.map(([label, value, sign]) => <tr key={label}><th scope="row">{label}</th><td>{sign}</td><td className="number">{sign === "−" ? `(${money(value)})` : money(value)}</td></tr>)}</tbody>
          <tfoot><tr><th scope="row">Equity Value</th><td>=</td><td className="number dcf-output">{money(bridge.equityValue)}</td></tr></tfoot>
        </table>
      </div>
    </FigureFrame>
  );
}
