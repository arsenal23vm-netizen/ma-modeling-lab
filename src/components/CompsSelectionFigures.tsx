import type { CandidatePeer, PeerRole, SelectionCriterion, TargetProfile } from "@/data/comps-selection";

const roleDetails: Record<PeerRole, { label: string; note: string }> = {
  core_peer: { label: "中核（Core）", note: "バリュエーションの中心レンジ" },
  secondary_peer: { label: "補助（Secondary）", note: "補助的な比較対象" },
  aspirational_peer: { label: "将来像（Aspirational）", note: "改善余地の参考" },
  negative_peer: { label: "不採用例（Negative）", note: "除外判断の比較対象" },
  excluded_close_peer: { label: "近接除外", note: "情報不足の近似企業" },
  not_clean_comp: { label: "比較限定", note: "事業構成が異なる参考企業" },
};

const funnelSteps = [
  ["業種候補", 30, "業界・事業領域から抽出"],
  ["事業モデル", 18, "事業モデルと顧客市場を確認"],
  ["財務比較", 12, "規模・成長性・収益性を比較"],
  ["Core", 6, "評価に採用する中核企業"],
] as const;

const formatNumber = (value: number) => new Intl.NumberFormat("ja-JP").format(value);
const scoreAverage = (peer: CandidatePeer) => {
  const availableScores = Object.entries(peer.scores)
    .filter(([criterion]) => !peer.dataGaps.includes(criterion as keyof typeof peer.scores))
    .map(([, score]) => score);
  return availableScores.reduce<number>((total, score) => total + score, 0) / availableScores.length;
};

export function SelectionFunnel() {
  return (
    <figure className="selection-funnel" aria-labelledby="selection-funnel-title">
      <figcaption id="selection-funnel-title">比較対象の絞り込みプロセス</figcaption>
      <ol>
        {funnelSteps.map(([label, count, note], index) => (
          <li key={label} style={{ "--funnel-width": `${100 - index * 18}%` } as React.CSSProperties}>
            <span className="funnel-count">{count}社</span>
            <span>
              <strong>{label}</strong>
              <small>{note}</small>
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function TargetComparisonCards({ target, peers }: { target: TargetProfile; peers: CandidatePeer[] }) {
  const comparisonRoles: PeerRole[] = ["core_peer", "secondary_peer", "negative_peer"];

  return (
    <section className="target-comparison" aria-labelledby="target-comparison-title">
      <h3 id="target-comparison-title">対象会社と比較対象の位置づけ</h3>
      <div className="target-comparison-grid">
        <article className="target-card target-card-featured">
          <p className="comparison-kicker">対象会社</p>
          <h4>{target.name}</h4>
          <p>{target.business}</p>
          <dl>
            <div><dt>売上高</dt><dd>{formatNumber(target.revenue)} {target.unit}</dd></div>
            <div><dt>EBITDA margin</dt><dd>{target.ebitdaMargin.toFixed(1)}%</dd></div>
            <div><dt>成長率</dt><dd>N/A</dd></div>
            <div><dt>メンテナンス・サービス比率</dt><dd>{target.serviceSales}%</dd></div>
          </dl>
        </article>
        {comparisonRoles.map((role) => {
          const peer = peers.find((candidate) => candidate.role === role);
          if (!peer) return null;
          return (
            <article className={`target-card role-${role}`} key={role}>
              <p className="comparison-kicker">{roleDetails[role].label} peer</p>
              <h4>{peer.name}</h4>
              <p>{peer.business}</p>
              <dl>
                <div><dt>売上高</dt><dd>{formatNumber(peer.revenue)} {target.unit}</dd></div>
                <div><dt>EBITDA margin</dt><dd>{peer.ebitdaMargin === null ? "N/A" : `${peer.ebitdaMargin.toFixed(1)}%`}</dd></div>
                <div><dt>成長率</dt><dd>{peer.growth}%</dd></div>
                <div><dt>メンテナンス・サービス比率</dt><dd>{peer.serviceMix}%</dd></div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function PeerRoleMap({ peers }: { peers: CandidatePeer[] }) {
  const roleOrder: PeerRole[] = ["core_peer", "secondary_peer", "aspirational_peer", "negative_peer", "excluded_close_peer", "not_clean_comp"];

  return (
    <section className="peer-role-map" aria-labelledby="peer-role-map-title">
      <h3 id="peer-role-map-title">Peer role map</h3>
      <p>各社の役割と、評価レンジでの扱いを明示します。</p>
      <div className="peer-role-list">
        {roleOrder.map((role) => {
          const rolePeers = peers.filter((peer) => peer.role === role);
          return (
            <article className="peer-role-group" key={role}>
              <h4><span className={`peer-role-chip role-${role}`}>{roleDetails[role].label}</span></h4>
              <p>{roleDetails[role].note}</p>
              <ul>
                {rolePeers.map((peer) => (
                  <li key={peer.id} className={peer.criticalMismatch ? "peer-warning" : undefined}>
                    <span>{peer.name}</span>
                    {peer.criticalMismatch && <strong>要注意</strong>}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ExcelSelectionMatrix({ peers, criteria }: { peers: CandidatePeer[]; criteria: SelectionCriterion[] }) {
  const descriptionId = "selection-matrix-description";

  return (
    <figure className="selection-matrix" aria-labelledby="selection-matrix-caption" aria-describedby={descriptionId}>
      <figcaption id="selection-matrix-caption">比較対象選定マトリクス</figcaption>
      <p id={descriptionId}>スコアは 0 点（不適合）から 3 点（高い適合性）です。Close peer は情報不足のため N/A を表示します。</p>
      <div className="sheet-tabs" aria-label="ワークシートタブ">
        <span>候補一覧</span><span className="active">選定スコア</span><span>注記</span>
      </div>
      <div className="formula-bar" aria-label="数式バー">
        <span>fx</span>
        <code>=AVERAGE(D2:O2)</code>
      </div>
      <div className="data-scroll">
        <table className="data-table" aria-label="比較対象選定マトリクス">
          <thead>
            <tr className="excel-column-letters">
              <th aria-label="行番号" />
              {Array.from({ length: criteria.length + 3 }, (_, index) => <th key={index}>{String.fromCharCode(65 + index)}</th>)}
            </tr>
            <tr>
              <th scope="col" className="row-number">1</th>
              <th scope="col">候補会社</th>
              <th scope="col">役割</th>
              {criteria.map((criterion) => <th scope="col" key={criterion.id}>{criterion.label}</th>)}
              <th scope="col" className="number">平均</th>
            </tr>
          </thead>
          <tbody>
            {peers.map((peer, index) => (
              <tr key={peer.id}>
                <td className="row-number">{index + 2}</td>
                <th scope="row">
                  {peer.name}
                  {peer.criticalMismatch && <strong className="matrix-warning">重大不一致</strong>}
                  {peer.dataGaps.length > 0 && <strong className="matrix-data-gap">データ欠損</strong>}
                </th>
                <td>{roleDetails[peer.role].label}</td>
                {criteria.map((criterion) => {
                  const unavailable = peer.dataGaps.includes(criterion.id);
                  const score = peer.scores[criterion.id];
                  return <td className={`number ${unavailable ? "score-na" : `score-${score}`}`} key={criterion.id}>{unavailable ? "N/A" : score}</td>;
                })}
                <td className="number average-score">{scoreAverage(peer).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
