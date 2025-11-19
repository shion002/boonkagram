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
