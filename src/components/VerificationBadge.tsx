import type { VerificationStatus } from "@/types/shop";
export const verificationStatusLabels: Record<VerificationStatus,string> = {
  verified_official:"公式情報で提供確認済み", verified_review:"口コミ・投稿で提供確認",
  needs_confirmation:"提供状況を確認中", possibly_discontinued:"提供終了の可能性あり",
};
export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return <span className={`badge verify-${status}`}>{verificationStatusLabels[status]}</span>;
}
