import type { ImageMetadata } from "./imageMetadata";
import type { Review } from "./review";

export interface PostData {
  name: string | null;
  address: string | null;
  phone: string | null;
  instagram: string | null;
  webUrl: string | null;
  intro: string | null;
  imageUrls: string[] | null;
  review: Review[] | null;
  menus: { name: string; price: number }[] | null;
}

export interface PostRequestData {
  cafeName: string;
  address: string;
  titleIntro: string | null;
  thumbnail: ImageMetadata | null;
  lat: number;
  lon: number;
  phone: string | null;
  instagram: string | null;
  webUrl: string | null;
  intro: string | null;
  menus: { name: string; price: number }[] | null;
  imageUrls: ImageMetadata[] | null;
  existingImageUrls?: string[] | null;
  existingThumbnailUrl?: string | null;
  deleteThumbnail?: boolean;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  fileUrl: string;
}

export interface PostCafeResponse {
  cafeId: number;
  thumbnailPresignedUrl: PresignedUrlResponse | null;
  imagePresignedUrls: PresignedUrlResponse[];
}
