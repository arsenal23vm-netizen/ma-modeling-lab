"use client";
import { useMemo, useState } from "react";

export function KpiGenerator(){
  const [volume,setVolume]=useState(1000),[price,setPrice]=useState(12000),[vg,setVg]=useState(8),[pg,setPg]=useState(2),[margin,setMargin]=useState(28);
  const rows=useMemo(()=>Array.from({length:5},(_,i)=>{const v=volume*Math.pow(1+vg/100,i),p=price*Math.pow(1+pg/100,i),revenue=v*p;return {year:`${2026+i}年度`,v,p,revenue,profit:revenue*margin/100}}),[volume,price,vg,pg,margin]);
  const fields:[string,number,(n:number)=>void][]=[["初年度数量",volume,setVolume],["平均単価",price,setPrice],["数量成長率（%）",vg,setVg],["単価上昇率（%）",pg,setPg],["営業利益率（%）",margin,setMargin]];
  return <div className="border border-[#9aa8b1] bg-white"><div className="bg-[#217346] px-5 py-3 font-bold text-white">KPI売上高モデル作成ツール</div><div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">{fields.map(([label,value,setter])=><label className="text-xs font-bold" key={label}>{label}<input type="number" value={value} onChange={e=>setter(Number(e.target.value))} className="mt-1 w-full border border-[#9aa8b1] px-3 py-2 font-mono font-normal"/></label>)}</div><div className="data-scroll"><table className="data-table"><thead><tr><th>年度</th><th>販売数量</th><th>平均単価</th><th>売上高</th><th>営業利益</th></tr></thead><tbody>{rows.map(r=><tr key={r.year}><td>{r.year}</td><td className="number">{Math.round(r.v).toLocaleString()}</td><td className="number">¥{Math.round(r.p).toLocaleString()}</td><td className="number">¥{Math.round(r.revenue/1000000).toLocaleString()}百万円</td><td className="number">¥{Math.round(r.profit/1000000).toLocaleString()}百万円</td></tr>)}</tbody></table></div></div>
}
