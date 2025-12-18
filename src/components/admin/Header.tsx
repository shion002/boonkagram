import React from "react";
import "./Header.css";

type MenuType = "cafe" | "user" | "review";

interface HeaderProps {
  activeMenu: MenuType;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeMenu, onMenuToggle }) => {
  const getTitle = () => {
    switch (activeMenu) {
      case "cafe":
        return "카페관리";
      case "user":
        return "회원관리";
      case "review":
        return "리뷰관리";
      default:
        return "";
    }
  };

  return (
    <header className="admin-header">
      <button className="menu-toggle-btn" onClick={onMenuToggle}>
        ☰
      </button>
      <h1>{getTitle()}</h1>
    </header>
  );
};

export default Header;
