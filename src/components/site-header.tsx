"use client";
import Link from "next/link";
import { useState } from "react";
import { lessons, navItems } from "@/data/site";

export function SiteHeader(){
  const [open,setOpen]=useState(false); const [query,setQuery]=useState("");
  const hits=lessons.filter(x=>(x.title+x.summary).includes(query));
  return <>
    <div className="bg-[#102235] text-white text-xs"><div className="container flex justify-between py-2"><span>PRIVATE COMPANY M&A / FINANCIAL MODELING</span><Link href="/disclaimer" className="text-white/70">免責事項</Link></div></div>
    <header className="sticky top-0 z-40 border-b border-[#d8e0e5] bg-white/95 backdrop-blur">
      <div className="container flex min-h-16 items-center gap-6">
        <Link href="/" className="mr-auto leading-tight"><strong className="block text-lg tracking-tight">M&A MODELING LAB</strong><span className="text-[10px] text-[#607080]">実務家のための財務モデル設計室</span></Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold lg:flex">{navItems.map(n=><Link key={n.href} href={n.href} className="hover:text-[#147d73]">{n.label}</Link>)}</nav>
        <button aria-label="サイト内検索" className="border border-[#d8e0e5] px-3 py-2 text-sm" onClick={()=>setOpen(true)}>検索</button>
      </div>
    </header>
    {open&&<div className="fixed inset-0 z-50 bg-[#102235]/60 p-4" onClick={()=>setOpen(false)}><div className="mx-auto mt-20 max-w-2xl bg-white p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
      <div className="mb-4 flex items-center gap-3"><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="例：売上、運転資本、シナリオ" className="min-w-0 flex-1 border border-[#9aa8b1] px-4 py-3 outline-[#147d73]"/><button onClick={()=>setOpen(false)}>閉じる</button></div>
      <div>{(query?hits:lessons).map(x=><Link onClick={()=>setOpen(false)} key={x.slug} href={`/${x.slug}`} className="block border-t border-[#d8e0e5] py-3"><strong>{x.title}</strong><span className="block text-sm text-[#607080]">{x.summary}</span></Link>)}</div>
    </div></div>}
  </>;
}
