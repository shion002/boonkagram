import { useEffect, useState } from "react";
import type { Review } from "../util/Review";
import { ratingCalc } from "../util/CafeData";
import profile from "./../assets/profile-basic.webp";
import "./CafeDataReview.css";

interface ReviewProps {
  review: Review[] | null;
}

const CafeDataReview = ({ review }: ReviewProps) => {
  const [displayReview, setDisplayReview] = useState<Review[]>([]);
  const [reviewPage, setReviewPage] = useState(3);
  const [sortName, setSortName] = useState("추천순");

  const sortBtn = [
    { name: "추천순" },
    { name: "최신순" },
    { name: "평점 높은 순" },
    { name: "평점 낮은 순" },
  ];

  useEffect(() => {
    if (review) {
      setDisplayReview(review.slice(0, reviewPage));
    }
  }, [reviewPage]);

  return (
    <div className="cafedataview-intro-reviewbox">
      <h3 className="cafedataview-intro-reviewbox-title">리뷰</h3>
      <div className="cafedataview-intro-reviewbox-sortbox">
        {sortBtn.map((sort, idx) => (
          <div
            className={sortName === sort.name ? "active" : ""}
            onClick={() => {
              setSortName(sort.name);
            }}
            key={idx}
          >
            {sort.name}
          </div>
        ))}
      </div>
      <ul className="cafedataview-intro-reviewbox-reviewlist">
        {displayReview.length > 0 ? (
          displayReview.map((review) => (
            <li key={review.id}>
              <div className="cafedataview-intro-reviewbox-reviewlist-profile">
                <div className="cafedataview-intro-reviewbox-reviewlist-profile-imgbox">
                  <img src={review.profileImg ? review.profileImg : profile} />
                </div>
                <div className="cafedataview-intro-reviewbox-reviewlist-profile-info">
                  <h4 className="cafedataview-intro-reviewbox-reviewlist-profile-info-name">
                    {review.name}
                  </h4>
                  <div className="cafedataview-intro-reviewbox-reviewlist-profile-info-data">
                    <p className="cafedataview-intro-reviewbox-reviewlist-profile-info-data-review">
                      리뷰 {review.totalreview}건
                    </p>
                    <div className="cafedataview-intro-reviewbox-reviewlist-profile-info-data-line"></div>
                    <p className="cafedataview-intro-reviewbox-reviewlist-profile-info-data-follow">
                      팔로워 {review.follow}명
                    </p>
                  </div>
                </div>
              </div>
              <div className="cafedataview-intro-reviewbox-reviewlist-imgbox">
                <ul className="cafedataview-intro-reviewbox-reviewlist-imgbox-listbox">
                  {review.reviewImg?.map((img, idx) => (
                    <li key={idx}>
                      <img src={img} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cafedataview-intro-reviewbox-reviewlist-datebox">
                <div className="cafedataview-intro-reviewbox-reviewlist-datebox-rating">
                  <div className="cafedataview-intro-reviewbox-reviewlist-datebox-ratingimg">
                    <img src={ratingCalc(review.ratingScore, 1)} />
                    <img src={ratingCalc(review.ratingScore, 2)} />
                    <img src={ratingCalc(review.ratingScore, 3)} />
                    <img src={ratingCalc(review.ratingScore, 4)} />
                    <img src={ratingCalc(review.ratingScore, 5)} />
                  </div>
                  <div className="cafedataview-intro-reviewbox-reviewlist-datebox-ratingscore">
                    {review.ratingScore}
                  </div>
                </div>
                <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details">
                  <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-score">
                    <p>맛</p>
                    <p>{review.score.tasteScore}</p>
                  </div>
                  <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-line"></div>
                  <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-score">
                    <p>서비스</p>
                    <p>{review.score.serviceScore}</p>
                  </div>
                  <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-line"></div>
                  <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-score">
                    <p>분위기</p>
                    <p>{review.score.moodScore}</p>
                  </div>
                  <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-line"></div>
                  <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-score">
                    <p>가성비</p>
                    <p>{review.score.costScore}</p>
                  </div>
                </div>
              </div>
              <div className="cafedataview-intro-reviewbox-reviewlist-content">
                <div className="cafedataview-intro-reviewbox-reviewlist-content-main">
                  {review.content}
                </div>
                <p className="cafedataview-intro-reviewbox-reviewlist-content-date">
                  {review.date.getFullYear()}년 {review.date.getMonth() + 1}월{" "}
                  {review.date.getDate()}일
                </p>
              </div>
            </li>
          ))
        ) : (
          <div>등록된 리뷰가 없습니다.</div>
        )}
        {review && reviewPage < review.length && (
          <div
            onClick={() => {
              setReviewPage(Math.min(reviewPage + 5, review.length));
            }}
            className="cafedataview-intro-reviewbox-more"
          >
            리뷰 더보기
          </div>
        )}
      </ul>
    </div>
  );
};

export default CafeDataReview;
