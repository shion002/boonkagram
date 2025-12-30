import { useEffect, useState } from "react";
import "./CafePost.css";
import type { PostCafeResponse, PostRequestData } from "../../types/postData";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nav = useNavigate();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (isEditMode && !cafeId) {
      alert("잘못된 접근입니다");
      nav("/admin");
      return;
    }

    if (isEditMode && cafeId) {
      fetchCafeData(cafeId);
      console.log(cafeId);
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
        setThumbnailPreview(data.thumbnail);
      }
      if (data.imageUrls && data.imageUrls.length > 0) {
        setExistingImages(data.imageUrls);
        setImagePreviews(data.imageUrls);
      }
    } catch (e) {
      console.error("데이터 로드 실패: ", e);
      alert("카페 정보를 불러오는데 실패했습니다");
      nav("/admin");
    }
  };

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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFileSize(file)) {
        e.target.value = "";
        return;
      }

      setThumbnailFile(file);
      setFormData((prev) => ({
        ...prev,
        thumbnail: { fileName: file.name, fileType: file.type },
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailRemove = () => {
    setThumbnailFile(null);
    setExistingThumbnail(null);
    setFormData((prev) => ({ ...prev, thumbnail: null }));
    setThumbnailPreview("");
    const thumbnailInput = document.getElementById(
      "thumbnail"
    ) as HTMLInputElement;
    if (thumbnailInput) {
      thumbnailInput.value = "";
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

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

  const handleExistingImageRemove = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewImageRemove = (index: number) => {
    const actualIndex = index - existingImages.length;
    setImageFiles((prev) => prev.filter((_, i) => i !== actualIndex));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageRemove = (index: number) => {
    if (index < existingImages.length) {
      handleExistingImageRemove(index);
    } else {
      handleNewImageRemove(index);
    }
  };

  const handleAddMenu = () => {
    const newMenu = { name: "", price: 0 };
    setFormData((prev) => ({
      ...prev,
      menus: prev.menus ? [...prev.menus, newMenu] : [newMenu],
    }));
  };

  const handleMenuChange = (
    index: number,
    field: "name" | "price",
    value: string
  ) => {
    if (!formData.menus) return;

    const updatedMenus = formData.menus.map((menu, i) => {
      if (i !== index) return menu;

      if (field === "price") {
        return { ...menu, price: Number(value) || 0 };
      } else {
        return { ...menu, name: value };
      }
    });

    setFormData((prev) => ({ ...prev, menus: updatedMenus }));
  };

  // 메뉴 삭제
  const handleMenuRemove = (index: number) => {
    if (!formData.menus) return;

    const updatedMenus = formData.menus.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      menus: updatedMenus.length > 0 ? updatedMenus : null,
    }));
  };

  // 폼 제출
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

      console.log("Submit Data:", JSON.stringify(submitData, null, 2));

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
      console.error("등록 실패:", error);
      if (axios.isAxiosError(error)) {
        console.error(isEditMode ? "수정 실패:" : "등록 실패:", error);
        alert(
          isEditMode
            ? "수정 중 오류가 발생했습니다."
            : "등록 중 오류가 발생했습니다."
        );
      } else {
        alert("등록 중 오류가 발생했습니다.");
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
            <label htmlFor="title">제목 *</label>
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
            <label htmlFor="thumbnail">썸네일 (10MB 이하)</label>
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
        </section>

        <section className="form-section">
          <h2>위치 정보</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">위도 *</label>
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
              <label htmlFor="longitude">경도 *</label>
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
          <div className="section-header">
            <h2>메뉴</h2>
            <button type="button" className="add-btn" onClick={handleAddMenu}>
              + 메뉴 추가
            </button>
          </div>

          <div className="menu-list">
            {!formData.menus || formData.menus.length === 0 ? (
              <p className="empty-message">등록된 메뉴가 없습니다.</p>
            ) : (
              formData.menus.map((menu, index) => (
                <div key={index} className="menu-item">
                  <input
                    type="text"
                    placeholder="메뉴명"
                    value={menu.name}
                    onChange={(e) =>
                      handleMenuChange(index, "name", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="가격"
                    value={menu.price || ""}
                    onChange={(e) =>
                      handleMenuChange(index, "price", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleMenuRemove(index)}
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="form-section">
          <h2>사진</h2>

          <div className="form-group">
            <label htmlFor="images">
              사진 추가 (여러 장 선택 가능, 각 10MB 이하)
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
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
        </section>

        <div className="form-actions">
          <button type="button" className="cancel-btn" disabled={isSubmitting}>
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
