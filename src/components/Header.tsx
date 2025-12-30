import "./Header.css";
import logo from "./../assets/boonka-logo-b.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Header = () => {
  const nav = useNavigate();
  const { isAuthenticated, checkAuth } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleMyInfoClick = async () => {
    if (!isAuthenticated) {
      nav("/login");
      return;
    }

    try {
      await axios.get(`${API_BASE_URL}/api/users/me`, {
        withCredentials: true,
      });
      nav("/info");
    } catch (error) {
      alert("세션이 만료되었습니다");
      await checkAuth();
      nav("/login");
    }
  };

  return (
    <header className="Header">
      <div className="header-wrap">
        <div
          className="header-logo"
          onClick={() => {
            nav("/");
          }}
        >
          <img src={logo} />
        </div>
        <div className="login-button">
          <button onClick={handleMyInfoClick}>
            {isAuthenticated ? "내 정보" : "로그인"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
