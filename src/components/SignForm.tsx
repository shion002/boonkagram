import { useState } from "react";
import "./SignForm.css";
import { useNavigate } from "react-router-dom";

const SignForm = () => {
  const idCheck = true;
  const phoneCheck = true;
  const phone = "01012345678";

  const [findCheck, setFindCheck] = useState(false);
  const [idValue, setIdValue] = useState("");
  const [idStatus, setIdStatus] = useState("");
  const [idSuccess, setIdSuccess] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordConfirmValue, setPasswordConfirmValue] = useState("");
  const [passwordConfirmStatus, setPasswordConfirmStatus] = useState("");
  const [passwordConfirmSuccess, setPasswordConfirmSuccess] = useState(false);
  const [phoneFindCheck, setPhoneFindCheck] = useState(false);
  const [phoneValue, setPhoneValue] = useState("010");
  const [phoneStatus, setPhoneStatus] = useState("");
  const [phoneSuccess, setPhoneSuccess] = useState(false);

  const nav = useNavigate();

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={[}\];:'",.<>/?`~|\\]).{8,}$/;
  const passwordMatch = (valueMatch: boolean) => {
    if (valueMatch) {
      setPasswordConfirmStatus("비밀번호가 일치합니다");
    } else {
      setPasswordConfirmStatus("비밀번호가 일치하지 않습니다");
    }
    setPasswordConfirmSuccess(valueMatch);
  };

  return (
    <section className="SignForm">
      <div className="signform-wrap">
        <article className="signform-form">
          <h2 className="signform-form-title">회원가입</h2>
          <div className="signform-form-box">
            <div className="signform-form-usernamebox-findcheckbox">
              <input
                className="signform-form-input"
                type="text"
                placeholder="아이디 입력"
                onChange={(e) => {
                  setIdValue(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  const regex = /^[a-z0-9]+$/;
                  setFindCheck(true);
                  if (idValue.length < 6) {
                    setIdStatus("아이디를 6자 이상 입력하세요");
                    setIdSuccess(false);
                    return;
                  }

                  if (!regex.test(idValue)) {
                    setIdStatus("소문자 영문과 숫자를 입력하세요");
                    setIdSuccess(false);
                    return;
                  }

                  if (idCheck) {
                    setIdStatus("사용 가능한 아이디입니다");
                    setIdSuccess(true);
                  } else {
                    setIdStatus("이미 사용중인 아이디입니다.");
                    setIdSuccess(false);
                  }
                }}
                className="signform-form-usernamebox-findcheckbox-button"
              >
                중복확인
              </button>
            </div>
            <p
              className={`signform-form-checkstatus ${
                findCheck ? "active" : ""
              }`}
              style={{ color: idSuccess ? "#02c302" : "red" }}
            >
              {idStatus}
            </p>
          </div>
          <div className="signform-form-box">
            <input
              className="signform-form-input"
              type="password"
              placeholder="비밀번호 입력"
              onChange={(e) => {
                const value = e.target.value;
                setPasswordValue(value);

                const valueMatch = value === passwordConfirmValue;

                if (passwordRegex.test(value)) {
                  setPasswordStatus("사용 가능한 비밀번호입니다");
                } else {
                  setPasswordStatus(
                    "영문, 숫자, 특수문자로 8자 이상 입력하세요"
                  );
                }
                setPasswordSuccess(passwordRegex.test(value));

                passwordMatch(valueMatch);
              }}
            />
            <p
              className={`signform-form-checkstatus ${
                passwordValue.length > 0 ? "active" : ""
              }`}
              style={{
                color: passwordSuccess ? "#02c302" : "red",
              }}
            >
              {passwordStatus}
            </p>
          </div>
          <div className="signform-form-box">
            <input
              className="signform-form-input"
              type="password"
              placeholder="비밀번호 확인"
              onChange={(e) => {
                const value = e.target.value;
                const valueMatch = value === passwordValue;
                setPasswordConfirmValue(value);

                passwordMatch(valueMatch);
              }}
            />
            <p
              className={`signform-form-checkstatus ${
                passwordConfirmValue.length > 0 ? "active" : ""
              }`}
              style={{ color: passwordConfirmSuccess ? "#02c302" : "red" }}
            >
              {passwordConfirmStatus}
            </p>
          </div>
          <div className="signform-form-box">
            <div className="signform-form-box-phonecheckbox">
              <div className="signform-form-box-phoneinputbox">
                <input
                  className="signform-form-phoneinput"
                  type="text"
                  value={phoneValue.slice(0, 3)}
                  readOnly
                />{" "}
                -
                <input
                  className="signform-form-phoneinput"
                  type="text"
                  value={phoneValue.slice(3, 7)}
                  readOnly
                />{" "}
                -
                <input
                  className="signform-form-phoneinput"
                  type="text"
                  value={phoneValue.slice(7, 11)}
                  readOnly
                />
              </div>
              <button
                onClick={() => {
                  setPhoneFindCheck(true);
                  if (phoneCheck) {
                    setPhoneValue(phone);
                    setPhoneStatus("인증이 완료되었습니다");
                  } else {
                    setPhoneStatus("이미 해당 번호로 가입된 계정이 있습니다.");
                  }
                  setPhoneSuccess(phoneCheck);
                }}
                className="signform-form-phonecheck-button"
              >
                휴대폰 인증
              </button>
            </div>
            <p
              className={`signform-form-checkstatus ${
                phoneFindCheck ? "active" : ""
              }`}
              style={{ color: phoneSuccess ? "#02c302" : "red" }}
            >
              {phoneStatus}
            </p>
          </div>
          <div className="signform-form-submitbox">
            <button
              onClick={() => {
                if (
                  idSuccess &&
                  passwordSuccess &&
                  passwordConfirmSuccess &&
                  phoneSuccess
                ) {
                  alert("가입이 완료되었습니다");
                  nav("/login");
                }
              }}
              className="signform-form-submitbox-button"
            >
              가입하기
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default SignForm;
