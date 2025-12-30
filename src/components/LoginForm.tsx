import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import axios from "axios";
import { useState } from "react";
import type { ErrorResponse } from "../types/response";

interface LoginRequest {
  username: string;
  password: string;
}

const LoginForm = () => {
  const nav = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const handleLogin = async () => {
    try {
      const loginRequest: LoginRequest = {
        username: usernameValue,
        password: passwordValue,
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        loginRequest,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("로그인 성공", res);
      window.location.href = "/";
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const errorData = e.response.data as ErrorResponse;
        alert(errorData.error);
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
      console.error(e);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <section className="LoginForm">
      <div className="loginform-wrap">
        <article className="loginform-loginbox">
          <h2 className="loginform-loginbox-title">BOONKAGRAM LOGIN</h2>
          <div className="loginform-loginbox-form">
            <div className="loginform-loginbox-form-inputbox">
              <input
                className="loginform-loginbox-form-logininput"
                type="text"
                placeholder="아이디 입력"
                onChange={(e) => {
                  setUsernameValue(e.target.value);
                }}
                onKeyPress={handleKeyPress}
              />
              <input
                className="loginform-loginbox-form-logininput"
                type="password"
                placeholder="비밀번호 입력"
                onChange={(e) => {
                  setPasswordValue(e.target.value);
                }}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="loginform-loginbox-form-buttonbox">
              <button
                onClick={() => {
                  handleLogin();
                }}
                className="loginform-loginbox-form-loginbtn"
              >
                로그인
              </button>
              <button
                onClick={() => {
                  nav("/sign");
                }}
                className="loginform-loginbox-form-loginbtn"
              >
                회원가입
              </button>
            </div>
            <p className="loginform-loginbox-form-findpassword">
              비밀번호를 잊어버렸습니다
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default LoginForm;
