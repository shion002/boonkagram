import AdminSearch from "./AdminSearch";
import "./ContentSection.css";
import "./CafeManagement.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import type { CafeData } from "../../types/cafeData";
import rightBtn from "./../../assets/page-right.svg";
import leftBtn from "./../../assets/page-left.svg";
import basicImg from "./../../assets/basic-list.webp";

const CafeManagement = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [currentPage, setCurrentPage] = useState(1);
  const [cafeListData, setCafeListData] = useState<CafeData[]>([]);
  const [filterCafeList, setFilterCafeList] = useState<CafeData[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [bundlePage, setBundlePage] = useState(1);
  const [bundleMax, setBundleMax] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const ITEMS_PER_PAGE = 24;
  const PAGE_SIZE = 7;

  const nav = useNavigate();

  useEffect(() => {
    if (isSearchMode) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/list/descend?page=${
            currentPage - 1
          }&size=${ITEMS_PER_PAGE}`
        );

        setCafeListData(response.data.content);

        if (!isInitialized) {
          setTotalPage(response.data.totalPages);
          setBundleMax(Math.ceil(response.data.totalPages / PAGE_SIZE));
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("카페 목록 조회 실패:", error);
      }
    };

    fetchData();
  }, [currentPage, isSearchMode]);

  useEffect(() => {
    if (!isSearchMode || !searchKeyword) return;

    const fetchSearchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/search/list-search-descend?page=${
            currentPage - 1
          }&size=${ITEMS_PER_PAGE}&search=${searchKeyword}`,
          { withCredentials: true }
        );

        setFilterCafeList(response.data.content);
        setTotalPage(response.data.totalPages);
        setBundleMax(Math.ceil(response.data.totalPages / PAGE_SIZE));
      } catch (e) {
        console.error("검색 실패:", e);
      }
    };

    fetchSearchData();
  }, [currentPage, isSearchMode, searchKeyword]);

  const handleSearch = (search: string) => {
    setSearchKeyword(search);
    setIsSearchMode(true);
    setCurrentPage(1);
    setBundlePage(1);
  };

  const deletePost = async (id: number | null) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/cafe/admin/${id}/delete`,
        {},
        { withCredentials: true }
      );
      alert("삭제 완료");
      window.location.href = "/admin";
    } catch (e) {
      console.log("삭제 실패 ", e);
      alert("삭제 실패");
    }
  };

  const pageMap = () => {
    const result = [];

    const end = bundlePage === bundleMax ? totalPage : bundlePage * PAGE_SIZE;

    for (let i = (bundlePage - 1) * PAGE_SIZE + 1; i <= end; i++) {
      result.push(
        <li
          key={i}
          onClick={() => {
            pageClick(i);
          }}
          className={`recommendlist-page-pagebox-pagenum ${
            i === currentPage ? "active" : ""
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

  const displayList = isSearchMode ? filterCafeList : cafeListData;

  return (
    <div className="content-section">
      <AdminSearch searchClick={handleSearch} />
      <section className="admin-cafelist">
        <article className="admin-cafe-post">
          <button
            onClick={() => {
              nav("/admin/post");
            }}
          >
            카페 등록
          </button>
        </article>
        {displayList.map((cafeList) => (
          <article key={cafeList.id} className="admin-cafelist-box">
            <div className="admin-cafelist-img">
              <img
                src={
                  cafeList.thumbnail === null || cafeList.thumbnail === ""
                    ? basicImg
                    : cafeList.thumbnail
                }
              />
            </div>
            <div className="admin-cafelist-content">
              <h3 className="admin-cafelist-content-title">{cafeList.name}</h3>
              <p className="admin-cafelist-content-address">
                {cafeList.address}
              </p>
            </div>
            <div className="admin-cafelist-btnbox">
              <button
                onClick={() => {
                  nav(`/admin/edit/${cafeList.id}`);
                }}
                className="admin-cafelist-btnbox-update"
              >
                수정하기
              </button>
              <button
                onClick={() => {
                  deletePost(cafeList.id);
                }}
                className="admin-cafelist-btnbox-delete"
              >
                삭제하기
              </button>
            </div>
          </article>
        ))}

        <article className="recommendlist-page">
          <ul className="recommendlist-page-pagebox">
            <li
              className="recommendlist-page-pagebox-move"
              onClick={() => {
                if (bundlePage > 1) {
                  const newBundle = bundlePage - 1;
                  setBundlePage(newBundle);
                  setCurrentPage(newBundle * PAGE_SIZE);
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
                  setCurrentPage((newBundle - 1) * PAGE_SIZE + 1);
                }
              }}
            >
              <img src={rightBtn} />
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
};

export default CafeManagement;
