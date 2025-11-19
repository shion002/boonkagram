import "./Header.css";
import logo from "./../assets/boonka-logo-b.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const nav = useNavigate();

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
              nav("/login");
            }}
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
