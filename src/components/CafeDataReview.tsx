import { useEffect, useState } from "react";
import type { ReviewResponse } from "../types/review";
import { ratingCalc } from "../types/cafeData";
import profile from "./../assets/profile-basic.webp";
import ImageModal from "./ImageModal";
import "./CafeDataReview.css";
import axios from "axios";
import { useParams } from "react-router-dom";

interface PageResponse {
  content: ReviewResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

const CafeDataReview = () => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [sortName, setSortName] = useState("LATEST");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstPageData, setFirstPageData] = useState<ReviewResponse[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const PAGE_SIZE = 5;
  const { id } = useParams();

  const sortBtn = [
    { name: "LATEST", value: "최신순" },
    { name: "RATING_HIGH", value: "평점 높은 순" },
    { name: "RATING_LOW", value: "평점 낮은 순" },
  ];

  const fetchReview = async (
    page: number,
    sort: string,
    reset: boolean = false
  ) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.get<PageResponse>(
        `${API_BASE_URL}/api/cafe/${id}/get-reviews`,
        {
          params: {
            page: page,
            size: PAGE_SIZE,
            sort: sort,
          },
        }
      );
      const data = response.data;
      if (reset) {
        setFirstPageData(data.content);
        setReviews(data.content.slice(0, 3));
        setCurrentPage(0);
      } else {
        setReviews((prev) => [...prev, ...data.content]);
        setCurrentPage(page);
      }

      setIsLastPage(data.last);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReview(0, sortName, true);
    }
  }, [id]);

  const handleSortChange = (sort: string) => {
    setSortName(sort);
    setReviews([]);
    setCurrentPage(0);
    setIsLastPage(false);
    fetchReview(0, sort, true);
  };

  const handleLoadMore = () => {
    if (currentPage === 0 && reviews.length === 3 && firstPageData.length > 3) {
      setReviews(firstPageData);
    } else {
      fetchReview(currentPage + 1, sortName, false);
    }
  };

  const shouldShowMoreButton = () => {
    if (currentPage === 0 && reviews.length === 3 && firstPageData.length > 3) {
      return true;
    }
    return !isLastPage && reviews.length > 0;
  };

  const parseDate = (dateString: string | Date): Date => {
    if (dateString instanceof Date) return dateString;
    return new Date(dateString);
  };

  const openImageModal = (images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  return (
    <div className="cafedataview-intro-reviewbox">
      <h3 className="cafedataview-intro-reviewbox-title">리뷰</h3>
      <div className="cafedataview-intro-reviewbox-sortbox">
        {sortBtn.map((sort, idx) => (
          <div
            className={sortName === sort.name ? "active" : ""}
            onClick={() => {
              handleSortChange(sort.name);
            }}
            key={idx}
          >
            {sort.value}
          </div>
        ))}
      </div>
      <ul className="cafedataview-intro-reviewbox-reviewlist">
        {reviews.length !== 0 ? (
          reviews.map((review) => {
            const reviewDate = parseDate(review.createDate);
            return (
              <li key={review.id}>
                <div className="cafedataview-intro-reviewbox-reviewlist-profile">
                  <div className="cafedataview-intro-reviewbox-reviewlist-profile-imgbox">
                    <img
                      src={review.profileImage ? review.profileImage : profile}
                    />
                  </div>
                  <div className="cafedataview-intro-reviewbox-reviewlist-profile-info">
                    <h4 className="cafedataview-intro-reviewbox-reviewlist-profile-info-name">
                      {review.nickname}
                    </h4>
                    <div className="cafedataview-intro-reviewbox-reviewlist-profile-info-data">
                      <p className="cafedataview-intro-reviewbox-reviewlist-profile-info-data-review">
                        리뷰 {review.totalReview}건
                      </p>
                      <div className="cafedataview-intro-reviewbox-reviewlist-profile-info-data-line"></div>
                      <p className="cafedataview-intro-reviewbox-reviewlist-profile-info-data-follow">
                        팔로워 0명
                      </p>
                    </div>
                  </div>
                </div>
                <div className="cafedataview-intro-reviewbox-reviewlist-imgbox">
                  <ul className="cafedataview-intro-reviewbox-reviewlist-imgbox-listbox">
                    {review.reviewImages?.map((img, idx) => (
                      <li
                        key={idx}
                        onClick={() =>
                          openImageModal(review.reviewImages!, idx)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <img src={img} alt={`리뷰 이미지 ${idx + 1}`} />
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
                      {review.ratingScore.toFixed(1)}
                    </div>
                  </div>
                  <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details">
                    <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-score">
                      <p>맛</p>
                      <p>{review.reviewScore.tasteScore}</p>
                    </div>
                    <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-line"></div>
                    <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-score">
                      <p>서비스</p>
                      <p>{review.reviewScore.serviceScore}</p>
                    </div>
                    <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-line"></div>
                    <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-score">
                      <p>분위기</p>
                      <p>{review.reviewScore.moodScore}</p>
                    </div>
                    <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-line"></div>
                    <div className="cafedataview-intro-reviewbox-reviewlist-datebox-details-score">
                      <p>가성비</p>
                      <p>{review.reviewScore.costScore}</p>
                    </div>
                  </div>
                </div>
                <div className="cafedataview-intro-reviewbox-reviewlist-content">
                  <div className="cafedataview-intro-reviewbox-reviewlist-content-main">
                    {review.content}
                  </div>
                  <p className="cafedataview-intro-reviewbox-reviewlist-content-date">
                    {reviewDate.getFullYear()}년 {reviewDate.getMonth() + 1}월{" "}
                    {reviewDate.getDate()}일
                  </p>
                </div>
              </li>
            );
          })
        ) : (
          <div className="cafedataview-intro-reviewbox-reviewlist-notreview">
            등록된 리뷰가 없습니다.
          </div>
        )}

        {shouldShowMoreButton() && (
          <div
            onClick={handleLoadMore}
            className="cafedataview-intro-reviewbox-more"
            style={{
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
              pointerEvents: isLoading ? "none" : "auto",
            }}
          >
            {isLoading ? "로딩 중..." : "리뷰 더보기"}
          </div>
        )}
      </ul>

      <ImageModal
        images={selectedImages}
        isOpen={modalOpen}
        initialIndex={selectedImageIndex}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default CafeDataReview;
