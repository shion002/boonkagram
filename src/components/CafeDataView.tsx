import { useNavigate, useParams } from "react-router-dom";
import "./CafeDataView.css";
import instagram from "./../assets/instagram-icon.svg";
import phone from "./../assets/phone-icon.svg";
import webIcon from "./../assets/web-icon.svg";
import type { PostData } from "../types/postData";
import CafeDataMenu from "./CafeDataMenu";
import CafeDataImg from "./CafeDataImg";
import CafeDataReview from "./CafeDataReview";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { CanReviewResponse } from "../types/review";

const CafeDataView = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [cafeData, setcafeData] = useState<PostData>();
  const nav = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isCheckingReview, setIsCheckingReview] = useState(false);

  const { id } = useParams();

  const handleReviewButtonClick = async () => {
    if (!isAuthenticated) {
      const confirm = window.confirm(
        "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
      );
      if (confirm) {
        nav("/login", { state: { from: `/cafe/${id}` } });
      }
      return;
    }

    setIsCheckingReview(true);

    try {
      const response = await axios.get<CanReviewResponse>(
        `${API_BASE_URL}/api/review/can-review/${id}`,
        { withCredentials: true }
      );

      if (response.data.canReview) {
        nav(`/cafe/${id}/review`, {
          state: { cafeData },
        });
      } else {
        alert(response.data.message || "리뷰를 작성할 수 없습니다.");
      }
    } catch (error) {
      console.error("리뷰 작성 가능 여부 확인 실패:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          nav("/login");
        } else {
          alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
      }
    } finally {
      setIsCheckingReview(false);
    }
  };

  useEffect(() => {
    const postFetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/cafe/${id}/get-post`
        );
        setcafeData(response.data);
      } catch (error) {
        console.error("포스트를 찾을 수 없습니다", error);
      }
    };
    postFetchData();
  }, []);

  if (!cafeData) {
    return <div>에러: 데이터가 없습니다</div>;
  }
  return (
    <section className="CafeDataView">
      <div className="cafedataview-wrap">
        <article className="cafedataview-search"></article>
        <article className="cafedataview-titlebox">
          <h2 className="cafedataview-titlebox-title">{cafeData.name}</h2>
          <p className="cafedataview-titlebox-address">{cafeData.address}</p>
          <div className="cafedataview-titlebox-line"></div>
        </article>
        <article className="cafedataview-intro">
          <div className="cafedataview-intro-main">
            <div className="cafedataview-intro-textbox">
              <h3 className="cafedataview-intro-textbox-title">카페 소개</h3>
              <p className="cafedataview-intro-textbox-content">
                {cafeData.intro !== null
                  ? cafeData.intro
                  : "등록된 소개가 없습니다"}
              </p>
            </div>
            <CafeDataMenu menu={cafeData.menus} />
            <CafeDataImg image={cafeData.imageUrls} />
            <CafeDataReview />
          </div>
          <aside className="cafedataview-intro-link">
            <h4>메신저</h4>
            <ul className="cafedataview-intro-link-linklist">
              <li>
                <img src={phone} />
                <p>{cafeData.phone}</p>
              </li>
              <li>
                <img src={instagram} />
                <p
                  onClick={() => {
                    window.open(`${cafeData.instagram}`);
                  }}
                  className="cafedataview-intro-link-linklist-url"
                >
                  {cafeData.instagram}
                </p>
              </li>
              <li>
                <img src={webIcon} />
                <p
                  onClick={() => {
                    window.open(`${cafeData.instagram}`);
                  }}
                  className="cafedataview-intro-link-linklist-url"
                >
                  {cafeData.webUrl}
                </p>
              </li>
            </ul>
            <div className="cafedataview-intro-link-button">
              <button
                onClick={handleReviewButtonClick}
                className="cafedataview-intro-link-button-review"
                disabled={isCheckingReview || authLoading}
                style={{
                  opacity: isCheckingReview || authLoading ? 0.6 : 1,
                  cursor:
                    isCheckingReview || authLoading ? "not-allowed" : "pointer",
                }}
              >
                {authLoading
                  ? "로딩 중..."
                  : isCheckingReview
                  ? "확인 중..."
                  : "리뷰작성"}
              </button>
              <button
                onClick={() => {
                  alert("기능 추가 예정입니다");
                }}
                className="cafedataview-intro-link-button-report"
              >
                제보하기
              </button>
            </div>
          </aside>
        </article>
      </div>
    </section>
  );
};

export default CafeDataView;
