import { useState } from "react";
import AuthForm from "../../components/forms/AuthForm";
import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/error-helper";
import collab1 from "../../assets/collab1.png";

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_40%),linear-gradient(135deg,_#f8faff_0%,_#f5f7ff_100%)] px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-6xl overflow-hidden rounded-[28px] border border-border/70 bg-surface shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[280px] overflow-hidden bg-primary-light lg:min-h-[680px]">
            <img
              src={collab1}
              alt="Team collaboration illustration"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-slate-900/10" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-100">
                SyncBoard
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Build together faster.
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-100 sm:text-base">
                Create boards, share progress, and keep everyone in the loop
                with a smooth collaborative workspace.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center bg-surface px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="w-full max-w-md">
              <AuthForm mode="signup" onSubmit={handleSignup} />
              {error && (
                <div className="mb-4 mt-2 text-center rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
