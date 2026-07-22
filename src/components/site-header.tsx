"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { navItems } from "@/data/site";
import { searchContent } from "@/lib/content-search";

const contentTypeLabels = {
  article: "記事",
  hub: "ハブ",
  download: "DL",
  tool: "ツール",
  reference: "参考",
} as const;

const topicLabels = {
  "financial-modeling": "財務モデリング",
  valuation: "Valuation",
  "ma-modeling": "M&Aモデリング",
  excel: "Excel",
} as const;

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchOpenerRef = useRef<HTMLButtonElement>(null);
  const searchDialogRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wasSearchOpen = useRef(false);

  const hits = useMemo(() => searchContent(query), [query]);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSearch();
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSearch]);

  useEffect(() => {
    if (searchOpen) {
      const frame = window.requestAnimationFrame(() => searchInputRef.current?.focus());
      wasSearchOpen.current = true;
      return () => window.cancelAnimationFrame(frame);
    }

    if (wasSearchOpen.current) {
      searchOpenerRef.current?.focus();
      wasSearchOpen.current = false;
    }
  }, [searchOpen]);

  const closeNavigation = () => setMenuOpen(false);
  const trapSearchFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusableElements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    const first = focusableElements[0];
    const last = focusableElements.at(-1);

    if (!first || !last) {
      event.preventDefault();
    } else if (event.shiftKey && (document.activeElement === first || !event.currentTarget.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !event.currentTarget.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };

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
          <nav className="hidden max-w-4xl flex-wrap items-center justify-end gap-x-3 gap-y-1 text-sm font-semibold lg:flex" aria-label="主要ナビゲーション">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[#147d73]">
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label="サイト内検索を開く"
            ref={searchOpenerRef}
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
          onClick={closeSearch}
        >
          <div
            ref={searchDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-search-title"
            className="mx-auto mt-16 max-w-2xl bg-white p-5 shadow-2xl md:p-6"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={trapSearchFocus}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 id="site-search-title" className="text-lg font-bold text-[#102235]">
                  サイト内検索
                </h2>
                <p className="text-xs text-[#607080]">勘定科目、Excel関数、財務三表などで検索できます。</p>
              </div>
              <button type="button" className="text-sm font-bold text-[#147d73]" onClick={closeSearch}>
                閉じる
              </button>
            </div>
            <label htmlFor="site-search-query" className="sr-only">サイト内を検索</label>
            <input
              id="site-search-query"
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例：売上高、運転資本、シナリオ"
              className="w-full border border-[#9aa8b1] px-4 py-3 outline-[#147d73]"
            />
            <div className="mt-4 max-h-[58vh] overflow-y-auto border-t border-[#d8e0e5]">
              {hits.length > 0 ? (
                hits.map((item) => (
                  <Link
                    onClick={closeSearch}
                    key={item.href}
                    href={item.href}
                    className="block border-b border-[#d8e0e5] py-3 hover:bg-[#f7f8f6]"
                  >
                    <span className="mb-1 flex flex-wrap gap-1.5 text-[11px] font-bold">
                      <span className="rounded-full bg-[#e7f4f1] px-2 py-0.5 text-[#147d73]">{contentTypeLabels[item.type]}</span>
                      <span className="rounded-full bg-[#edf1f4] px-2 py-0.5 text-[#536573]">{topicLabels[item.topic]}</span>
                    </span>
                    <strong>{item.title}</strong>
                    <span className="block text-sm text-[#607080]">{item.summary}</span>
                  </Link>
                ))
              ) : (
                <p className="py-5 text-sm text-[#607080]">
                  該当するコンテンツが見つかりませんでした。<Link href="/request" className="font-bold text-[#147d73] underline" onClick={closeSearch}>追加してほしい内容をリクエスト</Link>できます。
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
