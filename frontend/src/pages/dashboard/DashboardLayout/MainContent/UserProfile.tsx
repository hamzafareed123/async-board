import { useState } from "react";
import type { IUpdateProfileDTO, IUser } from "../../../../types/auth-types";
import { useAuthStore } from "../../../../store/auth-store";
import { getErrorMessage } from "../../../../utils/error-helper";
import FormInput from "../../../../components/forms/FormInput";
import Button from "../../../../components/ui/button";
import { Camera, Check } from "lucide-react";

interface UserProfileProps {
  authUser: IUser;
}

const PRESET_COLORS = [
  "#6366F1",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
];

const UserProfile = ({ authUser }: UserProfileProps) => {
  const { updateProfile } = useAuthStore();

  const [fullName, setFullName] = useState(authUser.fullName);
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [avatarPreview, setAvatarPreview] = useState(authUser.profilePic);
  const [cursorColor, setCursorColor] = useState(
    authUser.cursorColor || "#6366F1",
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    setIsSubmitting(true);

    const data: IUpdateProfileDTO = {
      fullName,
      avatar: avatarFile,
      cursorColor,
    };

    try {
      await updateProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {saved && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-success/20 bg-surface px-4 py-2 text-sm font-medium text-success shadow-lg"
        >
          <Check size={16} strokeWidth={3} />
          Profile updated successfully
        </div>
      )}

      <div className="w-full max-w-xl rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Settings
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-text-primary">
            Your profile
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Update how you appear to teammates on boards.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover border border-border"
                />
              ) : (
                <div
                  className="h-16 w-16 rounded-full border border-border flex items-center justify-center text-lg font-semibold text-white"
                  style={{ background: cursorColor }}
                >
                  {initials}
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow"
              >
                <Camera size={11} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {fullName}
              </p>
              <p className="text-xs text-text-secondary">{authUser.email}</p>
              <p className="mt-0.5 text-xs text-text-secondary">
                PNG or JPG · Max 5 MB
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Full name */}
          <FormInput
            label="Full name"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Cursor color */}
          <div>
            <p className="mb-1 text-sm font-medium text-text-primary">
              Cursor color
            </p>
            <p className="mb-3 text-xs text-text-secondary">
              Visible to teammates when you're active on a board.
            </p>

            {/* Preset swatches */}
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCursorColor(color)}
                  className="relative h-7 w-7 rounded-full cursor-pointer border-2 transition"
                  style={{
                    background: color,
                    borderColor: cursorColor === color ? color : "transparent",
                    outline:
                      cursorColor === color ? `2px solid ${color}` : "none",
                    outlineOffset: "2px",
                  }}
                >
                  {cursorColor === color && (
                    <Check
                      size={12}
                      className="absolute inset-0 m-auto text-white"
                      strokeWidth={3}
                    />
                  )}
                </button>
              ))}

              {/* Custom color picker */}
              <label className="relative h-7 w-7 cursor-pointer rounded-full border border-dashed border-border flex items-center justify-center text-text-secondary hover:border-primary transition text-xs">
                +
                <input
                  type="color"
                  value={cursorColor}
                  onChange={(e) => setCursorColor(e.target.value)}
                  className="absolute inset-0 opacity-0 outline-0 cursor-pointer w-full h-full"
                />
              </label>

              {/* Live preview */}
              <div className="ml-2 flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: cursorColor }}
                />
                <span className="text-xs text-text-secondary font-mono">
                  {cursorColor}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Error */}
          {error && <p className="text-xs text-error">{error}</p>}

          {/* Submit */}
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              label={isSubmitting ? "Saving..." : "Save changes"}
            />
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
