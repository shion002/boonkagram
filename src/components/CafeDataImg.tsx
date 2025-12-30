import { useEffect, useState } from "react";
import ImageModal from "./ImageModal";
import "./CafeDataImg.css";

interface ImageProps {
  image: string[] | null;
  showLoadMore?: boolean;
  initialDisplayCount?: number;
}

const CafeDataImg = ({
  image,
  showLoadMore = true,
  initialDisplayCount = 6,
}: ImageProps) => {
  const [displayimg, setDisplayImg] = useState<string[]>([]);
  const [imgPage, setImgPage] = useState(initialDisplayCount);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (image) {
      setDisplayImg(showLoadMore ? image.slice(0, imgPage) : image);
    }
  }, [imgPage, image, showLoadMore]);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="cafedataview-intro-imgbox">
      <h3 className="cafedataview-intro-imgbox-title">사진</h3>
      <ul className="cafedataview-intro-imgbox-imglist">
        {displayimg.length > 0 ? (
          displayimg.map((img, idx) => (
            <li key={idx} onClick={() => openModal(idx)}>
              <img src={img} alt={`카페 이미지 ${idx + 1}`} loading="lazy" />
            </li>
          ))
        ) : (
          <div className="cafedataview-intro-imgbox-nullimg">
            등록된 사진이 없습니다.
          </div>
        )}
      </ul>
      {showLoadMore && image && imgPage < image.length && (
        <div
          className="cafedataview-intro-imgbox-more"
          onClick={() => {
            setImgPage(Math.min(imgPage + 6, image.length));
          }}
        >
          사진 더보기
        </div>
      )}

      {image && (
        <ImageModal
          images={image}
          isOpen={modalOpen}
          initialIndex={currentImageIndex}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CafeDataImg;
