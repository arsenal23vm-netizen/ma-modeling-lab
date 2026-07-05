import { shops } from "@/data/shops";
export const getPublishedShops = () => shops.filter((shop) => shop.published);
export const getShopBySlug = (slug: string) => getPublishedShops().find((shop) => shop.slug === slug);
export const getShopsByWard = (wardSlug: string) => getPublishedShops().filter((shop) => shop.wardSlug === wardSlug);
