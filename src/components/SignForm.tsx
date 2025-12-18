import { useRef, useState } from "react";
import "./SignForm.css";
import { useNavigate } from "react-router-dom";
import CountdownTimer, { type CountdownTimerHandles } from "../util/CountDown";
import axios from "axios";
import type { MemberRequest } from "../types/member";

const SignForm = () => {
  const [phoneFindCheck, setPhoneFindCheck] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState("");
  const [phoneSuccess, setPhoneSuccess] = useState(false);

  const [usernameValue, setUsernameValue] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState(false);

  const [passwordValue, setPasswordValue] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordConfirmValue, setPasswordConfirmValue] = useState("");
  const [passwordConfirmStatus, setPasswordConfirmStatus] = useState("");
  const [passwordConfirmSuccess, setPasswordConfirmSuccess] = useState(false);

  const FIRST_NUMBER = "010";
  const [secondNumber, setSecondNumber] = useState("");
  const [thirdNumber, setThirdNumber] = useState("");

  const [nicknameValue, setNicknameValue] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState("");
  const [nicknameSuccess, setNicknameSuccess] = useState(false);

  const [verifyValue, setVerifyValue] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);

  const timerRef = useRef<CountdownTimerHandles>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const checkUsername = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/auth/check-username?username=${usernameValue}`
      );

      if (res.data) {
        setUsernameStatus("사용 가능한 아이디입니다");
        setUsernameSuccess(true);
      } else {
        setUsernameStatus("이미 사용중인 아이디입니다.");
        setUsernameSuccess(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const verifySendCode = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/send-code?phoneNumber=${
          FIRST_NUMBER + secondNumber + thirdNumber
        }`
      );
      return res.data;
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const signupMember = async () => {
    try {
      const memberData: MemberRequest = {
        username: usernameValue,
        password: passwordValue,
        phone: FIRST_NUMBER + secondNumber + thirdNumber,
        nickname: nicknameValue,
      };

      await axios.post(`${API_BASE_URL}/api/auth/signup`, memberData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      nav("/login");
    } catch (e) {
      console.error(e);
    }
  };

  const isVerify = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-code?phoneNumber=${
          FIRST_NUMBER + secondNumber + thirdNumber
        }&code=${verifyValue}`
      );

      if (res.data) {
        setVerifySuccess(true);
        setVerifyStatus("인증이 완료되었습니다");
        timerRef.current?.pause();
        return;
      }

      setVerifyStatus("인증에 실패하였습니다");
      setVerifySuccess(false);
    } catch (e) {
      console.error(e);
    }
  };

  const findNickname = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/auth/check-nickname?nickname=${nicknameValue}`
      );
      if (res.data) {
        setNicknameStatus("사용 가능한 닉네임입니다");
        setNicknameSuccess(true);
      } else {
        setNicknameStatus("이미 존재하는 닉네임입니다");
        setNicknameSuccess(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkPhone = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/auth/check-phone?phone=${
          FIRST_NUMBER + secondNumber + thirdNumber
        }`
      );
      if (res.data) {
        verifySendCode();
        setPhoneSuccess(true);
        setPhoneStatus("인증번호가 요청되었습니다");
        timerRef.current?.start();
      } else {
        setPhoneStatus("이미 존재하는 번호입니다");
        setPhoneSuccess(false);
      }
    } catch (e) {
      console.error(e);
    }
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
                  setUsernameValue(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  const regex = /^[a-z0-9]+$/;
                  if (usernameValue.length < 6) {
                    setUsernameStatus("아이디를 6자 이상 입력하세요");
                    setUsernameSuccess(false);
                    return;
                  }

                  if (!regex.test(usernameValue)) {
                    setUsernameStatus("소문자 영문과 숫자를 입력하세요");
                    setUsernameSuccess(false);
                    return;
                  }
                  checkUsername();
                }}
                className="signform-form-usernamebox-findcheckbox-button"
              >
                중복확인
              </button>
            </div>
            <p
              className={`signform-form-checkstatus ${
                usernameValue.length > 0 ? "active" : ""
              }`}
              style={{ color: usernameSuccess ? "#02c302" : "red" }}
            >
              {usernameStatus}
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
                  style={{ backgroundColor: "#875a4015", color: "#a7a7a7" }}
                  type="text"
                  value={FIRST_NUMBER}
                  readOnly
                />{" "}
                -
                <input
                  className="signform-form-phoneinput"
                  type="text"
                  readOnly={phoneSuccess}
                  onChange={(e) => {
                    setSecondNumber(e.target.value);
                  }}
                />{" "}
                -
                <input
                  className="signform-form-phoneinput"
                  type="text"
                  readOnly={phoneSuccess}
                  onChange={(e) => {
                    setThirdNumber(e.target.value);
                  }}
                />
              </div>
              <button
                onClick={() => {
                  setPhoneFindCheck(true);
                  if (secondNumber.length === 4 && thirdNumber.length === 4) {
                    checkPhone();
                  } else {
                    setPhoneStatus("잘못된 핸드폰번호 양식입니다");
                  }
                }}
                className={`signform-form-phonecheck-button ${
                  phoneSuccess ? "none" : ""
                }`}
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
          <div className={`signform-form-box ${!phoneSuccess ? "none" : ""}`}>
            <div className="signform-form-box-phonecheck-validbox">
              <input
                className="signform-form-input"
                type="text"
                placeholder="인증번호 입력"
                onChange={(e) => {
                  setVerifyValue(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  isVerify();
                }}
                className="signform-form-phonecheck-button"
              >
                인증하기
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await verifySendCode();

                    if (response.ok) {
                      timerRef.current?.reset();
                    } else {
                      const error = await response.text();
                      window.alert(error);
                    }
                  } catch (e) {
                    window.alert("인증번호 발송에 실패했습니다.");
                    console.error(e);
                  }
                }}
                className="signform-form-phonecheck-button"
              >
                인증번호 재요청
              </button>
            </div>
            <CountdownTimer ref={timerRef} autoStart={false} />
            <p
              className={`signform-form-checkstatus ${
                verifyStatus.length > 0 ? "active" : ""
              }`}
              style={{ color: verifySuccess ? "#02c302" : "red" }}
            >
              {verifyStatus}
            </p>
          </div>
          <div className="signform-form-box">
            <input
              className="signform-form-input"
              type="text"
              placeholder="닉네임 입력"
              onChange={(e) => {
                const value = e.target.value;
                setNicknameValue(value);

                if (value.length < 2) {
                  setNicknameStatus("닉네임은 2자 이상이여야 합니다");
                  return;
                }
                findNickname();
              }}
            />
            <p
              className={`signform-form-checkstatus ${
                nicknameValue.length > 0 ? "active" : ""
              }`}
              style={{ color: nicknameSuccess ? "#02c302" : "red" }}
            >
              {nicknameStatus}
            </p>
          </div>
          <div className="signform-form-submitbox">
            <button
              onClick={() => {
                if (
                  usernameSuccess &&
                  passwordSuccess &&
                  passwordConfirmSuccess &&
                  phoneSuccess &&
                  verifySuccess
                ) {
                  signupMember();
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
