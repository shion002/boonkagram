import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

interface User {
  username: string;
  grade: "USER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      console.error("인증 확인 실패:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const isAdmin = user?.grade === "ADMIN";
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, isAuthenticated, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
