import { useLocation, useParams } from "react-router-dom";
import type { PostData } from "../types/postData";
import "./CafeReviewPost.css";
import { useState } from "react";
import type { ReviewPresignedResponse, ReviewRequest } from "../types/review";
import axios from "axios";
import RatingInput from "./RatingInput";
import ImageUploader from "./ImageUploader";

const CafeReviewPost = () => {
  const location = useLocation();
  const { id } = useParams();

  const cafeData: PostData = location.state?.cafeData;

  const [taste, setTaste] = useState(0);
  const [service, setService] = useState(0);
  const [mood, setMood] = useState(0);
  const [cost, setCost] = useState(0);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_LENGTH = 1000;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const ratings = [
    { scoreName: "맛", score: taste, setValue: setTaste },
    { scoreName: "서비스", score: service, setValue: setService },
    { scoreName: "분위기", score: mood, setValue: setMood },
    { scoreName: "가격", score: cost, setValue: setCost },
  ];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setContent(value);
    }
  };

  const handleImagesChange = (files: File[]) => {
    setImageFiles(files);
  };

  const reviewCreate = async () => {
    if (isSubmitting) return;

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

    setIsSubmitting(true);

    try {
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

      const response = await axios.post<ReviewPresignedResponse>(
        `${API_BASE_URL}/api/review/create`,
        reviewRequest,
        { withCredentials: true }
      );

      if (
        !response.data?.imagePresignedUrls ||
        response.data.imagePresignedUrls.length === 0
      ) {
        console.warn("Presigned URL이 없습니다");
        alert("이미지 업로드 URL을 받지 못했습니다.");
        return;
      }

      const uploadPromises = response.data.imagePresignedUrls.map(
        async (presignedData, index) => {
          const file = imageFiles[index];

          try {
            await axios.put(presignedData.presignedUrl, file, {
              headers: {
                "Content-Type": file.type,
              },
              timeout: 30000,
            });

            return { success: true, index };
          } catch (uploadError) {
            console.error(`이미지 ${index + 1} 업로드 실패:`, uploadError);
            return { success: false, index, error: uploadError };
          }
        }
      );

      const results = await Promise.all(uploadPromises);
      const failedUploads = results.filter((r) => !r.success);

      if (failedUploads.length > 0) {
        console.error("업로드 실패한 이미지:", failedUploads);
        alert(
          `${failedUploads.length}개의 이미지 업로드에 실패했습니다. 다시 시도해주세요.`
        );
        return;
      }

      alert("리뷰가 성공적으로 등록되었습니다!");
      window.location.href = `/cafe/${id}`;
    } catch (error) {
      console.error("리뷰 생성 중 오류:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          "리뷰 등록에 실패했습니다.";
        alert(errorMessage);
      } else {
        alert("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
      }
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
          {ratings.map((rating, index) => (
            <RatingInput
              key={index}
              label={rating.scoreName}
              value={rating.score}
              onChange={rating.setValue}
            />
          ))}
        </article>

        <article className="reviewpost-imagebox">
          <ImageUploader
            maxImages={10}
            onImagesChange={handleImagesChange}
            buttonText="파일 선택"
          />
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
            <button
              className="reviewpost-cancel-button"
              onClick={() => window.history.back()}
            >
              취소
            </button>
            <button
              onClick={reviewCreate}
              className="reviewpost-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "작성 중..." : "작성하기"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default CafeReviewPost;
