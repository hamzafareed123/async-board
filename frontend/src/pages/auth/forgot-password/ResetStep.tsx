import { useState } from "react";
import FormInput from "../../../components/forms/FormInput";
import Button from "../../../components/ui/button";
import { authServices } from "../../../services/auth-services";
import { getErrorMessage } from "../../../utils/error-helper";
import { useNavigate } from "react-router-dom";

interface ResetStepProps {
  resetToken: string;
}

const ResetStep = ({ resetToken }: ResetStepProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setConfirmError(null);
    setApiError(null);

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 5) {
      setPasswordError("Password must be at least 5 characters");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await authServices.resetPassword({
        resetToken,
        password,
        confirmPassword,
      });
      navigate("/login");
    } catch (error: unknown) {
      setApiError(getErrorMessage(error, "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-border/70 bg-surface p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-text-primary">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          label="New password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError ?? undefined}
        />
        <FormInput
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={confirmError ?? undefined}
        />

        {apiError && <p className="text-center text-xs text-error">{apiError}</p>}

        <Button label="Reset password" type="submit" isLoading={isLoading} onClick={() => {}} />
      </form>
    </div>
  );
};

export default ResetStep;