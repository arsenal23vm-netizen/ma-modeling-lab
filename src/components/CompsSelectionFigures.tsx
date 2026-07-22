import type { CandidatePeer, PeerRole, SelectionCriterion, TargetProfile } from "@/data/comps-selection";

const roleDetails: Record<PeerRole, { label: string; note: string }> = {
  core_peer: { label: "主要比較会社", note: "Valuationの中心レンジ" },
  secondary_peer: { label: "補完比較会社", note: "差異を注記して補助的に参照" },
  aspirational_peer: { label: "目標比較会社", note: "改善後の事業像を検討する参考" },
  negative_peer: { label: "非比較会社", note: "除外判断の一貫性を確認する対象" },
  excluded_close_peer: { label: "類似するが除外", note: "比較に必要な情報が不足" },
  not_clean_comp: { label: "参考会社", note: "事業構成が異なるため参考に限定" },
};

const funnelSteps = [
  ["業種候補", 30, "業界・事業領域から抽出"],
  ["事業モデル", 18, "事業モデルと顧客市場を確認"],
  ["財務比較", 12, "規模・成長性・収益性を比較"],
  ["主要比較会社", 6, "評価レンジの中心に採用"],
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
            <div><dt>EBITDAマージン</dt><dd>{target.ebitdaMargin.toFixed(1)}%</dd></div>
            <div><dt>成長率</dt><dd>該当なし</dd></div>
            <div><dt>メンテナンス・サービス比率</dt><dd>{target.serviceSales}%</dd></div>
          </dl>
        </article>
        {comparisonRoles.map((role) => {
          const peer = peers.find((candidate) => candidate.role === role);
          if (!peer) return null;
          return (
            <article className={`target-card role-${role}`} key={role}>
              <p className="comparison-kicker">{roleDetails[role].label}</p>
              <h4>{peer.name}</h4>
              <p>{peer.business}</p>
              <dl>
                <div><dt>売上高</dt><dd>{formatNumber(peer.revenue)} {target.unit}</dd></div>
                <div><dt>EBITDAマージン</dt><dd>{peer.ebitdaMargin === null ? "該当なし" : `${peer.ebitdaMargin.toFixed(1)}%`}</dd></div>
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
      <h3 id="peer-role-map-title">比較上の位置づけ</h3>
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
      <p id={descriptionId}>スコアは0点（不適合）から3点（高い適合性）です。比較に必要な情報が不足する会社は「該当なし」を表示し、平均点の分母から除外します。</p>
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
                  return <td className={`number ${unavailable ? "score-na" : `score-${score}`}`} key={criterion.id}>{unavailable ? "該当なし" : score}</td>;
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
