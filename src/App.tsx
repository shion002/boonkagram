import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./page/Home";
import CafeView from "./page/CafeView";
import Login from "./page/Login";
import Sign from "./page/Sign";
import Info from "./page/Info";
import Admin from "./page/Admin";
import { LocationProvider } from "./context/LocationContext";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminMain from "./components/admin/AdminMain";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <LocationProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cafe/:id" element={<CafeView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/info" element={<Info />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminMain />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LocationProvider>
  );
}

export default App;
