export type DcfForecast = {
  year: string;
  revenue: number;
  ebit: number;
  taxRate: number;
  depreciation: number;
  capex: number;
  increaseInNwc: number;
};

export type WaccInputs = {
  riskFreeRate: number;
  equityRiskPremium: number;
  beta: number;
  preTaxCostOfDebt: number;
  taxRate: number;
  equityWeight: number;
  debtWeight: number;
};

export type EquityBridgeInputs = {
  cash: number;
  debt: number;
  debtLikeItems: number;
  nonControllingInterests: number;
};

export type SensitivityAssumptions = {
  waccRates: number[];
  terminalGrowthRates: number[];
};

export type DcfCase = {
  forecasts: DcfForecast[];
  wacc: WaccInputs;
  terminalGrowthRate: number;
  bridge: EquityBridgeInputs;
  sensitivity: SensitivityAssumptions;
};

export type DcfValuation = {
  wacc: number;
  fcff: number[];
  terminalValue: number;
  pvExplicitFcff: number;
  pvTerminalValue: number;
  enterpriseValue: number;
};

export type EquityBridge = EquityBridgeInputs & {
  enterpriseValue: number;
  equityValue: number;
};

export type SensitivityCell = {
  terminalGrowthRate: number;
  enterpriseValue: number | null;
  status: "valid" | "N/A";
};

export type SensitivityRow = {
  wacc: number;
  cells: SensitivityCell[];
};

export const calculateFcff = (row: DcfForecast) =>
  row.ebit * (1 - row.taxRate) + row.depreciation - row.capex - row.increaseInNwc;

export const calculateWacc = (input: WaccInputs) =>
  input.equityWeight * (input.riskFreeRate + input.beta * input.equityRiskPremium) +
  input.debtWeight * input.preTaxCostOfDebt * (1 - input.taxRate);

export function calculateTerminalValue(finalFcff: number, wacc: number, growth: number) {
  if (wacc <= growth) throw new Error("WACC must exceed terminal growth");
  return (finalFcff * (1 + growth)) / (wacc - growth);
}

const calculateDcfAtRates = (caseData: DcfCase, wacc: number, terminalGrowthRate: number): DcfValuation => {
  const fcff = caseData.forecasts.map(calculateFcff);
  const pvExplicitFcff = fcff.reduce(
    (total, value, index) => total + value / (1 + wacc) ** (index + 1),
    0,
  );
  const terminalValue = calculateTerminalValue(fcff[fcff.length - 1], wacc, terminalGrowthRate);
  const pvTerminalValue = terminalValue / (1 + wacc) ** caseData.forecasts.length;

  return {
    wacc,
    fcff,
    terminalValue,
    pvExplicitFcff,
    pvTerminalValue,
    enterpriseValue: pvExplicitFcff + pvTerminalValue,
  };
};

export const calculateDcf = (caseData: DcfCase): DcfValuation =>
  calculateDcfAtRates(caseData, calculateWacc(caseData.wacc), caseData.terminalGrowthRate);

export const calculateEquityBridge = (
  enterpriseValue: number,
  bridge: EquityBridgeInputs,
): EquityBridge => ({
  enterpriseValue,
  ...bridge,
  equityValue:
    enterpriseValue + bridge.cash - bridge.debt - bridge.debtLikeItems - bridge.nonControllingInterests,
});

export const buildSensitivityMatrix = (caseData: DcfCase): SensitivityRow[] =>
  caseData.sensitivity.waccRates.map((wacc) => ({
    wacc,
    cells: caseData.sensitivity.terminalGrowthRates.map((terminalGrowthRate) => {
      if (wacc <= terminalGrowthRate) {
        return { terminalGrowthRate, enterpriseValue: null, status: "N/A" };
      }

      return {
        terminalGrowthRate,
        enterpriseValue: calculateDcfAtRates(caseData, wacc, terminalGrowthRate).enterpriseValue,
        status: "valid",
      };
    }),
  }));

export const dcfCase: DcfCase = {
  forecasts: [
    { year: "2026年度", revenue: 1100, ebit: 120, taxRate: 0.3, depreciation: 30, capex: 30, increaseInNwc: 7.2 },
    { year: "2027年度", revenue: 1200, ebit: 140, taxRate: 0.3, depreciation: 32, capex: 32, increaseInNwc: 6.9 },
    { year: "2028年度", revenue: 1320, ebit: 160, taxRate: 0.3, depreciation: 34, capex: 34, increaseInNwc: 7.9 },
    { year: "2029年度", revenue: 1452, ebit: 180, taxRate: 0.3, depreciation: 36, capex: 36, increaseInNwc: 9.5 },
    { year: "2030年度", revenue: 1597.2, ebit: 200, taxRate: 0.3, depreciation: 38, capex: 38, increaseInNwc: 7.7 },
  ],
  wacc: {
    riskFreeRate: 0.015,
    equityRiskPremium: 0.06,
    beta: 1.1,
    preTaxCostOfDebt: 0.025,
    taxRate: 0.3,
    equityWeight: 0.75,
    debtWeight: 0.25,
  },
  terminalGrowthRate: 0.015,
  bridge: { cash: 100, debt: 350, debtLikeItems: 20, nonControllingInterests: 10 },
  sensitivity: {
    waccRates: [0.055, 0.06, 0.065, 0.07, 0.075],
    terminalGrowthRates: [0.005, 0.01, 0.015, 0.02, 0.025],
  },
};
