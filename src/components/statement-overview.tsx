export type StatementRow = {
  section: string;
  account: string;
  meaning: string;
  calculation: string;
  assumption: string;
  excel: string;
};

export function StatementOverview({ rows }: { rows: StatementRow[] }) {
  return <div className="data-scroll"><table className="data-table min-w-[1180px]"><thead><tr><th className="w-24">区分</th><th className="w-40">勘定科目</th><th>どういう内容か</th><th>どう求めるか</th><th>どう前提を置くか</th><th className="w-64">Excelでの計算例</th></tr></thead><tbody>{rows.map((row)=><tr key={`${row.section}-${row.account}`}><td>{row.section}</td><td><strong>{row.account}</strong></td><td>{row.meaning}</td><td>{row.calculation}</td><td>{row.assumption}</td><td className="font-mono text-xs">{row.excel}</td></tr>)}</tbody></table></div>;
}
