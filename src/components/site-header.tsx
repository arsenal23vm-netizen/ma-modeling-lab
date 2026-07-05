import Link from "next/link";
export function SiteHeader(){return <header className="site-header"><div className="container nav"><Link className="brand" href="/"><span>QUATTRO</span>クアトロマップ大阪</Link><nav aria-label="メインナビゲーション"><Link href="/#shops">お店を探す</Link><Link href="/submit">情報を送る</Link></nav></div></header>}
