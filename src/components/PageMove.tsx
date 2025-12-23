import rightBtn from "./../assets/page-right.svg";
import leftBtn from "./../assets/page-left.svg";
import "./PageMove.css";

interface PageMoveProps {
  bundlePage: number;
  pageClick: (pageNum: number) => void;
  bundleMax: number;
  totalPage: number;
  currentPage: number;
}

const PageMove = ({
  bundlePage,
  pageClick,
  bundleMax,
  totalPage,
  currentPage,
}: PageMoveProps) => {
  const PAGE_SIZE = 7;
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

  const handlePrevBundle = () => {
    if (bundlePage > 1) {
      const newPage = (bundlePage - 2) * PAGE_SIZE + 1;
      pageClick(newPage);
    }
  };

  const handleNextBundle = () => {
    if (bundlePage < bundleMax) {
      const newPage = bundlePage * PAGE_SIZE + 1;
      pageClick(newPage);
    }
  };
  return (
    <article className="recommendlist-page">
      <ul className="recommendlist-page-pagebox">
        <li
          className={`recommendlist-page-pagebox-move ${
            bundlePage === 1 ? "disabled" : ""
          }`}
          onClick={handlePrevBundle}
          style={{
            opacity: bundlePage === 1 ? 0.5 : 1,
            cursor: bundlePage === 1 ? "not-allowed" : "pointer",
          }}
        >
          <img src={leftBtn} alt="이전" />
        </li>
        {pageMap()}
        <li
          className={`recommendlist-page-pagebox-move ${
            bundlePage === bundleMax ? "disabled" : ""
          }`}
          onClick={handleNextBundle}
          style={{
            opacity: bundlePage === bundleMax ? 0.5 : 1,
            cursor: bundlePage === bundleMax ? "not-allowed" : "pointer",
          }}
        >
          <img src={rightBtn} alt="다음" />
        </li>
      </ul>
    </article>
  );
};

export default PageMove;
