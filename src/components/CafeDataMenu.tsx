import { useEffect, useState } from "react";
import "./CafeDataMenu.css";

interface MenuProps {
  menu: { name: string; price: number }[] | null;
}

const CafeDataMenu = ({ menu }: MenuProps) => {
  const [menuPage, setMenuPage] = useState(5);
  const [displayMenu, setDisplayMenu] = useState<
    { name: string; price: number }[]
  >([]);
  useEffect(() => {
    if (menu) {
      setDisplayMenu(menu.slice(0, menuPage));
    }
  }, [menuPage]);

  return (
    <div className="cafedataview-intro-menubox">
      <h3 className="cafedataview-intro-menubox-title">메뉴</h3>
      <ul className="cafedataview-intro-menubox-menulist">
        {displayMenu.length > 0 ? (
          displayMenu.map((menu, idx) => (
            <li key={idx}>
              <p>{menu.name}</p>
              <div className="cafedataview-intro-menubox-menulist-line"></div>
              <p>{menu.price.toLocaleString()}원</p>
            </li>
          ))
        ) : (
          <div className="cafedataview-intro-menubox-menulist-nullmenu">
            등록된 메뉴가 없습니다.
          </div>
        )}
      </ul>
      {menu && menuPage < menu.length && (
        <div
          className="cafedataview-intro-imgbox-more"
          onClick={() => {
            setMenuPage(Math.min(menuPage + 6, menu.length));
          }}
        >
          메뉴 더보기
        </div>
      )}
    </div>
  );
};

export default CafeDataMenu;
