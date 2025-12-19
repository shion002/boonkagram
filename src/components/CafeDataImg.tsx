import { useEffect, useState } from "react";
import "./CafeDataImg.css";

interface ImageProps {
  image: string[] | null;
}

const CafeDataImg = ({ image }: ImageProps) => {
  const [displayimg, setDisplayImg] = useState<string[]>([]);
  const [imgPage, setImgPage] = useState(6);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    if (image) {
      setDisplayImg(image.slice(0, imgPage));
    }
  }, [imgPage, image]);

  useEffect(() => {
    if (modalOpen && image) {
      const preloadImages = () => {
        const indices = [
          currentImageIndex,
          currentImageIndex - 1 >= 0 ? currentImageIndex - 1 : image.length - 1,
          currentImageIndex + 1 < image.length ? currentImageIndex + 1 : 0,
        ];

        indices.forEach((idx) => {
          if (!imageLoaded[idx]) {
            const img = new Image();
            img.src = image[idx];
            img.onload = () => {
              setImageLoaded((prev) => {
                const newLoaded = [...prev];
                newLoaded[idx] = true;
                return newLoaded;
              });
            };
          }
        });
      };

      preloadImages();
    }
  }, [modalOpen, currentImageIndex, image]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (image) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? image.length - 1 : prev - 1
      );
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (image) {
      setCurrentImageIndex((prev) =>
        prev === image.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!modalOpen) return;
    if (e.key === "Escape") closeModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (e.key === "ArrowLeft") goToPrevious(e as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (e.key === "ArrowRight") goToNext(e as any);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, currentImageIndex]);

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

      {modalOpen && image && (
        <div className="image-modal" onClick={closeModal}>
          <button className="modal-close" onClick={closeModal}>
            ✕
          </button>
          <button className="modal-prev" onClick={goToPrevious}>
            ‹
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={image[currentImageIndex]}
              alt="확대 이미지"
              style={{
                opacity: imageLoaded[currentImageIndex] ? 1 : 0.5,
                transition: "opacity 0.2s",
              }}
            />
            <div className="modal-counter">
              {currentImageIndex + 1} / {image.length}
            </div>
          </div>
          <button className="modal-next" onClick={goToNext}>
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default CafeDataImg;
