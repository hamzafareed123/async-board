import React from "react";
import { useAuthStore } from "../../store/auth-store";
import Spinner from "../ui/Spinner";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isCheckingAuth, authUser } = useAuthStore();

  const location = useLocation()

  if (isCheckingAuth) return <Spinner />;

  if (!authUser) return <Navigate to="/login" state={{from:location}} replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
