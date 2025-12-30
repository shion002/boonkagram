import { useState } from "react";
import "./ThumbnailUploader.css";

interface ThumbnailUploaderProps {
  onThumbnailChange: (file: File | null) => void;
  initialPreview?: string | null;
  maxFileSize?: number;
}

const ThumbnailUploader = ({
  onThumbnailChange,
  initialPreview = null,
  maxFileSize = 10 * 1024 * 1024,
}: ThumbnailUploaderProps) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    initialPreview || ""
  );

  const validateFileSize = (file: File): boolean => {
    if (file.size > maxFileSize) {
      alert(
        `파일 크기는 ${maxFileSize / 1024 / 1024}MB 이하여야 합니다. (현재: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB)`
      );
      return false;
    }
    return true;
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFileSize(file)) {
        e.target.value = "";
        return;
      }

      onThumbnailChange(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailRemove = () => {
    setThumbnailPreview("");
    onThumbnailChange(null);

    const thumbnailInput = document.getElementById(
      "thumbnail"
    ) as HTMLInputElement;
    if (thumbnailInput) {
      thumbnailInput.value = "";
    }
  };

  return (
    <div className="thumbnail-uploader">
      <label htmlFor="thumbnail">
        썸네일 ({maxFileSize / 1024 / 1024}MB 이하)
      </label>
      <input
        type="file"
        id="thumbnail"
        accept="image/*"
        onChange={handleThumbnailChange}
      />
      {thumbnailPreview && (
        <div className="thumbnail-preview">
          <img src={thumbnailPreview} alt="썸네일 미리보기" />
          <button
            type="button"
            className="thumbnail-remove-btn"
            onClick={handleThumbnailRemove}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ThumbnailUploader;
