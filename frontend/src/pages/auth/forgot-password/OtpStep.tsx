import { useEffect, useRef, useState } from "react";
import Button from "../../../components/ui/button";
import { authServices } from "../../../services/auth-services";
import { getErrorMessage } from "../../../utils/error-helper";

interface OtpStepProps {
  userId: string;
  onSuccess: (userId: string) => void;
}

const OtpStep = ({ userId, onSuccess }: OtpStepProps) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent] = useState(true);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedValue = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedValue) return;

    e.preventDefault();
    const newOtp = Array(6).fill("");
    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const code = otp.join("");

    if (code.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authServices.verifyOTP({ userId, otp: code });
      setVerified(true);
      onSuccess(response.data.resetToken);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="rounded-[24px] border border-border/70 bg-surface p-6 shadow-sm sm:p-8">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-semibold text-text-primary">Enter verification code</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          We sent a 6-digit code to your email.
        </p>
      </div>

      {emailSent && (
        <div className="mb-4 rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-center text-sm text-success">
          OTP sent to your email successfully.
        </div>
      )}

      {verified && (
        <div className="mb-4 rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-center text-sm text-success">
          Email verified successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`h-12 w-11 rounded-xl border text-center text-lg font-semibold text-text-primary outline-none transition sm:h-14 sm:w-12 ${
                error ? "border-error" : "border-border focus:border-primary"
              }`}
            />
          ))}
        </div>

        {error && <p className="text-center text-xs text-error">{error}</p>}

        <Button label="Verify OTP" type="submit" isLoading={isLoading} onClick={() => {}} />
      </form>
    </div>
  );
};

export default OtpStep;