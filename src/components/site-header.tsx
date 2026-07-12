"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { lessons, navItems } from "@/data/site";

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const hits = useMemo(() => {
    if (!normalizedQuery) return lessons;
    return lessons.filter((lesson) =>
      `${lesson.title} ${lesson.summary} ${lesson.level}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeNavigation = () => setMenuOpen(false);

  return (
    <>
      <div className="bg-[#102235] text-xs text-white">
        <div className="container flex items-center justify-between gap-4 py-2">
          <span className="font-semibold tracking-[.12em]">PRIVATE COMPANY M&A / FINANCIAL MODELING</span>
          <Link href="/disclaimer" className="shrink-0 text-white/70 hover:text-white">
            免責事項
          </Link>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-[#d8e0e5] bg-white/95 backdrop-blur">
        <div className="container flex min-h-16 items-center gap-4">
          <Link href="/" className="mr-auto leading-tight" onClick={closeNavigation}>
            <strong className="block text-lg tracking-tight text-[#102235]">FINANCE MODELING LAB</strong>
            <span className="text-[10px] text-[#607080]">実務家のための財務モデル設計室</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-semibold lg:flex" aria-label="主要ナビゲーション">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[#147d73]">
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label="サイト内検索を開く"
            className="rounded-full border border-[#d8e0e5] px-3 py-2 text-sm font-bold hover:border-[#147d73]"
            onClick={() => setSearchOpen(true)}
          >
            検索
          </button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="rounded-full border border-[#d8e0e5] px-3 py-2 text-sm font-bold lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
          >
            メニュー
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="border-t border-[#d8e0e5] bg-white lg:hidden" aria-label="モバイルナビゲーション">
            <div className="container grid gap-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-[#d8e0e5] px-4 py-3 text-sm font-bold"
                  onClick={closeNavigation}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#102235]/65 p-4"
          role="presentation"
          onClick={() => setSearchOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-search-title"
            className="mx-auto mt-16 max-w-2xl bg-white p-5 shadow-2xl md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 id="site-search-title" className="text-lg font-bold text-[#102235]">
                  サイト内検索
                </h2>
                <p className="text-xs text-[#607080]">勘定科目、Excel関数、財務三表などで検索できます。</p>
              </div>
              <button type="button" className="text-sm font-bold text-[#147d73]" onClick={() => setSearchOpen(false)}>
                閉じる
              </button>
            </div>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例：売上高、運転資本、シナリオ"
              className="w-full border border-[#9aa8b1] px-4 py-3 outline-[#147d73]"
            />
            <div className="mt-4 max-h-[58vh] overflow-y-auto border-t border-[#d8e0e5]">
              {hits.length > 0 ? (
                hits.map((lesson) => (
                  <Link
                    onClick={() => setSearchOpen(false)}
                    key={lesson.slug}
                    href={`/${lesson.slug}`}
                    className="block border-b border-[#d8e0e5] py-3 hover:bg-[#f7f8f6]"
                  >
                    <strong>{lesson.title}</strong>
                    <span className="block text-sm text-[#607080]">{lesson.summary}</span>
                  </Link>
                ))
              ) : (
                <p className="py-5 text-sm text-[#607080]">該当する記事が見つかりませんでした。</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
