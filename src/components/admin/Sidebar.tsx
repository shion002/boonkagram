import React from "react";
import "./Sidebar.css";

type MenuType = "cafe" | "user" | "review";

interface SidebarProps {
  activeMenu: MenuType;
  setActiveMenu: (menu: MenuType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  setActiveMenu,
  isOpen,
  onClose,
}) => {
  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="admin-logo">
          <h2>관리자</h2>
        </div>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <nav className="admin-nav">
        <button
          className={`nav-item ${activeMenu === "cafe" ? "active" : ""}`}
          onClick={() => setActiveMenu("cafe")}
        >
          카페관리
        </button>
        <button
          className={`nav-item ${activeMenu === "user" ? "active" : ""}`}
          onClick={() => setActiveMenu("user")}
        >
          회원관리
        </button>
        <button
          className={`nav-item ${activeMenu === "review" ? "active" : ""}`}
          onClick={() => setActiveMenu("review")}
        >
          리뷰관리
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
