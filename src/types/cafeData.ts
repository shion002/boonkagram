import starNull from "./../assets/star-null.svg";
import starHalf from "./../assets/star-half.svg";
import starFull from "./../assets/star-full.svg";

export interface CafeData {
  id: number | null;
  name: string | null;
  thumbnail: string | null;
  rating: number;
  reviewCount: number;
  address: string | null;
  titleIntro: string | null;
}
export const ratingCalc = (score: number, standardNum: number) => {
  if (score >= standardNum) {
    return starFull;
  } else if (score < standardNum && score >= standardNum - 0.5) {
    return starHalf;
  } else {
    return starNull;
  }
};
