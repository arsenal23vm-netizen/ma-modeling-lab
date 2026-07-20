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

assert.equal(dcfCase.forecasts.length, 5);
assert.ok(
  dcfCase.forecasts
    .map(calculateFcff)
    .every((fcff, index) => Math.abs(fcff - [76.8, 91.1, 104.1, 116.5, 132.3][index]) < 1e-9),
);
assert.equal(Number(calculateWacc(dcfCase.wacc).toFixed(4)), 0.0651);
assert.throws(() => calculateTerminalValue(100, 0.015, 0.015), /WACC must exceed/);

const valuation = calculateDcf(dcfCase);
assert.equal(
  valuation.pvExplicitFcff,
  dcfCase.forecasts.reduce(
    (total, forecast, index) => total + calculateFcff(forecast) / (1 + valuation.wacc) ** (index + 1),
    0,
  ),
);
assert.equal(valuation.enterpriseValue, valuation.pvExplicitFcff + valuation.pvTerminalValue);
assert.equal(
  calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge).equityValue,
  valuation.enterpriseValue +
    dcfCase.bridge.cash -
    dcfCase.bridge.debt -
    dcfCase.bridge.debtLikeItems -
    dcfCase.bridge.nonControllingInterests,
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
