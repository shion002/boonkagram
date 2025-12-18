import { useEffect } from "react";
import FirstSection from "../components/FirstSection";
import Header from "../components/Header";
import RecommendList from "../components/RecommendList";
import { useLocation } from "../context/LocationContext";

const Home = () => {
  const { requestLocation, isLocationAllowed } = useLocation();

  useEffect(() => {
    if (!isLocationAllowed) {
      const hasAskedBefore = localStorage.getItem("locationAsked");

      if (!hasAskedBefore) {
        setTimeout(() => {
          requestLocation().catch(() => {});
          localStorage.setItem("locationAsked", "true");
        }, 1000);
      }
    }
  }, [isLocationAllowed, requestLocation]);

  return (
    <>
      <Header />
      <FirstSection />
      <RecommendList />
    </>
  );
};

export default Home;
