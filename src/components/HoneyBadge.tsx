import type { HoneyStatus } from "@/types/shop";
const labels: Record<HoneyStatus,string> = { included:"はちみつ付き", available:"はちみつあり", unknown:"はちみつ未確認", not_available:"はちみつなし" };
export function HoneyBadge({ status }: { status: HoneyStatus }) { return <span className="badge honey">🍯 {labels[status]}</span>; }
