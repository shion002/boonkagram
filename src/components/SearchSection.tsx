import "./SearchSection.css";
import searchBtn from "./../assets/search-boonka.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "../context/LocationContext";

interface Item {
  filteredCafeId: string;
  name: string;
  address: string;
}

interface SearchResponse {
  nameResults: Item[];
  addressResults: string[];
}

interface SearchSectionProps {
  searchClick: (search: string) => void;
  onNearbySearch?: (lat: number, lon: number) => void;
}

const SearchSection = ({ searchClick, onNearbySearch }: SearchSectionProps) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [cafelist, setCafelist] = useState<Item[]>([]);
  const { lat, lon, isLocationAllowed, requestLocation } = useLocation();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!value.trim()) {
      setCafelist([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get<SearchResponse>(
          `${API_BASE_URL}/api/search/cafe-search?search=${encodeURIComponent(
            value
          )}`,
          { withCredentials: true }
        );
        setCafelist(res.data.nameResults || []);
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, API_BASE_URL]);

  const handleSearch = () => {
    if (value.trim()) {
      searchClick(value.trim());
      setFocused(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleNearbySearch = async () => {
    if (!isLocationAllowed || lat === null || lon === null) {
      const confirm = window.confirm(
        "내 주변 검색을 위해 위치 정보 접근 권한이 필요합니다. 허용하시겠습니까?"
      );

      if (confirm) {
        try {
          await requestLocation();
        } catch (error) {
          console.error(error);
          return;
        }
      } else {
        return;
      }
    }

    if (lat !== null && lon !== null) {
      if (onNearbySearch) {
        onNearbySearch(lat, lon);
      }
      setFocused(false);
    }
  };
  return (
    <section className="SearchSection">
      <article className="searchsection-box">
        <div className="searchsection-box-searchbox">
          <div className="searchsection-box-searchbox-inputbox">
            <input
              value={value}
              onFocus={() => setFocused(true)}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyPress={handleKeyPress}
              type="text"
              className={`searchsection-box-searchbox-inputbox-input ${
                focused ? "focused" : ""
              }`}
              placeholder={`${focused ? "" : "지역 또는 카페이름 검색"}`}
            />
            <button
              onClick={handleSearch}
              className="searchsection-box-searchbox-inputbox-button"
            >
              <img src={searchBtn} />
            </button>
          </div>
          {focused && (
            <div className="searchsection-box-searchbox-autocomplite">
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleNearbySearch();
                  setValue("");
                }}
                className="searchsection-box-searchbox-autocomplite-mysearch"
              >
                내 주변 검색
              </div>
              <div className="searchsection-box-searchbox-line"></div>
              {value !== "" && (
                <>
                  <p className="searchsection-box-searchbox-searchtitle">
                    카페
                  </p>
                  <ul className="searchsection-box-searchbox-autocomplite-filter">
                    {cafelist.length ? (
                      cafelist.map((cafe) => (
                        <li
                          key={cafe.filteredCafeId}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            window.location.href = `/cafe/${cafe.filteredCafeId}`;
                          }}
                        >
                          <p className="searchsection-box-searchbox-autocomplite-filter-name">
                            {cafe.name}
                          </p>
                          <p className="searchsection-box-searchbox-autocomplite-filter-address">
                            {cafe.address}
                          </p>
                        </li>
                      ))
                    ) : (
                      <li className="no-result">검색 결과 없음</li>
                    )}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </article>
      <div className={`signform-focus-wrap ${focused ? "active" : ""}`}></div>
    </section>
  );
};
export default SearchSection;
