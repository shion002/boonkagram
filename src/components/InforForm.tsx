import type { UserData } from "../util/UserData";
import "./InforForm.css";
import profileBasic from "./../assets/profile-basic.webp";
import example1 from "./../assets/example1.jpg";
import example2 from "./../assets/example2.jpg";
import example3 from "./../assets/example3.jpg";
import example4 from "./../assets/example4.jpg";
import example5 from "./../assets/example5.jpg";
import example6 from "./../assets/example6.jpg";
import example7 from "./../assets/example7.jpg";
import { useEffect, useState } from "react";

interface LogData {
  id: string;
  cafename: string;
  address: string;
  cafeImg: string;
}

const InforForm = () => {
  const [logPage, setLogPage] = useState(3);
  const [displayLog, setDisplayLog] = useState<LogData[]>([]);
  const [tab, setTab] = useState("최근 본 글");

  const tabData = ["최근 본 글", "즐겨찾기"];

  const userData: UserData = {
    username: "shion002",
    profileImg: null,
  };

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
            <p className="inforform-form-profile-editclick">프로필 수정</p>
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
                <div style={{ textAlign: "center" }}>
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
        </article>
      </div>
    </section>
  );
};

export default InforForm;
