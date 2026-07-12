type Entry = {
  title: string;
  transaction: string;
  debit: string;
  credit: string;
  impact: string;
  excel: string;
  caution: string;
};

export function JournalEntryCard({ entry }: { entry: Entry }) {
  return (
    <article className="border border-[#d8e0e5] bg-white p-5">
      <h2 className="text-xl font-bold text-[#102235]">{entry.title}</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-[.7fr_1fr]">
        <div className="callout m-0">
          <strong>取引内容</strong>
          <br />
          {entry.transaction}
        </div>
        <div className="data-scroll">
          <table className="data-table min-w-[520px]">
            <thead><tr><th>借方</th><th>貸方</th></tr></thead>
            <tbody><tr><td>{entry.debit}</td><td>{entry.credit}</td></tr></tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <section><h3 className="text-sm font-bold text-[#147d73]">PL・BS・CFへの影響</h3><p className="mt-1 text-sm text-[#607080]">{entry.impact}</p></section>
        <section><h3 className="text-sm font-bold text-[#147d73]">Excelの入力・参照先</h3><p className="mt-1 font-mono text-sm text-[#607080]">{entry.excel}</p></section>
        <section><h3 className="text-sm font-bold text-[#147d73]">モデル上の注意点</h3><p className="mt-1 text-sm text-[#607080]">{entry.caution}</p></section>
      </div>
    </article>
  );
}
