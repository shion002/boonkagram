import { useState, useEffect } from "react";
import CafeManagement from "./CafeManagement";
import Sidebar from "./Sidebar";
import UserManagement from "./UserManagement";
import ReviewManagement from "./ReviewManagement";
import Header from "./Header";
import "./AdminMain.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import CafePost from "./CafePost";
import CafeEditPage from "./CafeEditPage";

type MenuType = "cafe" | "user" | "review";

const AdminMain = () => {
  const [activeMenu, setActiveMenu] = useState<MenuType>("cafe");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에 따라 activeMenu 설정
  useEffect(() => {
    if (
      location.pathname === "/admin" ||
      location.pathname.includes("/admin/post") ||
      location.pathname.includes("/admin/edit")
    ) {
      setActiveMenu("cafe");
    } else if (location.pathname.includes("/admin/user")) {
      setActiveMenu("user");
    } else if (location.pathname.includes("/admin/review")) {
      setActiveMenu("review");
    }
  }, [location.pathname]);

  const handleMenuChange = (menu: MenuType) => {
    setActiveMenu(menu);
    setSidebarOpen(false);

    // 메뉴에 따라 경로 변경
    switch (menu) {
      case "cafe":
        navigate("/admin");
        break;
      case "user":
        navigate("/admin/user");
        break;
      case "review":
        navigate("/admin/review");
        break;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={handleMenuChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-main">
        <Header
          activeMenu={activeMenu}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<CafeManagement />} />
            <Route path="/user" element={<UserManagement />} />
            <Route path="/review" element={<ReviewManagement />} />
            <Route path="/post" element={<CafePost mode="create" />} />
            <Route path="/edit/:id" element={<CafeEditPage />} />
          </Routes>
        </div>
      </main>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminMain;
