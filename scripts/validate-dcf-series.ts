import assert from "node:assert/strict";
import {
  buildSensitivityMatrix,
  calculateDcf,
  calculateEquityBridge,
  calculateFcff,
  calculateTerminalValue,
  calculateWacc,
  dcfCase,
} from "../src/data/dcf-series";

const EPSILON = 1e-9;
const nearlyEqual = (actual: number, expected: number) => Math.abs(actual - expected) < EPSILON;

assert.equal(dcfCase.forecasts.length, 5);
assert.ok(
  dcfCase.forecasts
    .map(calculateFcff)
    .every((fcff, index) => nearlyEqual(fcff, [76.8, 91.1, 104.1, 116.5, 132.3][index])),
);
assert.equal(dcfCase.wacc.riskFreeRate, 0.015);
assert.equal(dcfCase.wacc.equityRiskPremium, 0.06);
assert.equal(dcfCase.wacc.beta, 1.1);
assert.equal(dcfCase.wacc.preTaxCostOfDebt, 0.025);
assert.equal(dcfCase.wacc.taxRate, 0.3);
assert.equal(dcfCase.wacc.equityWeight, 0.75);
assert.equal(dcfCase.wacc.debtWeight, 0.25);
assert.ok(nearlyEqual(dcfCase.wacc.equityWeight + dcfCase.wacc.debtWeight, 1));
assert.ok(nearlyEqual(calculateWacc(dcfCase.wacc), 0.065125));
assert.throws(() => calculateTerminalValue(100, 0.015, 0.015), /WACC must exceed/);

const valuation = calculateDcf(dcfCase);
assert.ok(
  nearlyEqual(
    valuation.pvExplicitFcff,
    dcfCase.forecasts.reduce(
      (total, forecast, index) => total + calculateFcff(forecast) / (1 + valuation.wacc) ** (index + 1),
      0,
    ),
  ),
);
assert.ok(
  nearlyEqual(
    valuation.pvTerminalValue,
    valuation.terminalValue / (1 + valuation.wacc) ** dcfCase.forecasts.length,
  ),
);
assert.ok(nearlyEqual(valuation.enterpriseValue, valuation.pvExplicitFcff + valuation.pvTerminalValue));
assert.ok(
  nearlyEqual(
    calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge).equityValue,
    valuation.enterpriseValue +
      dcfCase.bridge.cash -
      dcfCase.bridge.debt -
      dcfCase.bridge.debtLikeItems -
      dcfCase.bridge.nonControllingInterests,
  ),
);

const sensitivity = buildSensitivityMatrix(dcfCase);
assert.deepEqual(sensitivity.map((row) => row.cells.length), [5, 5, 5, 5, 5]);
assert.ok(sensitivity[0].cells[4].enterpriseValue! > sensitivity[0].cells[0].enterpriseValue!);
assert.ok(sensitivity[0].cells[0].enterpriseValue! > sensitivity[4].cells[0].enterpriseValue!);

const invalidSensitivity = buildSensitivityMatrix({
  ...dcfCase,
  sensitivity: {
    waccRates: [0.015, 0.06, 0.065, 0.07, 0.075],
    terminalGrowthRates: [0.005, 0.01, 0.015, 0.02, 0.025],
  },
});
assert.equal(invalidSensitivity[0].cells[2].enterpriseValue, null);
assert.equal(invalidSensitivity[0].cells[2].status, "N/A");

console.log("DCF series validation passed");
