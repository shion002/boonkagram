import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (!user) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    alert("관리자만 접근 가능합니다.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
