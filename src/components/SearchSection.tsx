import "./SearchSection.css";
import searchBtn from "./../assets/search-boonka.svg";
import { useState } from "react";

interface Item {
  id: string;
  name: string;
  address: string;
}

const data: Item[] = [
  { id: "1", name: "더 숨", address: "대전 서구 정림동" },
  { id: "2", name: "투썸잠실점", address: "서울 송파구 잠실" },
  { id: "3", name: "본오", address: "부산 해운대구 해운대" },
  { id: "4", name: "모비리", address: "대구 달서구 판암동" },
  { id: "5", name: "가나다", address: "경기도 수원시 팔달구" },
  { id: "6", name: "마바라", address: "대전 중구 은행동" },
  { id: "7", name: "기디노", address: "대전 동구 판암동" },
  { id: "8", name: "니미리", address: "대전 서구 둔산동" },
  { id: "9", name: "바라라", address: "서울 중랑구 면목동" },
  { id: "10", name: "라라지", address: "대전 서구 정림동" },
];

const SearchSection = () => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const filteredName = data
    .filter((item) => item.name.includes(value))
    .slice(0, 7);
  const filteredAddress = Array.from(
    new Set(
      data
        .filter((item) => item.address.includes(value))
        .map((item) => item.address)
    )
  );

  /*
  useEffect(() => {

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `/api/search?keyword=${encodeURIComponent(value)}`
        );
        setList(res.data.slice(0, 10));
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);
  */

  return (
    <section className="SearchSection">
      <article className="searchsection-box">
        <div className="searchsection-box-searchbox">
          <div className="searchsection-box-searchbox-inputbox">
            <input
              onFocus={() => setFocused(true)}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              type="text"
              className={`searchsection-box-searchbox-inputbox-input ${
                focused ? "focused" : ""
              }`}
              placeholder={`${focused ? "" : "지역 또는 카페이름 검색"}`}
            />
            <button className="searchsection-box-searchbox-inputbox-button">
              <img src={searchBtn} />
            </button>
          </div>
          {focused && (
            <div className="searchsection-box-searchbox-autocomplite">
              <div className="searchsection-box-searchbox-autocomplite-mysearch">
                내 주변 검색
              </div>
              <div className="searchsection-box-searchbox-line"></div>
              {value !== "" && (
                <>
                  <p className="searchsection-box-searchbox-searchtitle">
                    카페
                  </p>
                  <ul className="searchsection-box-searchbox-autocomplite-filter">
                    {filteredName.length ? (
                      filteredName.map((cafe) => (
                        <li key={cafe.id}>
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

                  <div className="searchsection-box-searchbox-line"></div>
                  <p className="searchsection-box-searchbox-searchtitle">
                    지역
                  </p>
                  <ul className="searchsection-box-searchbox-autocomplite-filter">
                    {filteredAddress.length ? (
                      filteredAddress.map((address, idx) => (
                        <li key={idx}>{address}</li>
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
