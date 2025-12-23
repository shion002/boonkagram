import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface LocationContextType {
  lat: number | null;
  lon: number | null;
  isLocationAllowed: boolean;
  requestLocation: () => Promise<{ lat: number; lon: number }>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);

  useEffect(() => {
    const savedLat = localStorage.getItem("userLatitude");
    const savedLon = localStorage.getItem("userLongitude");

    if (savedLat && savedLon) {
      setLat(parseFloat(savedLat));
      setLon(parseFloat(savedLon));
      setIsLocationAllowed(true);
    }
  }, []);

  const requestLocation = async (): Promise<{ lat: number; lon: number }> => {
    if (!navigator.geolocation) {
      alert("위치 서비스를 지원하지 않는 브라우저 입니다");
      throw new Error("Geolocation not supported");
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLon = position.coords.longitude;

          setLat(newLat);
          setLon(newLon);
          setIsLocationAllowed(true);

          localStorage.setItem("userLatitude", newLat.toString());
          localStorage.setItem("userLongitude", newLon.toString());

          resolve({ lat: newLat, lon: newLon }); // 위치 정보 반환
        },
        (error) => {
          console.error("위치 정보 가져오기 실패:", error);
          setIsLocationAllowed(false);

          if (error.code === error.PERMISSION_DENIED) {
            alert(
              "위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요."
            );
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            alert("위치 정보를 사용할 수 없습니다.");
          } else if (error.code === error.TIMEOUT) {
            alert("위치 정보 요청이 시간 초과되었습니다.");
          }

          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{ lat, lon, isLocationAllowed, requestLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
};
