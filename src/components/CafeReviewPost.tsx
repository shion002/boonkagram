import { useLocation } from "react-router-dom";
import type { PostData } from "../types/postData";
import starNull from "./../assets/star-null.svg";
import starFull from "./../assets/star-full.svg";
import "./CafeReviewPost.css";
import { useState } from "react";
import type { ReviewRequest } from "../types/review";
import axios from "axios";

const CafeReviewPost = () => {
  const location = useLocation();

  const cafeData: PostData = location.state?.cafeData;

  const [taste, setTaste] = useState(0);
  const [service, setService] = useState(0);
  const [mood, setMood] = useState(0);
  const [cost, setCost] = useState(0);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [content, setContent] = useState("");
  const MAX_LENGTH = 1000;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratings = [
    { scoreName: "맛", score: taste, setValue: setTaste },
    { scoreName: "서비스", score: service, setValue: setService },
    { scoreName: "분위기", score: mood, setValue: setMood },
    { scoreName: "가격", score: cost, setValue: setCost },
  ];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 이미지

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFileSize = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      alert(
        `파일 크기는 10MB 이하여야 합니다. (현재: ${(
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

    if (files.length + imageFiles.length > 10) {
      alert("이미지는 최대 10장 등록할 수 있습니다");
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

    setImageFiles((prev) => [...prev, ...validFiles]);

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
      handleExistingImageRemove(index);
    } else {
      handleNewImageRemove(index);
    }
  };
  const handleExistingImageRemove = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewImageRemove = (index: number) => {
    const actualIndex = index - existingImages.length;
    setImageFiles((prev) => prev.filter((_, i) => i !== actualIndex));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 텍스트
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setContent(value);
    }
  };

  const reviewCreate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (taste === 0 || service === 0 || mood === 0 || cost === 0) {
      alert("맛, 서비스, 분위기, 가격의 평점을 입력해주세요");
      return;
    }

    if (imageFiles.length === 0) {
      alert("이미지를 1개 이상 등록해주세요");
      return;
    }

    if (content.length === 0) {
      alert("리뷰 내용을 입력해주세요");
      return;
    }

    const imageMetadata = imageFiles.map((file) => ({
      fileName: file.name,
      fileType: file.type,
    }));

    const reviewRequest: ReviewRequest = {
      content: content,
      reviewImages: imageMetadata,
      reviewScore: {
        tasteScore: taste,
        serviceScore: service,
        moodScore: mood,
        costScore: cost,
      },
      postId: cafeData.id,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/review/create`,
        reviewRequest,
        { withCredentials: true }
      );
      console.log(response.data);
      alert("리뷰 작성이 완료되었습니다");
      window.location.href = `/cafe/${cafeData.id}`;
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="CafeReviewPost">
      <div className="reviewpost-wrap">
        <article className="reviewpost-cafedata">
          <h3>{cafeData.name}</h3>
          <p>{cafeData.address}</p>
        </article>
        <article className="reviewpost-score">
          {ratings.map((rating) => (
            <div className="reviewpost-scorebox">
              <h4 className="reviewpost-scorebox-title">{rating.scoreName}</h4>
              <div className="reviewpost-score-imgbox">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={star <= rating.score ? starFull : starNull}
                    onClick={() => rating.setValue(star)}
                  />
                ))}
              </div>
              <h4 className="review-scorebox-score">{rating.score}</h4>
            </div>
          ))}
        </article>
        <article className="reviewpost-imagebox">
          <div className="form-section">
            <h2>사진</h2>
            <div className="form-group">
              <label htmlFor="images" style={{ cursor: "pointer" }}>
                <button
                  type="button"
                  onClick={() => document.getElementById("images")?.click()}
                >
                  파일 선택
                </button>
              </label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
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
        </article>
        <article className="reviewpost-content">
          <textarea
            className="reviewpost-content-textarea"
            value={content}
            onChange={handleContentChange}
            placeholder="카페에 대한 리뷰를 남겨주세요."
            maxLength={MAX_LENGTH}
          />
          <div className="reviewpost-content-counter">
            <p>{content.length} </p>
            <p>/</p>
            <p>{MAX_LENGTH}</p>
          </div>
          <div className="reviewpost-button">
            <button className="reviewpost-cancel-button">취소</button>
            <button onClick={reviewCreate} className="reviewpost-submit-button">
              작성하기
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default CafeReviewPost;
