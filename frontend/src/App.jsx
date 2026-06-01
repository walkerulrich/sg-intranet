import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Employees } from "./pages/Employees";
import { Gallery } from "./pages/Gallery";
import { Header } from "./components/Header";
import { useAuth } from "./hooks/useAuth";

function ProtectedLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}

function PublicOnly({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
      <Route path="/employees" element={<ProtectedLayout><Employees /></ProtectedLayout>} />
      <Route path="/gallery" element={<ProtectedLayout><Gallery /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
