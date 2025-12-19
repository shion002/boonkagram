import "./Header.css";
import logo from "./../assets/boonka-logo-b.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const nav = useNavigate();
  const { isAuthenticated } = useAuth();

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
          <button
            onClick={() => {
              {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                isAuthenticated ? nav("/info") : nav("/login");
              }
            }}
          >
            {isAuthenticated ? "내 정보" : "로그인"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
