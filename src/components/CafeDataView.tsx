import { useLocation } from "react-router-dom";
import "./CafeDataView.css";
import { type CafeData } from "../util/CafeData";
import SearchSection from "./SearchSection";
import instagram from "./../assets/instagram-icon.svg";
import phone from "./../assets/phone-icon.svg";
import webIcon from "./../assets/web-icon.svg";
import example1 from "./../assets/example1.jpg";
import example2 from "./../assets/example2.jpg";
import example3 from "./../assets/example3.jpg";
import example4 from "./../assets/example4.jpg";
import example5 from "./../assets/example5.jpg";
import example6 from "./../assets/example6.jpg";
import example7 from "./../assets/example7.jpg";
import example8 from "./../assets/example8.webp";
import example9 from "./../assets/example9.jpg";
import example10 from "./../assets/example10.jpg";
import thumbnail from "./../assets/gyenggi-local.webp";
import type { PostData } from "../util/PostData";
import CafeDataMenu from "./CafeDataMenu";
import CafeDataImg from "./CafeDataImg";
import CafeDataReview from "./CafeDataReview";

const CafeDataView = () => {
  const location = useLocation();
  const cafeData = location.state as CafeData | undefined;

  const postData: PostData = {
    phone: "01022222222",
    content:
      "탁 트인 야외 테라스가 있고, 한옥을 개조해 분위기 있는 무드가 있는 넓은 정원이 있어 초록초록한 매력을 가지고 있어 싱그럽고, 실내는 한국적인 매력이 있어 보는 재미가 있는 카페입니다.",
    img: [
      thumbnail,
      example1,
      example2,
      example3,
      example4,
      example5,
      example6,
      example7,
      example8,
      example9,
      example10,
    ],
    review: [
      {
        id: "1",
        name: "테스트1",
        totalreview: 1,
        follow: 0,
        reviewImg: [example1, example2, example3, example4],
        profileImg: example7,
        ratingScore: 4.0,
        score: {
          tasteScore: 4.0,
          serviceScore: 4.5,
          moodScore: 3.5,
          costScore: 4.0,
        },
        content:
          "사장님이 너무친절하세요. 조명도 전부 이뻐서 사진찍기도 좋았습니당 가격도 부담없고 밖에 경치도 볼 수 있어요 점심시간 이후에 자리가 없어서 기다려야 될 수도 있어요",
        date: new Date(),
      },
      {
        id: "2",
        name: "테스트2",
        totalreview: 1,
        follow: 0,
        reviewImg: [example1, example2, example3, example4],
        profileImg: example7,
        ratingScore: 4.0,
        score: {
          tasteScore: 4.0,
          serviceScore: 4.5,
          moodScore: 3.5,
          costScore: 4.0,
        },
        content:
          "사장님이 너무친절하세요. 조명도 전부 이뻐서 사진찍기도 좋았습니당 가격도 부담없고 밖에 경치도 볼 수 있어요 점심시간 이후에 자리가 없어서 기다려야 될 수도 있어요",
        date: new Date(),
      },
      {
        id: "3",
        name: "테스트3",
        totalreview: 1,
        follow: 0,
        reviewImg: [example1, example2, example3, example4],
        profileImg: example7,
        ratingScore: 4.0,
        score: {
          tasteScore: 4.0,
          serviceScore: 4.5,
          moodScore: 3.5,
          costScore: 4.0,
        },
        content:
          "사장님이 너무친절하세요. 조명도 전부 이뻐서 사진찍기도 좋았습니당 가격도 부담없고 밖에 경치도 볼 수 있어요 점심시간 이후에 자리가 없어서 기다려야 될 수도 있어요",
        date: new Date(),
      },
      {
        id: "4",
        name: "테스트4",
        totalreview: 1,
        follow: 0,
        reviewImg: [example1, example2, example3, example4],
        profileImg: example7,
        ratingScore: 4.0,
        score: {
          tasteScore: 4.0,
          serviceScore: 4.5,
          moodScore: 3.5,
          costScore: 4.0,
        },
        content:
          "사장님이 너무친절하세요. 조명도 전부 이뻐서 사진찍기도 좋았습니당 가격도 부담없고 밖에 경치도 볼 수 있어요 점심시간 이후에 자리가 없어서 기다려야 될 수도 있어요",
        date: new Date(),
      },
      {
        id: "5",
        name: "테스트5",
        totalreview: 1,
        follow: 0,
        reviewImg: [example1, example2, example3, example4],
        profileImg: example7,
        ratingScore: 4.0,
        score: {
          tasteScore: 4.0,
          serviceScore: 4.5,
          moodScore: 3.5,
          costScore: 4.0,
        },
        content:
          "사장님이 너무친절하세요. 조명도 전부 이뻐서 사진찍기도 좋았습니당 가격도 부담없고 밖에 경치도 볼 수 있어요 점심시간 이후에 자리가 없어서 기다려야 될 수도 있어요",
        date: new Date(),
      },
      {
        id: "6",
        name: "테스트6",
        totalreview: 1,
        follow: 0,
        reviewImg: [example1, example2, example3, example4],
        profileImg: example7,
        ratingScore: 4.0,
        score: {
          tasteScore: 4.0,
          serviceScore: 4.5,
          moodScore: 3.5,
          costScore: 4.0,
        },
        content:
          "사장님이 너무친절하세요. 조명도 전부 이뻐서 사진찍기도 좋았습니당 가격도 부담없고 밖에 경치도 볼 수 있어요 점심시간 이후에 자리가 없어서 기다려야 될 수도 있어요",
        date: new Date(),
      },
      {
        id: "7",
        name: "테스트7",
        totalreview: 1,
        follow: 0,
        reviewImg: [example1, example2, example3, example4],
        profileImg: example7,
        ratingScore: 4.0,
        score: {
          tasteScore: 4.0,
          serviceScore: 4.5,
          moodScore: 3.5,
          costScore: 4.0,
        },
        content:
          "사장님이 너무친절하세요. 조명도 전부 이뻐서 사진찍기도 좋았습니당 가격도 부담없고 밖에 경치도 볼 수 있어요 점심시간 이후에 자리가 없어서 기다려야 될 수도 있어요",
        date: new Date(),
      },
      {
        id: "8",
        name: "테스트8",
        totalreview: 1,
        follow: 0,
        reviewImg: [example1, example2, example3, example4],
        profileImg: example7,
        ratingScore: 4.0,
        score: {
          tasteScore: 4.0,
          serviceScore: 4.5,
          moodScore: 3.5,
          costScore: 4.0,
        },
        content:
          "사장님이 너무친절하세요. 조명도 전부 이뻐서 사진찍기도 좋았습니당 가격도 부담없고 밖에 경치도 볼 수 있어요 점심시간 이후에 자리가 없어서 기다려야 될 수도 있어요",
        date: new Date(),
      },
      {
        id: "9",
        name: "테스트9",
        totalreview: 1,
        follow: 0,
        reviewImg: [example1, example2, example3, example4],
        profileImg: example7,
        ratingScore: 4.0,
        score: {
          tasteScore: 4.0,
          serviceScore: 4.5,
          moodScore: 3.5,
          costScore: 4.0,
        },
        content:
          "사장님이 너무친절하세요. 조명도 전부 이뻐서 사진찍기도 좋았습니당 가격도 부담없고 밖에 경치도 볼 수 있어요 점심시간 이후에 자리가 없어서 기다려야 될 수도 있어요",
        date: new Date(),
      },
      {
        id: "10",
        name: "테스트10",
        totalreview: 1,
        follow: 0,
        reviewImg: [example1, example2, example3, example4],
        profileImg: example7,
        ratingScore: 4.0,
        score: {
          tasteScore: 4.0,
          serviceScore: 4.5,
          moodScore: 3.5,
          costScore: 4.0,
        },
        content:
          "사장님이 너무친절하세요. 조명도 전부 이뻐서 사진찍기도 좋았습니당 가격도 부담없고 밖에 경치도 볼 수 있어요 점심시간 이후에 자리가 없어서 기다려야 될 수도 있어요",
        date: new Date(),
      },
    ],
    menu: [
      { name: "아메리카노(HOT/ICE)", price: 4500 },
      { name: "카페라떼(HOT/ICE)", price: 4500 },
      { name: "카푸치노(HOT/ICE)", price: 4500 },
      { name: "아인슈페너(HOT/ICE)", price: 4500 },
      { name: "카라멜마끼아또(HOT/ICE)", price: 4500 },
      { name: "콜드브루(Only ICE)", price: 4500 },
      { name: "치즈케익 18cm", price: 18500 },
    ],
    link: {
      phone: "01022226666",
      instagram: "instagram/sdlfksna",
      web: "boonkagram.sss",
    },
  };

  if (!cafeData) {
    return <div>에러: 데이터가 없습니다</div>;
  }

  return (
    <section className="CafeDataView">
      <div className="cafedataview-wrap">
        <article className="cafedataview-search">
          <SearchSection />
        </article>
        <article className="cafedataview-titlebox">
          <h2 className="cafedataview-titlebox-title">{cafeData.name}</h2>
          <p className="cafedataview-titlebox-address">{cafeData.address}</p>
          <div className="cafedataview-titlebox-line"></div>
        </article>
        <article className="cafedataview-intro">
          <div className="cafedataview-intro-main">
            <div className="cafedataview-intro-textbox">
              <h3 className="cafedataview-intro-textbox-title">카페 소개</h3>
              <p className="cafedataview-intro-textbox-content">
                {postData.content}
              </p>
            </div>
            <CafeDataMenu menu={postData.menu} />
            <CafeDataImg image={postData.img} />
            <CafeDataReview review={postData.review} />
          </div>
          <aside className="cafedataview-intro-link">
            <h4>메신저</h4>
            <ul className="cafedataview-intro-link-linklist">
              <li>
                <img src={phone} />
                <p>{postData.link.phone}</p>
              </li>
              <li>
                <img src={instagram} />
                <p>{postData.link.instagram}</p>
              </li>
              <li>
                <img src={webIcon} />
                <p>{postData.link.web}</p>
              </li>
            </ul>
            <div className="cafedataview-intro-link-button">
              <button className="cafedataview-intro-link-button-review">
                리뷰작성
              </button>
              <button className="cafedataview-intro-link-button-report">
                제보하기
              </button>
            </div>
          </aside>
        </article>
      </div>
    </section>
  );
};

export default CafeDataView;
