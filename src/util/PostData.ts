import type { Review } from "./Review";

export interface PostData {
  phone: string | null;
  content: string | null;
  img: string[] | null;
  review: Review[] | null;
  menu: { name: string; price: number }[] | null;
  link: { phone: string | null; instagram: string | null; web: string | null };
}
