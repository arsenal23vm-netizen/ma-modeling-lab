import Link from "next/link";
export function SiteFooter(){return <footer><div className="container footer-inner"><div><b>クアトロマップ大阪</b><p>大阪の“おいしい四重奏”を探すための専門マップ。</p></div><div><Link href="/">お店を探す</Link><Link href="/submit">掲載・修正依頼</Link></div></div><p className="copyright">© 2026 Quattro Map Osaka · 掲載情報は訪問前に公式情報をご確認ください。</p></footer>}
