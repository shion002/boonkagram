import { useState } from "react";
import "./ImageUploader.css";

interface ImageUploaderProps {
  maxImages?: number;
  maxFileSize?: number;
  onImagesChange: (files: File[]) => void;
  initialPreviews?: string[];
  showTitle?: boolean;
  buttonText?: string;
  multiple?: boolean;
}

const ImageUploader = ({
  maxImages = 10,
  maxFileSize = 10 * 1024 * 1024,
  onImagesChange,
  initialPreviews = [],
  showTitle = true,
  buttonText = "파일 선택",
  multiple = true,
}: ImageUploaderProps) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialPreviews);
  const [existingImages] = useState<string[]>(initialPreviews);

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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + imageFiles.length > maxImages) {
      alert(`이미지는 최대 ${maxImages}장 등록할 수 있습니다`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of files) {
      if (validateFileSize(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    const newImageFiles = [...imageFiles, ...validFiles];
    setImageFiles(newImageFiles);
    onImagesChange(newImageFiles);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleImageRemove = (index: number) => {
    if (index < existingImages.length) {
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      const actualIndex = index - existingImages.length;
      const newImageFiles = imageFiles.filter((_, i) => i !== actualIndex);
      setImageFiles(newImageFiles);
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      onImagesChange(newImageFiles);
    }
  };

  return (
    <div className="ImageUploader">
      {showTitle && <h2>사진</h2>}

      <div className="image-uploader-input">
        <label htmlFor="images" style={{ cursor: "pointer" }}>
          <button
            type="button"
            onClick={() => document.getElementById("images")?.click()}
          >
            {buttonText}
          </button>
        </label>
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple={multiple}
          onChange={handleImagesChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="image-list">
        {imagePreviews.length === 0 ? (
          <p className="empty-message">등록된 사진이 없습니다.</p>
        ) : (
          imagePreviews.map((preview, index) => (
            <div key={index} className="image-item">
              <img src={preview} alt={`사진 ${index + 1}`} />
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleImageRemove(index)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
