import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/forms/AuthForm";
import { useAuthStore } from "../../store/auth-store";
import { useState } from "react";
import { getErrorMessage } from "../../utils/error-helper";

const LoginPage = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await login({ email: values.email, password: values.password });
      navigate("/dashboard");
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Invalid credentials"));
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}
    >
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <AuthForm mode="login" onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
