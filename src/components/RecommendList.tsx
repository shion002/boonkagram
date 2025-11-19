import "./RecommendList.css";
import basicImg from "./../assets/basic-list.webp";
import img1 from "./../assets/boonka-background-computer.webp";
import img2 from "./../assets/gyenggi-local.webp";
import rightBtn from "./../assets/page-right.svg";
import leftBtn from "./../assets/page-left.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ratingCalc, type CafeData } from "../util/CafeData";

const RecommendList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cafeListData, setCafeListData] = useState<CafeData[]>([]);
  const [displayListData, setDisplayListData] = useState<CafeData[]>([]);
  const [page, setPage] = useState(1);
  const [bundlePage, setBundlePage] = useState(1);
  const [bundleMax, setBundleMax] = useState(0);
  const pageSize = 7;
  const displaySize = 24;
  const nav = useNavigate();

  const allCafeData: CafeData[] = Array.from({ length: 400 }, (_, i) => ({
    id: i + 1,
    name: `카페 ${i + 1}`,
    thumbnail: i % 2 === 0 ? img1 : img2,
    ratingScore: Math.round(Math.random() * 50) / 10,
    commentScore: Math.floor(Math.random() * 100),
    address: "대전 서구 정림동",
    intro: `카페 소개 ${i + 1}`,
  }));

  useEffect(() => {
    setCafeListData(allCafeData);
    setPage(Math.ceil(allCafeData.length / 24));
  }, []);

  useEffect(() => {
    setBundleMax(Math.ceil(page / pageSize));
  }, [page]);

  const pageMap = () => {
    const result = [];

    const end = bundlePage === bundleMax ? page : bundlePage * pageSize;

    for (let i = (bundlePage - 1) * pageSize + 1; i <= end; i++) {
      result.push(
        <li
          key={i}
          onClick={() => {
            pageClick(i);
          }}
          className={`recommendlist-page-pagebox-pagenum ${
            i == currentPage ? "active" : ""
          }`}
        >
          {i}
        </li>
      );
    }
    return result;
  };

  const pageClick = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  useEffect(() => {
    const start = (currentPage - 1) * displaySize;
    const end = start + displaySize;
    setDisplayListData(cafeListData.slice(start, end));
  }, [currentPage, cafeListData]);

  return (
    <section className="RecommendList">
      <div className="recommndlist-wrap">
        <article className="recommndlist-listbox">
          <h2 className="recommndlist-listbox-title">추천 카페</h2>
          <ul className="recommndlist-listbox-list">
            {displayListData.map((cafe) => (
              <li
                onClick={() => {
                  nav(`/cafe/${cafe.id}`, { state: cafe });
                }}
                key={cafe.id}
              >
                <div className="recommndlist-listbox-list-imgbox">
                  <img
                    src={
                      cafe.thumbnail === null || cafe.thumbnail === ""
                        ? basicImg
                        : cafe.thumbnail
                    }
                  />
                </div>
                <div className="recommndlist-listbox-list-contentbox">
                  <h2 className="recommndlist-listbox-list-contentbox-title">
                    {cafe.name}
                  </h2>
                  <div className="recommndlist-listbox-list-contentbox-ratingbox">
                    <div className="recommndlist-listbox-list-contentbox-ratingbox-rating">
                      <img src={ratingCalc(cafe.ratingScore, 1)} />
                      <img src={ratingCalc(cafe.ratingScore, 2)} />
                      <img src={ratingCalc(cafe.ratingScore, 3)} />
                      <img src={ratingCalc(cafe.ratingScore, 4)} />
                      <img src={ratingCalc(cafe.ratingScore, 5)} />
                    </div>
                    <h5 className="recommndlist-listbox-list-contentbox-ratingbox-score">
                      {cafe.ratingScore}
                    </h5>
                    <div className="recommndlist-listbox-list-contentbox-ratingbox-comment">
                      <p>리뷰</p>
                      <p>{cafe.commentScore}</p>
                    </div>
                  </div>
                  <div className="recommndlist-listbox-list-contentbox-address">
                    <p>{cafe.address}</p>
                  </div>
                  <div className="recommndlist-listbox-list-contentbox-intro">
                    <p>{cafe.intro}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </article>
        <article className="recommendlist-page">
          <ul className="recommendlist-page-pagebox">
            <li
              className="recommendlist-page-pagebox-move"
              onClick={() => {
                if (bundlePage > 1) {
                  const newBundle = bundlePage - 1;
                  setBundlePage(newBundle);
                  setCurrentPage(newBundle * pageSize);
                }
              }}
            >
              <img src={leftBtn} />
            </li>
            {pageMap()}
            <li
              className="recommendlist-page-pagebox-move"
              onClick={() => {
                if (bundlePage < bundleMax) {
                  const newBundle = bundlePage + 1;
                  setBundlePage(newBundle);
                  setCurrentPage((newBundle - 1) * 7 + 1);
                }
              }}
            >
              <img src={rightBtn} />
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
};

export default RecommendList;
