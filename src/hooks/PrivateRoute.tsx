import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export const PrivateRoute: React.FC = () => {
  const { usuario } = useAuth();
  return usuario ? <Outlet /> : <Navigate to="/" replace />;
};
