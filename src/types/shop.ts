export type VerificationStatus = "verified_official" | "verified_review" | "needs_confirmation" | "possibly_discontinued";
export type HoneyStatus = "included" | "available" | "unknown" | "not_available";

export type Shop = {
  id: string; slug: string; name: string; city: "osaka"; ward: string; wardSlug: string;
  address: string; nearestStation?: string; latitude: number; longitude: number;
  googlePlaceId?: string; googleMapsUrl?: string; googleRating?: number; googleReviewCount?: number;
  websiteUrl?: string; instagramUrl?: string; verificationStatus: VerificationStatus;
  verificationSourceLabel?: string; verificationSourceUrl?: string; lastVerifiedAt?: string;
  quattroPriceText?: string; cheeseDescription?: string; honeyStatus: HoneyStatus;
  lunchAvailable?: boolean; takeoutAvailable?: boolean; openingHoursText?: string;
  description: string; notes?: string; published: boolean; sample?: boolean;
};
