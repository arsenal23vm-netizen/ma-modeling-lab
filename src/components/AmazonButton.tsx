"use client";

import { trackAmazonClick, trackOutboundClick } from "@/lib/analytics";

type Props = {
  bookTitle: string;
  asin: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
};

export function AmazonButton({ bookTitle, asin, href, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        trackAmazonClick(bookTitle, asin);
        trackOutboundClick(`Amazon: ${bookTitle}`, href);
      }}
    >
      {children ?? "Amazonで確認"}
    </a>
  );
}
