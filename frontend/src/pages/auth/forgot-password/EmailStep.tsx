import { useState } from "react";
import FormInput from "../../../components/forms/FormInput";
import Button from "../../../components/ui/button";
import { authServices } from "../../../services/auth-services";
import { getErrorMessage } from "../../../utils/error-helper";

interface EmailStepProps {
  onSuccess: (userId: string) => void;
}

const EmailStep = ({ onSuccess }: EmailStepProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authServices.forgotPassword({ email });
      onSuccess(response.data.userId);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-border/70 bg-surface p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-text-primary">Forgot password?</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Enter your email and we’ll send you a verification code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error ?? undefined}
        />

        <Button label="Send OTP" type="submit" isLoading={isLoading} onClick={() => {}} />
      </form>
    </div>
  );
};

export default EmailStep;
