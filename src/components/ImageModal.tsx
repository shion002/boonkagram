import { useEffect, useState } from "react";
import "./CafeDataImg.css";

interface ImageModalProps {
  images: string[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
}

const ImageModal = ({
  images,
  isOpen,
  initialIndex,
  onClose,
}: ImageModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    setCurrentImageIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      const preloadImages = () => {
        const indices = [
          currentImageIndex,
          currentImageIndex - 1 >= 0
            ? currentImageIndex - 1
            : images.length - 1,
          currentImageIndex + 1 < images.length ? currentImageIndex + 1 : 0,
        ];

        indices.forEach((idx) => {
          if (!imageLoaded[idx]) {
            const img = new Image();
            img.src = images[idx];
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
  }, [isOpen, currentImageIndex, images, imageLoaded]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "Escape") onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (e.key === "ArrowLeft") goToPrevious(e as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (e.key === "ArrowRight") goToNext(e as any);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentImageIndex]);

  if (!isOpen) return null;

  return (
    <div className="image-modal" onClick={onClose}>
      <button className="modal-close" onClick={onClose}>
        ✕
      </button>
      <button className="modal-prev" onClick={goToPrevious}>
        ‹
      </button>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentImageIndex]}
          style={{
            opacity: imageLoaded[currentImageIndex] ? 1 : 0.5,
            transition: "opacity 0.2s",
          }}
        />
        <div className="modal-counter">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
      <button className="modal-next" onClick={goToNext}>
        ›
      </button>
    </div>
  );
};

export default ImageModal;
