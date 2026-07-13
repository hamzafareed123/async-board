import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";
import ResetStep from "./ResetStep";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [resetToken, setResetToken] = useState("");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_40%),linear-gradient(135deg,_#f8faff_0%,_#f5f7ff_100%)] px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-[28px] border border-border/70 bg-surface p-5 shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:p-8">
        <div className="mb-5 flex items-center justify-between rounded-full border border-border/70 bg-surface-2 px-3 py-2 text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Step {step} of 3</span>
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Back to sign in
          </Link>
        </div>

        {step === 1 && (
          <EmailStep
            onSuccess={(userId) => {
              setUserId(userId);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <OtpStep
            userId={userId}
            onSuccess={(token) => {
              setResetToken(token);
              setStep(3);
            }}
          />
        )}
        {step === 3 && <ResetStep resetToken={resetToken} />}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
