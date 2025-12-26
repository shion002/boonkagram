import type { ImageMetadata } from "./imageMetadata";

export interface Review {
  id: string;
  name: string;
  totalreview: number;
  follow: number;
  profileImg: string;
  reviewImg: string[];
  ratingScore: number;
  score: {
    tasteScore: number;
    serviceScore: number;
    moodScore: number;
    costScore: number;
  };
  content: string;
  date: Date;
}

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
