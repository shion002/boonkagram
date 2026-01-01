import { useEffect, useState } from "react";
import "./CafePost.css";
import type { PostCafeResponse, PostRequestData } from "../../types/postData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThumbnailUploader from "./ThumbnailUploader";
import MenuInput from "./MenuInput";
import ImageUploader from "../ImageUploader";

interface CafePostProps {
  cafeId?: number;
  mode: "create" | "edit";
}

const CafePost = ({ cafeId, mode }: CafePostProps) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<PostRequestData>({
    cafeName: "",
    address: "",
    titleIntro: null,
    thumbnail: null,
    lat: 0,
    lon: 0,
    phone: null,
    instagram: null,
    webUrl: null,
    intro: null,
    menus: null,
    imageUrls: null,
  });

  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null
  );
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nav = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (isEditMode && !cafeId) {
      alert("잘못된 접근입니다");
      nav("/admin");
      return;
    }

    if (isEditMode && cafeId) {
      fetchCafeData(cafeId);
    }
  }, [cafeId, isEditMode, nav]);

  const fetchCafeData = async (id: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/cafe/get-cafe-post?cafeId=${id}`,
        { withCredentials: true }
      );
      const data = response.data;

      setFormData({
        cafeName: data.cafeName || "",
        address: data.address || "",
        titleIntro: data.titleIntro || null,
        thumbnail: null,
        lat: data.lat || 0,
        lon: data.lon || 0,
        phone: data.phone || null,
        instagram: data.instagram || null,
        webUrl: data.webUrl || null,
        intro: data.intro || null,
        menus: data.menus || null,
        imageUrls: null,
      });

      if (data.thumbnail) {
        setExistingThumbnail(data.thumbnail);
      }
      if (data.imageUrls && data.imageUrls.length > 0) {
        setExistingImages(data.imageUrls);
      }
    } catch (e) {
      console.error("데이터 로드 실패: ", e);
      alert("카페 정보를 불러오는데 실패했습니다");
      nav("/admin");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "lat" || name === "lon") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value || null }));
    }
  };

  const handleThumbnailChange = (file: File | null) => {
    setThumbnailFile(file);
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: { fileName: file.name, fileType: file.type },
      }));
      setExistingThumbnail(null);
    } else {
      setFormData((prev) => ({ ...prev, thumbnail: null }));
      setExistingThumbnail(null);
    }
  };

  const handleImagesChange = (files: File[]) => {
    setImageFiles(files);
  };

  const handleMenusChange = (
    menus: { name: string; price: number }[] | null
  ) => {
    setFormData((prev) => ({ ...prev, menus }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const imageMetadata = imageFiles.map((file) => ({
        fileName: file.name,
        fileType: file.type,
      }));

      const validMenus = formData.menus?.filter(
        (menu) => menu.name.trim() !== ""
      );

      const submitData: PostRequestData = {
        ...formData,
        menus: validMenus && validMenus.length > 0 ? validMenus : null,
        imageUrls: imageMetadata.length > 0 ? imageMetadata : null,
      };

      if (isEditMode) {
        if (existingImages.length > 0) {
          submitData.existingImageUrls = existingImages;
        }

        if (existingThumbnail) {
          submitData.existingThumbnailUrl = existingThumbnail;
        } else {
          submitData.deleteThumbnail = true;
        }
      }

      const apiUrl = isEditMode
        ? `${API_BASE_URL}/api/cafe/admin/${cafeId}/update`
        : `${API_BASE_URL}/api/cafe/admin/create`;

      const response = await axios.post<PostCafeResponse>(apiUrl, submitData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.thumbnailPresignedUrl && thumbnailFile) {
        try {
          await axios.put(
            response.data.thumbnailPresignedUrl.presignedUrl,
            thumbnailFile,
            {
              headers: {
                "Content-Type": thumbnailFile.type,
              },
            }
          );
        } catch (uploadError) {
          console.error("썸네일 업로드 실패:", uploadError);
          alert("썸네일 업로드에 실패했습니다.");
        }
      }

      if (
        response.data?.imagePresignedUrls &&
        response.data.imagePresignedUrls.length > 0
      ) {
        const uploadPromises = response.data.imagePresignedUrls.map(
          async (presignedData, index) => {
            try {
              await axios.put(presignedData.presignedUrl, imageFiles[index], {
                headers: {
                  "Content-Type": imageFiles[index].type,
                },
              });
            } catch (uploadError) {
              console.error(`이미지 ${index + 1} 업로드 실패:`, uploadError);
              throw uploadError;
            }
          }
        );

        try {
          await Promise.all(uploadPromises);
        } catch (uploadError) {
          console.error("이미지 업로드 중 오류:", uploadError);
          alert("일부 이미지 업로드에 실패했습니다.");
        }
      }

      alert(
        isEditMode
          ? "카페 수정이 완료되었습니다!"
          : "카페 등록이 완료되었습니다!"
      );
      window.location.href = "/admin";
    } catch (error) {
      console.error(isEditMode ? "수정 실패:" : "등록 실패:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          (isEditMode
            ? "수정 중 오류가 발생했습니다."
            : "등록 중 오류가 발생했습니다.");
        alert(errorMessage);
      } else {
        alert(
          isEditMode
            ? "수정 중 오류가 발생했습니다."
            : "등록 중 오류가 발생했습니다."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cafe-post">
      <form onSubmit={handleSubmit}>
        <h1>{isEditMode ? "카페 수정" : "카페 등록"}</h1>

        <section className="form-section">
          <h2>기본 정보</h2>

          <div className="form-group">
            <label htmlFor="cafeName">제목 *</label>
            <input
              type="text"
              id="cafeName"
              name="cafeName"
              value={formData.cafeName}
              onChange={handleInputChange}
              placeholder="카페 이름을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">주소 *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="주소를 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="titleIntro">타이틀 소개</label>
            <input
              type="text"
              id="titleIntro"
              name="titleIntro"
              value={formData.titleIntro || ""}
              onChange={handleInputChange}
              placeholder="간단한 소개를 입력하세요"
            />
          </div>

          <div className="form-group">
            <ThumbnailUploader
              onThumbnailChange={handleThumbnailChange}
              initialPreview={existingThumbnail}
            />
          </div>
        </section>

        <section className="form-section">
          <h2>위치 정보</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lat">위도 *</label>
              <input
                type="number"
                step="any"
                id="lat"
                name="lat"
                value={formData.lat || ""}
                onChange={handleInputChange}
                placeholder="예: 37.5665"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lon">경도 *</label>
              <input
                type="number"
                step="any"
                id="lon"
                name="lon"
                value={formData.lon || ""}
                onChange={handleInputChange}
                placeholder="예: 126.9780"
                required
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>연락처 정보</h2>

          <div className="form-group">
            <label htmlFor="phone">연락처</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              placeholder="010-1234-5678"
            />
          </div>

          <div className="form-group">
            <label htmlFor="instagram">인스타그램 주소</label>
            <input
              type="url"
              id="instagram"
              name="instagram"
              value={formData.instagram || ""}
              onChange={handleInputChange}
              placeholder="https://instagram.com/cafe_name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="webUrl">홈페이지 주소</label>
            <input
              type="url"
              id="webUrl"
              name="webUrl"
              value={formData.webUrl || ""}
              onChange={handleInputChange}
              placeholder="https://cafe-website.com"
            />
          </div>
        </section>

        <section className="form-section">
          <h2>상세 정보</h2>

          <div className="form-group">
            <label htmlFor="intro">메인 소개</label>
            <textarea
              id="intro"
              name="intro"
              value={formData.intro || ""}
              onChange={handleInputChange}
              placeholder="카페에 대한 상세한 소개를 입력하세요"
              rows={6}
            />
          </div>
        </section>

        <section className="form-section">
          <MenuInput menus={formData.menus} onChange={handleMenusChange} />
        </section>

        <section className="form-section">
          <ImageUploader
            onImagesChange={handleImagesChange}
            initialPreviews={existingImages}
            buttonText="파일 선택"
          />
        </section>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            disabled={isSubmitting}
            onClick={() => nav("/admin")}
          >
            취소
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "수정 중..."
                : "등록 중..."
              : isEditMode
              ? "수정하기"
              : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CafePost;