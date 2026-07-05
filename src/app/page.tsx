import Image from "next/image";
import Link from "next/link";
import { ShopExplorer } from "@/components/ShopExplorer";
import { getPublishedShops } from "@/lib/shops";
import { wards } from "@/data/wards";

export default function Home() {
  const shops = getPublishedShops();
  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow">OSAKA · QUATTRO FORMAGGI</span><h1>大阪で出会う、<br/><em>4種のチーズ</em>の一枚。</h1><p>大阪市でクアトロフォルマッジが食べられるピザ屋・イタリアンを、地図と確認情報から探せる専門サイトです。</p><a className="primary-button" href="#shops">近くのお店を探す</a></div>
      <div className="hero-photo"><Image src="/images/quattro-formaggi-hero.png" alt="薪窯で焼き上げたクアトロフォルマッジ" fill priority sizes="(max-width: 850px) 100vw, 46vw"/><span>QUATTRO<br/>FORMAGGI</span></div>
    </div></section>
    <div className="sample-notice"><div className="container"><b>現在はMVPのサンプルデータです</b><span>掲載店舗・評価・メニュー情報は架空です。実店舗情報の投稿をお待ちしています。</span></div></div>
    <section className="story-section container"><div className="story-photo"><Image src="/images/osaka-pizzeria-interior.png" alt="薪窯のある温かな雰囲気のピッツェリア店内" fill sizes="(max-width: 850px) 100vw, 50vw"/></div><div className="story-copy"><span className="eyebrow">A PERFECT SLICE IN OSAKA</span><h2>お気に入りの一枚と、<br/>心地よい店を探そう。</h2><p>ゴルゴンゾーラの個性、モッツァレラのミルキーさ、焼きたての香ばしさ。お店ごとの違いを楽しめるよう、確認状況やはちみつ、ランチ情報を分かりやすくまとめています。</p><a href="#shops" className="text-link">地図から探してみる →</a></div></section>
    <div className="container"><ShopExplorer initialShops={shops}/><section className="wards-section"><span className="eyebrow">EXPLORE BY AREA</span><h2>大阪市の区から探す</h2><div className="ward-links">{wards.map(w=><Link key={w.slug} href={`/osaka/${w.slug}`}><b>{w.name}</b><span>お店を見る →</span></Link>)}</div></section></div>
  </>;
}
