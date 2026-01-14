import "./RecommendList.css";
import basicImg from "./../assets/basic-list.webp";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ratingCalc, type CafeData } from "../types/cafeData";
import axios from "axios";
import SearchSection from "./SearchSection";
import PageMove from "./PageMove";

const RecommendList = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [searchParams, setSearchParams] = useSearchParams();
  const nav = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [cafeListData, setCafeListData] = useState<CafeData[]>([]);
  const [filterCafeList, setFilterCafeList] = useState<CafeData[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [bundlePage, setBundlePage] = useState(1);
  const [bundleMax, setBundleMax] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isNearbyMode, setIsNearbyMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 24;
  const PAGE_SIZE = 7;

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1");
    const searchFromUrl = searchParams.get("search") || "";
    const nearbyFromUrl = searchParams.get("nearby") === "true";
    const latFromUrl = parseFloat(searchParams.get("lat") || "0");
    const lonFromUrl = parseFloat(searchParams.get("lon") || "0");

    setCurrentPage(pageFromUrl);
    setBundlePage(Math.ceil(pageFromUrl / PAGE_SIZE));

    if (searchFromUrl) {
      setIsSearchMode(true);
      setIsNearbyMode(false);
      setSearchKeyword(searchFromUrl);
      setUserLocation(null);
    } else if (nearbyFromUrl && latFromUrl && lonFromUrl) {
      setIsNearbyMode(true);
      setIsSearchMode(false);
      setSearchKeyword("");
      setUserLocation({ lat: latFromUrl, lon: lonFromUrl });
    } else {
      setIsSearchMode(false);
      setIsNearbyMode(false);
      setSearchKeyword("");
      setUserLocation(null);
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [searchParams]);

  const updateUrlParams = (params: {
    page?: number;
    search?: string;
    nearby?: boolean;
    lat?: number;
    lon?: number;
  }) => {
    const newParams = new URLSearchParams();

    if (params.page && params.page > 1) {
      newParams.set("page", params.page.toString());
    }

    if (params.search) {
      newParams.set("search", params.search);
    }

    if (params.nearby && params.lat && params.lon) {
      newParams.set("nearby", "true");
      newParams.set("lat", params.lat.toString());
      newParams.set("lon", params.lon.toString());
    }

    setSearchParams(newParams);
  };

  useEffect(() => {
    if (isSearchMode || isNearbyMode) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/list/descend?page=${
            currentPage - 1
          }&size=${ITEMS_PER_PAGE}`
        );
        setCafeListData(response.data.content);
        setTotalPage(response.data.totalPages);
        setBundleMax(Math.ceil(response.data.totalPages / PAGE_SIZE));

        if (!isInitialized) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, isSearchMode, isNearbyMode]);

  useEffect(() => {
    if (!isSearchMode || !searchKeyword || isNearbyMode) return;

    const fetchSearchData = async () => {
      setIsLoading(true);
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
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchData();
  }, [currentPage, isSearchMode, searchKeyword, isNearbyMode]);

  useEffect(() => {
    if (!isNearbyMode || !userLocation) return;

    const fetchNearbyData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/search/nearby?lat=${userLocation.lat}&lon=${
            userLocation.lon
          }&page=${currentPage - 1}&size=${ITEMS_PER_PAGE}`,
          { withCredentials: true }
        );

        setFilterCafeList(response.data.content);
        setTotalPage(response.data.totalPages);
        setBundleMax(Math.ceil(response.data.totalPages / PAGE_SIZE));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyData();
  }, [currentPage, isNearbyMode, userLocation]);

  const handleNearbySearch = async (lat: number, lon: number) => {
    updateUrlParams({
      page: 1,
      nearby: true,
      lat,
      lon,
    });
  };

  const handleSearch = (search: string) => {
    updateUrlParams({
      page: 1,
      search,
    });
  };

  const handleResetSearch = () => {
    setSearchParams(new URLSearchParams());
  };

  const pageClick = (pageNum: number) => {
    if (isNearbyMode && userLocation) {
      updateUrlParams({
        page: pageNum,
        nearby: true,
        lat: userLocation.lat,
        lon: userLocation.lon,
      });
    } else if (isSearchMode) {
      updateUrlParams({
        page: pageNum,
        search: searchKeyword,
      });
    } else {
      updateUrlParams({
        page: pageNum,
      });
    }
  };

  const displayList =
    isSearchMode || isNearbyMode ? filterCafeList : cafeListData;

  return (
    <>
      <SearchSection
        searchClick={handleSearch}
        onNearbySearch={handleNearbySearch}
      />
      <section className="RecommendList">
        <div className="recommndlist-wrap">
          <article className="recommndlist-listbox">
            <div className="recommndlist-listbox-header">
              <h2 className="recommndlist-listbox-title">
                {isNearbyMode
                  ? "내 주변 카페"
                  : isSearchMode
                  ? `"${searchKeyword}" 검색 결과`
                  : "추천 카페"}
              </h2>
              {(isSearchMode || isNearbyMode) && (
                <button
                  className="recommndlist-listbox-reset"
                  onClick={handleResetSearch}
                >
                  전체 목록 보기
                </button>
              )}
            </div>
            {isLoading ? (
              <div className="recommndlist-listbox-empty">
                <p>검색 중...</p>
              </div>
            ) : displayList.length === 0 ? (
              <div className="recommndlist-listbox-empty">
                <p>검색 결과가 없습니다.</p>
              </div>
            ) : (
              <ul className="recommndlist-listbox-list">
                {displayList.map((cafe) => (
                  <li
                    onClick={() => {
                      nav(`/cafe/${cafe.id}`);
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
                          <img src={ratingCalc(cafe.rating, 1)} alt="" />
                          <img src={ratingCalc(cafe.rating, 2)} alt="" />
                          <img src={ratingCalc(cafe.rating, 3)} alt="" />
                          <img src={ratingCalc(cafe.rating, 4)} alt="" />
                          <img src={ratingCalc(cafe.rating, 5)} alt="" />
                        </div>
                        <h5 className="recommendlist-listbox-list-contentbox-ratingbox-score">
                          {cafe.rating != null
                            ? Number(cafe.rating).toFixed(1)
                            : "0.0"}
                        </h5>
                        <div className="recommndlist-listbox-list-contentbox-ratingbox-comment">
                          <p>리뷰</p>
                          <p>{cafe.reviewCount}</p>
                        </div>
                      </div>
                      <div className="recommndlist-listbox-list-contentbox-address">
                        <p>{cafe.address}</p>
                      </div>
                      <div className="recommndlist-listbox-list-contentbox-intro">
                        <p>{cafe.titleIntro}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
          {displayList.length > 0 && (
            <PageMove
              bundlePage={bundlePage}
              pageClick={pageClick}
              bundleMax={bundleMax}
              totalPage={totalPage}
              currentPage={currentPage}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default RecommendList;
