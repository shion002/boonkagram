import { useParams, Navigate } from "react-router-dom";
import CafePost from "./CafePost";

const CafeEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const cafeId = id ? parseInt(id, 10) : undefined;

  if (!cafeId || isNaN(cafeId)) {
    return <Navigate to="/admin" replace />;
  }

  return <CafePost mode="edit" cafeId={cafeId} />;
};

export default CafeEditPage;
