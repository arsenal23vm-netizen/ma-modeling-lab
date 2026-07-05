import type{QueryPlan}from"./types";import{priorityAreas,wardAliases}from"./osakaAreas";
const direct=["クアトロフォルマッジ 大阪市","クワトロフォルマッジ 大阪市","クアトロ・フォルマッジ 大阪市","4種のチーズ ピザ 大阪市","四種のチーズ ピザ 大阪市","quattro formaggi Osaka","four cheese pizza Osaka"];
export function buildQueries(options:{wardSlug?:string;strategy?:string;maxQueries?:number}={}):QueryPlan[]{let plans:QueryPlan[];
if(options.strategy==="broad-pizzeria")plans=["ピッツェリア 大阪市","ナポリピッツァ 大阪市","イタリアン ピザ 大阪市","pizza Osaka","pizzeria Osaka"].map(query=>({query,source:"text_search_broad_pizzeria"}));
else if(options.wardSlug){const ward=wardAliases[options.wardSlug]??options.wardSlug;plans=[`クアトロフォルマッジ 大阪市${ward}`,`4種のチーズ ピザ 大阪市${ward}`].map(query=>({query,source:"text_search_area_menu",ward,wardSlug:options.wardSlug}));}
else plans=[...direct.map(query=>({query,source:"text_search_direct_menu" as const})),...priorityAreas.flatMap(area=>[`クアトロフォルマッジ ${area.name}`,`4種のチーズ ピザ ${area.name}`].map(query=>({query,source:"text_search_area_menu" as const,ward:area.ward,wardSlug:area.slug})))];
const hardMax=options.strategy==="broad-pizzeria"?10:23;return plans.slice(0,Math.min(options.maxQueries??hardMax,hardMax));}
