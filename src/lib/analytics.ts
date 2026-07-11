export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const pagePath = () => {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search}`;
};

export function pageview(url: string) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, {
    page_path: url,
  });
}

export function event(action: string, params?: Record<string, unknown>) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params ?? {});
}

export function trackAmazonClick(bookTitle: string, asin: string) {
  event("amazon_click", {
    book_title: bookTitle,
    asin,
    category: "amazon_book",
    page_path: pagePath(),
  });
}

export function trackCtaClick(label: string, location: string) {
  event("cta_click", {
    label,
    location,
    page_path: pagePath(),
  });
}

export function trackOutboundClick(label: string, url: string) {
  event("outbound_click", {
    label,
    url,
    page_path: pagePath(),
  });
}

export const analyticsEvents = {
  newsletterSignup: "newsletter_signup",
  templateDownload: "template_download",
  contactSubmit: "contact_submit",
  scrollDepth: "scroll_depth",
  articleReadComplete: "article_read_complete",
} as const;
