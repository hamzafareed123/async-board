import { useState } from "react";
import AuthForm from "../../components/forms/AuthForm";
import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/error-helper";

const SignupPage = () => {
  const [error, setError] = useState("");

  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const handleSignup = async (values: {
    fullName?: string;
    email: string;
    password: string;
  }) => {
    try {
      await signup({
        fullName: values.fullName || "",
        email: values.email,
        password: values.password,
      });
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
      <AuthForm mode="signup" onSubmit={handleSignup} />
    </div>
  );
};

export default SignupPage;
