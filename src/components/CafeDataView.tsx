import { useParams } from "react-router-dom";
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

const CafeDataView = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [cafeData, setcafeData] = useState<PostData>();

  const { id } = useParams();

  useEffect(() => {
    const postFetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/cafe/get-post?cafeId=${id}`
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
            <CafeDataReview review={cafeData.review} />
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
                <p>{cafeData.instagram}</p>
              </li>
              <li>
                <img src={webIcon} />
                <p>{cafeData.webUrl}</p>
              </li>
            </ul>
            <div className="cafedataview-intro-link-button">
              <button
                onClick={() => {
                  alert("기능 추가 예정입니다");
                }}
                className="cafedataview-intro-link-button-review"
              >
                리뷰작성
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
