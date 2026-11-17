import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { useAuthStore } from "./store/auth-store";
import PublicRoute from "./components/routes/PublicRoute";

const LandingPage = lazy(() => import("./pages/Landing/LandingPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/forgot-password/ForgotPasswordPage"));
const CanvasPage = lazy(() => import("./pages/canvas/CanvasPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const JoinPage = lazy(() => import("./pages/canvas/components/canvas/JoinPage").then((module) => ({ default: module.JoinPage })));

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // TODO
  // set the already join room member issue, live user issue ,elements live sync
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background text-sm text-text-secondary">Loading SyncBoard…</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/canvas/:roomId" element={<ProtectedRoute><CanvasPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/join/:code" element={<ProtectedRoute><JoinPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
