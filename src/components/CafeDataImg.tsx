import { useEffect, useState } from "react";
import "./CafeDataImg.css";

interface ImageProps {
  image: string[] | null;
}

const CafeDataImg = ({ image }: ImageProps) => {
  const [displayimg, setDisplayImg] = useState<string[]>([]);
  const [imgPage, setImgPage] = useState(6);

  useEffect(() => {
    if (image) {
      setDisplayImg(image.slice(0, imgPage));
    }
  }, [imgPage]);

  return (
    <div className="cafedataview-intro-imgbox">
      <h3 className="cafedataview-intro-imgbox-title">사진</h3>
      <ul className="cafedataview-intro-imgbox-imglist">
        {displayimg.length > 0 ? (
          displayimg.map((img, idx) => (
            <li key={idx}>
              <img src={img} />
            </li>
          ))
        ) : (
          <div> 등록된 사진이 없습니다.</div>
        )}
      </ul>
      {image && imgPage < image.length && (
        <div
          className="cafedataview-intro-imgbox-more"
          onClick={() => {
            setImgPage(Math.min(imgPage + 6, image.length));
          }}
        >
          사진 더보기
        </div>
      )}
    </div>
  );
};

export default CafeDataImg;
