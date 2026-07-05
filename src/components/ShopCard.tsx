import Link from "next/link";
import type { Shop } from "@/types/shop";
import { HoneyBadge } from "./HoneyBadge";
import { VerificationBadge } from "./VerificationBadge";
export function ShopCard({ shop }: { shop: Shop }) {
  return <article className="shop-card">
    <div className="card-top"><span className="ward">大阪市{shop.ward}</span>{shop.sample && <span className="sample">サンプルデータ</span>}</div>
    <h3><Link href={`/shops/${shop.slug}`}>{shop.name}</Link></h3>
    <p className="station">📍 {shop.nearestStation ?? shop.address}</p>
    <div className="rating"><strong>★ {shop.googleRating?.toFixed(1) ?? "―"}</strong><span>Google口コミ {shop.googleReviewCount?.toLocaleString() ?? "―"}件</span></div>
    <div className="badges"><VerificationBadge status={shop.verificationStatus}/><HoneyBadge status={shop.honeyStatus}/></div>
    <p>{shop.description}</p>
    <Link className="text-link" href={`/shops/${shop.slug}`}>お店の詳細を見る →</Link>
  </article>;
}
