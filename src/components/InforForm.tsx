import type { UserData } from "../types/userData";
import "./InforForm.css";
import profileBasic from "./../assets/profile-basic.webp";
import example1 from "./../assets/example1.jpg";
import example2 from "./../assets/example2.jpg";
import example3 from "./../assets/example3.jpg";
import example4 from "./../assets/example4.jpg";
import example5 from "./../assets/example5.jpg";
import example6 from "./../assets/example6.jpg";
import example7 from "./../assets/example7.jpg";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LogData {
  id: string;
  cafename: string;
  address: string;
  cafeImg: string;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  fileUrl: string;
}

interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
}

const InforForm = () => {
  const [logPage, setLogPage] = useState(3);
  const [displayLog, setDisplayLog] = useState<LogData[]>([]);
  const [tab, setTab] = useState("최근 본 글");
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    nickname: "",
    profileImg: null,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, isAdmin } = useAuth();

  const nav = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const tabData = ["최근 본 글", "즐겨찾기"];

  const cafeData: LogData[] = [];
  const cafeDataSave: LogData[] = [
    {
      id: "1",
      cafename: "카페10",
      address: "대전 서구 정림동",
      cafeImg: example1,
    },
    {
      id: "2",
      cafename: "카페20",
      address: "대전 서구 정림동",
      cafeImg: example2,
    },
    {
      id: "3",
      cafename: "카페30",
      address: "대전 서구 정림동",
      cafeImg: example3,
    },
    {
      id: "4",
      cafename: "카페40",
      address: "대전 서구 정림동",
      cafeImg: example4,
    },
    {
      id: "5",
      cafename: "카페50",
      address: "대전 서구 정림동",
      cafeImg: example5,
    },
    {
      id: "6",
      cafename: "카페60",
      address: "대전 서구 정림동",
      cafeImg: example6,
    },
    {
      id: "7",
      cafename: "카페70",
      address: "대전 서구 정림동",
      cafeImg: example7,
    },
  ];

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  const handleProfileEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하만 가능합니다");
      return;
    }

    await uploadProfileImage(file);
  };

  const uploadProfileImage = async (file: File) => {
    try {
      setIsUploading(true);

      const request: PresignedUrlRequest = {
        fileName: file.name,
        fileType: file.type,
      };

      const presignedResponse = await axios.post<PresignedUrlResponse>(
        `${API_BASE_URL}/api/users/profile/presigned-url`,
        request,
        { withCredentials: true }
      );

      const { presignedUrl, fileUrl } = presignedResponse.data;

      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      await axios.post(
        `${API_BASE_URL}/api/users/profile/image`,
        {
          profileImageUrl: fileUrl,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setRefreshTrigger((prev) => prev + 1);

      alert("프로필 이미지가 업로드 되었습니다.");
    } catch (e) {
      console.error("프로필 이미지 업로드 실패: ", e);
      alert("프로필 이미지 업로드 실패");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleProfileDeleteClick = async () => {
    if (!confirm("프로필 사진 삭제하겠습니까?")) {
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/profile/delete`,
        {},
        { withCredentials: true }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const currentData = tab === "최근 본 글" ? cafeData : cafeDataSave;
  useEffect(() => {
    if (tab === "최근 본 글") {
      setDisplayLog(cafeData.slice(0, logPage));
      return;
    }
    if (tab === "즐겨찾기") {
      setDisplayLog(cafeDataSave.slice(0, logPage));
      return;
    }
  }, [logPage]);

  useEffect(() => {
    const userCheck = async () => {
      try {
        const response = await axios.get<UserData>(
          `${API_BASE_URL}/api/users/profile/profile-check`,
          {
            withCredentials: true,
          }
        );
        setUserData({
          nickname: response.data.nickname,
          profileImg: response.data.profileImg,
        });
      } catch (e) {
        console.error("사용자 정보 조회 실패:", e);
        nav("/login");
      }
    };
    userCheck();
  }, [refreshTrigger, API_BASE_URL, nav]);

  if (!user) {
    nav("/login");
    return null;
  }

  return (
    <section className="InforForm">
      <div className="inforform-wrap">
        <article className="inforform-form">
          <div className="inforform-form-profile">
            <div className="inforform-form-profile-imgbox">
              <img
                src={userData.profileImg ? userData.profileImg : profileBasic}
              />
            </div>
            <p className="inforform-form-profile-name">{user.username}님</p>
            {isAdmin && (
              <button
                className="inforform-form-profile-admin-button"
                onClick={() => {
                  nav("/admin");
                }}
              >
                관리자 페이지
              </button>
            )}
            <p
              onClick={handleProfileEditClick}
              className="inforform-form-profile-editclick"
            >
              {isUploading ? "업로드 중..." : "프로필 수정"}
            </p>

            {userData.profileImg !== null ? (
              <p
                onClick={handleProfileDeleteClick}
                className="inforform-form-profile-deleteclick"
              >
                프로필 삭제
              </p>
            ) : (
              ""
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="inforform-form-logbox">
            <ul className="inforform-form-logbox-tabbox">
              {tabData.map((tabName, idx) => (
                <li
                  className={`${tab === tabName ? "active" : ""}`}
                  onClick={() => {
                    setTab(tabName);
                    setLogPage(3);
                    if (tabName === "최근 본 글") {
                      setDisplayLog(cafeData.slice(0, 3));
                    } else if (tabName === "즐겨찾기") {
                      setDisplayLog(cafeDataSave.slice(0, 3));
                    }
                  }}
                  key={idx}
                >
                  {tabName}
                  <span style={{ fontSize: "10px" }}>(미구현)</span>
                </li>
              ))}
            </ul>
            <ul className="inforform-form-logbox-list">
              {displayLog.length > 0 ? (
                displayLog.map((cafe) => (
                  <li key={cafe.id}>
                    <div className="inforform-form-logbox-list-imgbox">
                      <img src={cafe.cafeImg} />
                    </div>
                    <div className="inforform-form-logbox-list-titlebox">
                      <p className="inforform-form-logbox-list-titlebox-title">
                        {cafe.cafename}
                      </p>
                      <p className="inforform-form-logbox-list-titlebox-address">
                        {cafe.address}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <div
                  className="inforform-form-logbox-list-none"
                  style={{ textAlign: "center" }}
                >
                  {tab === "최근 본 글"
                    ? "최근에 본 카페가 없습니다."
                    : tab === "즐겨찾기"
                    ? "즐겨찾기 등록된 카페가 없습니다."
                    : ""}
                </div>
              )}
              {logPage < currentData.length && (
                <div
                  onClick={() => {
                    setLogPage((prev) =>
                      Math.min(prev + 4, currentData.length)
                    );
                  }}
                  className="inforform-form-logbox-list-more"
                >
                  더보기
                </div>
              )}
            </ul>
          </div>
          <div className="inforform-form-logoutbox">
            <p
              onClick={() => {
                logout();
              }}
            >
              로그아웃
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default InforForm;
