import axios from "axios";

export const checkAuth = async () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/auth-check`, {
      withCredentials: true,
    });
    return {
      authenticated: true,
      member: response.data,
    };
  } catch (e: any) {
    if (e.response?.status === 401) {
      return {
        authenticated: false,
        member: null,
      };
    }

    console.error(e);
    return {
      authenticated: false,
      member: null,
    };
  }
};
