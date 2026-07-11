"use client";

import Link from "next/link";
import { trackCtaClick, trackOutboundClick } from "@/lib/analytics";

type Props = {
  href: string;
  label: string;
  location: string;
  className?: string;
  children: React.ReactNode;
};

export function CtaLink({ href, label, location, className, children }: Props) {
  const outbound = /^https?:\/\//.test(href);

  const onClick = () => {
    trackCtaClick(label, location);
    if (outbound) trackOutboundClick(label, href);
  };

  if (outbound) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
