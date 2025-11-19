import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = () => {
  const nav = useNavigate();

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
              />
              <input
                className="loginform-loginbox-form-logininput"
                type="password"
                placeholder="비밀번호 입력"
              />
            </div>
            <div className="loginform-loginbox-form-buttonbox">
              <button className="loginform-loginbox-form-loginbtn">
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
