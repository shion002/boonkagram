import type { ImageMetadata } from "./imageMetadata";
import type { PresignedUrlResponse } from "./postData";

export interface ReviewRequest {
  content: string;
  reviewImages: ImageMetadata[];
  reviewScore: {
    tasteScore: number;
    serviceScore: number;
    moodScore: number;
    costScore: number;
  };
  postId: number;
}

export interface ReviewResponse {
  id: number;
  content: string;
  reviewScore: {
    tasteScore: number;
    serviceScore: number;
    moodScore: number;
    costScore: number;
  };
  reviewImages: string[];
  ratingScore: number;
  nickname: string;
  profileImage: string;
  createDate: string;
  totalReview: number;
}

export interface ReviewPresignedResponse {
  imagePresignedUrls: PresignedUrlResponse[];
}

export interface CanReviewResponse {
  canReview: boolean;
  message: string | null;
}
