export type PeerRole = "core_peer" | "secondary_peer" | "aspirational_peer" | "negative_peer" | "excluded_close_peer" | "not_clean_comp";
export type Score = 0 | 1 | 2 | 3;
export type CriterionId = "businessModel" | "productMix" | "customerMarket" | "geography" | "scale" | "growth" | "margin" | "capitalIntensity" | "cyclicality" | "leverage" | "accounting" | "liquidity";
export type TargetProfile = { name: string; business: string; revenue: number; ebitdaMargin: number; overseasSales: number; equipmentSales: number; serviceSales: number; customers: string; capitalIntensity: string; cyclicality: string; unit: string };
export type SelectionCriterion = { id: CriterionId; label: string; question: string; critical: boolean };
export type CandidatePeer = { id: string; name: string; business: string; geography: string; revenue: number; growth: number; ebitdaMargin: number | null; serviceMix: number; capitalIntensity: string; customerMarket: string; accounting: string; dataAvailable: boolean; dataGaps: CriterionId[]; role: PeerRole; criticalMismatch: boolean; coreEligibilityBlocked: boolean; rationale: string; scores: Record<CriterionId, Score> };

export const targetProfile: TargetProfile = {
  name: "モデル製作株式会社",
  business: "製造業向け自動化装置・部品および保守サービス",
  revenue: 1100,
  ebitdaMargin: 16.4,
  overseasSales: 25,
  equipmentSales: 70,
  serviceSales: 30,
  customers: "国内外の電子部品・一般製造業",
  capitalIntensity: "中程度",
  cyclicality: "製造業設備投資に連動する中程度",
  unit: "百万円",
};

export const selectionCriteria: SelectionCriterion[] = [
  { id: "businessModel", label: "事業モデル", question: "収益源と提供価値は近いか？", critical: true },
  { id: "productMix", label: "製品ミックス", question: "装置・部品・サービスの構成は近いか？", critical: true },
  { id: "customerMarket", label: "顧客市場", question: "顧客業界と購買行動は近いか？", critical: true },
  { id: "geography", label: "地域", question: "販売地域と市場環境は近いか？", critical: false },
  { id: "scale", label: "規模", question: "売上規模は比較可能な範囲か？", critical: false },
  { id: "growth", label: "成長率", question: "成長局面は近いか？", critical: false },
  { id: "margin", label: "利益率", question: "EBITDAマージンは近いか？", critical: false },
  { id: "capitalIntensity", label: "資本集約度", question: "設備投資と運転資本の重さは近いか？", critical: true },
  { id: "cyclicality", label: "循環性", question: "需要サイクルへの感応度は近いか？", critical: false },
  { id: "leverage", label: "レバレッジ", question: "有利子負債の水準は比較可能か？", critical: false },
  { id: "accounting", label: "会計方針", question: "会計処理と開示粒度は比較可能か？", critical: false },
  { id: "liquidity", label: "流動性", question: "取引流動性と市場データは十分か？", critical: false },
];

const scores = (...values: Score[]): Record<CriterionId, Score> => {
  const ids = selectionCriteria.map((criterion) => criterion.id);
  return Object.fromEntries(ids.map((id, index) => [id, values[index]])) as Record<CriterionId, Score>;
};

const candidatePeerInputs: Omit<CandidatePeer, "dataGaps" | "coreEligibilityBlocked">[] = [
  { id: "takumi", name: "匠オートメーション", business: "自動化装置・保守", geography: "日本", revenue: 1180, growth: 7, ebitdaMargin: 16.8, serviceMix: 28, capitalIntensity: "中程度", customerMarket: "電子部品・一般製造業", accounting: "日本基準", dataAvailable: true, role: "core_peer", criticalMismatch: false, rationale: "自動化装置と保守の事業構成が近く、売上規模、利益率、製造業顧客もケース企業と整合する。", scores: scores(3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2) },
  { id: "shinsei", name: "新生精密システム", business: "電子部品向け精密装置・保守", geography: "日本", revenue: 980, growth: 8, ebitdaMargin: 15.9, serviceMix: 32, capitalIntensity: "中程度", customerMarket: "電子部品メーカー", accounting: "日本基準", dataAvailable: true, role: "core_peer", criticalMismatch: false, rationale: "電子部品向け装置と保守の構成が近く、顧客市場、利益率、資本集約度も比較可能な水準にある。", scores: scores(3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2) },
  { id: "tokai", name: "東海ファクトリー機器", business: "工場向け生産設備", geography: "日本", revenue: 1250, growth: 5, ebitdaMargin: 15.5, serviceMix: 24, capitalIntensity: "中程度", customerMarket: "国内製造業", accounting: "日本基準", dataAvailable: true, role: "core_peer", criticalMismatch: false, rationale: "国内製造業向けの生産設備を主力とし、売上規模と資本集約度が近く、利益率も許容範囲にある。", scores: scores(3, 2, 3, 3, 3, 2, 3, 3, 3, 2, 3, 2) },
  { id: "mirai", name: "未来プロセス装置", business: "産業プロセス装置・部品", geography: "日本", revenue: 1050, growth: 9, ebitdaMargin: 17.1, serviceMix: 22, capitalIntensity: "中程度", customerMarket: "化学・一般製造業", accounting: "日本基準", dataAvailable: true, role: "core_peer", criticalMismatch: false, rationale: "産業装置が主力で、売上規模、成長率、利益率が近い。顧客も設備投資を行う製造業で循環性が整合する。", scores: scores(3, 2, 2, 3, 3, 3, 3, 3, 3, 2, 3, 2) },
  { id: "nippon", name: "日本モーション技研", business: "モーション制御装置・部品", geography: "日本", revenue: 1320, growth: 6, ebitdaMargin: 16.2, serviceMix: 20, capitalIntensity: "中程度", customerMarket: "電子部品・一般製造業", accounting: "日本基準", dataAvailable: true, role: "core_peer", criticalMismatch: false, rationale: "装置・部品の売上ミックスと製造業顧客が近く、設備投資循環性、利益率、資本集約度も整合している。", scores: scores(3, 3, 3, 3, 2, 2, 3, 3, 3, 2, 3, 2) },
  { id: "kyowa", name: "協和製造ソリューション", business: "製造ライン自動化装置", geography: "日本", revenue: 1130, growth: 6, ebitdaMargin: 16.0, serviceMix: 26, capitalIntensity: "中程度", customerMarket: "国内製造業", accounting: "日本基準", dataAvailable: true, role: "core_peer", criticalMismatch: false, rationale: "売上規模、顧客、地域がケース企業に近く、装置中心の事業構成と利益率も比較目的に適している。", scores: scores(3, 3, 3, 3, 3, 2, 3, 3, 3, 2, 3, 2) },
  { id: "global", name: "グローバル産業ロボティクス", business: "産業ロボット・自動化装置", geography: "グローバル", revenue: 4800, growth: 10, ebitdaMargin: 19.5, serviceMix: 25, capitalIntensity: "中程度", customerMarket: "世界の製造業", accounting: "IFRS", dataAvailable: true, role: "secondary_peer", criticalMismatch: false, rationale: "自動化装置の事業と製造業顧客は近い一方、海外売上比率、規模、利益率が大きく異なり補完的な比較にとどめる。", scores: scores(3, 3, 3, 1, 0, 3, 1, 3, 3, 2, 2, 3) },
  { id: "service", name: "サービスリンク工業", business: "産業装置保守・改修", geography: "日本", revenue: 900, growth: 11, ebitdaMargin: 23.0, serviceMix: 68, capitalIntensity: "低い", customerMarket: "製造業", accounting: "日本基準", dataAvailable: true, role: "aspirational_peer", criticalMismatch: true, rationale: "製造業顧客は近いが、保守比率と利益率が高く資本集約度も低い。サービス拡大後の将来像として参照する。", scores: scores(2, 0, 3, 3, 2, 3, 0, 0, 2, 3, 3, 2) },
  { id: "heavy", name: "大和重機械", business: "大型重機・建設機械", geography: "日本", revenue: 2100, growth: 3, ebitdaMargin: 11.0, serviceMix: 18, capitalIntensity: "高い", customerMarket: "建設・資源", accounting: "日本基準", dataAvailable: true, role: "negative_peer", criticalMismatch: true, rationale: "同じ機械分類でも大型受注と建設顧客が中心で、事業構成、資本集約度、循環性がケース企業と大きく異なる。", scores: scores(0, 1, 0, 3, 1, 1, 0, 0, 0, 1, 3, 2) },
  { id: "close", name: "中央FAテクノロジー", business: "FA装置・部品", geography: "日本", revenue: 1080, growth: 7, ebitdaMargin: null, serviceMix: 29, capitalIntensity: "中程度", customerMarket: "電子部品・一般製造業", accounting: "日本基準", dataAvailable: false, role: "excluded_close_peer", criticalMismatch: false, rationale: "事業構成、顧客、売上規模は非常に近いが、EBITDA情報が取得不能で利益率比較と倍率検証に使えない。", scores: scores(3, 3, 3, 3, 3, 3, 0, 3, 3, 2, 3, 0) },
  { id: "group", name: "統合エンジニアリングHD", business: "複合エンジニアリング", geography: "日本・海外", revenue: 3600, growth: 4, ebitdaMargin: 13.5, serviceMix: 35, capitalIntensity: "高い", customerMarket: "製造・建設・インフラ", accounting: "日本基準", dataAvailable: true, role: "not_clean_comp", criticalMismatch: true, rationale: "対象に近い装置事業を含むが、複合企業で対象セグメントが小さい。事業構成、顧客、利益率を純粋に比較できない。", scores: scores(1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 2) },
  { id: "turnaround", name: "再生機工", business: "産業機械製造", geography: "日本", revenue: 950, growth: -4, ebitdaMargin: 2.0, serviceMix: 15, capitalIntensity: "高い", customerMarket: "一般製造業", accounting: "日本基準", dataAvailable: true, role: "not_clean_comp", criticalMismatch: true, rationale: "製造業顧客と産業機械の点は近いが、経営再建中で利益率、成長率、レバレッジが正常な比較水準にない。", scores: scores(2, 1, 2, 3, 2, 0, 0, 1, 2, 0, 2, 1) },
];

export const candidatePeers: CandidatePeer[] = candidatePeerInputs.map((peer) => {
  const dataGaps: CriterionId[] = peer.dataAvailable ? [] : ["margin", "liquidity"];
  const criticalMismatch = selectionCriteria
    .filter((criterion) => criterion.critical && !dataGaps.includes(criterion.id))
    .some((criterion) => peer.scores[criterion.id] < 2);
  return {
    ...peer,
    dataGaps,
    criticalMismatch,
    coreEligibilityBlocked: criticalMismatch || dataGaps.length > 0,
  };
});

export const peerSelectionFaqs: [string, string][] = [
  ["スコアが高ければ主要比較会社にできますか？", "いいえ。重大な不一致、開示の質、事業の純粋性をレビューし、合計点だけで自動採用しません。"],
  ["規模が大きく異なる企業は除外すべきですか？", "必ずしも除外しません。事業モデルが近ければ補完比較会社として参照し、規模差による影響を明記します。"],
  ["EBITDA情報がない近似企業は使えますか？", "事業理解の参考にはできますが、利益率やマルチプルの比較には使わず、除外理由を記録します。"],
  ["同じセクターならComparableと考えてよいですか？", "いいえ。セクター分類は比較候補会社一覧を作る出発点です。収益モデル、製品ミックス、顧客市場、資本集約度、循環性まで確認して比較可能性を判断します。"],
  ["中央値をそのまま採用してよいですか？", "いいえ。中央値は候補群の構成に左右されます。主要比較会社を中心に、除外・補助比較の理由、各社の規模差や一過性要因を確認して採用レンジを決めます。"],
];
