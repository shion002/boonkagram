import { useState } from "react";
import searchBtn from "./../../assets/search-boonka.svg";
import "./AdminSearch.css";

interface AdminSearchProps {
  searchClick: (search: string) => void;
}

const AdminSearch = ({ searchClick }: AdminSearchProps) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const handleSearch = () => {
    if (value.trim()) {
      searchClick(value.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="AdminSearch">
      <article className="adminsearch-box">
        <div className="adminsearch-box-searchbox">
          <div className="adminsearch-box-searchbox-inputbox">
            <input
              type="text"
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 100)}
              className={`adminsearch-box-searchbox-inputbox-input ${
                focused ? "focused" : ""
              }`}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              placeholder={`${focused ? "" : "지역 또는 카페이름 검색"}`}
            />
            <button
              onClick={handleSearch}
              className="adminsearch-box-searchbox-inputbox-button"
            >
              <img src={searchBtn} />
            </button>
          </div>
        </div>
      </article>
    </section>
  );
};

export default AdminSearch;
