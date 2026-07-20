import { useState } from "react";
import type { IUpdateProfileDTO, IUser } from "../../../../types/auth-types";
import { useAuthStore } from "../../../../store/auth-store";
import { getErrorMessage } from "../../../../utils/error-helper";
import FormInput from "../../../../components/forms/FormInput";
import Button from "../../../../components/ui/button";

interface UserProfileProps {
  authUser: IUser;
}

const UserProfile = ({ authUser }: UserProfileProps) => {
  const { updateProfile } = useAuthStore();

  const [fullName, setFullName] = useState(authUser.fullName);
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [avatarPreview, setAvatarPreview] = useState(authUser.profilePic);
  const [cursorColor, setCursorColor] = useState(
    authUser.cursorColor || "#000000",
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file)); // local preview only
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const data: IUpdateProfileDTO = {
      fullName,
      avatar: avatarFile,
      cursorColor,
    };

    console.log("data is", data);
    try {
      await updateProfile(data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/90">
          Account
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-text-primary sm:text-4xl">
          Your profile
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
          Update your name, photo, and cursor color.
        </p>
      </div>

      <form
        onSubmit={handleUpdate}
        className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start"
      >
        {/* Avatar column */}
        <div className="flex shrink-0 flex-col items-center gap-2 lg:items-start">
          <div className="relative">
            <img
              src={avatarPreview}
              alt="Profile avatar"
              className="h-24 w-24 rounded-full border border-border object-cover"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-2 text-text-secondary shadow-sm transition hover:bg-surface hover:text-text-primary"
              aria-label="Change avatar"
            >
              <span className="text-xs">Edit</span>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <p className="text-xs text-text-secondary">PNG or JPG, up to 5MB.</p>
        </div>

        {/* Fields column — takes remaining width */}
        <div className="grid flex-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormInput
              label="Full name"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-4 py-3 sm:col-span-2">
            <div>
              <label
                htmlFor="cursor-color"
                className="block text-sm font-medium text-text-primary"
              >
                Cursor color
              </label>
              <p className="text-xs text-text-secondary">
                Shown to others while you work on a board.
              </p>
            </div>
            <input
              id="cursor-color"
              type="color"
              value={cursorColor}
              onChange={(e) => setCursorColor(e.target.value)}
              className="h-9 w-9 cursor-pointer rounded-lg border border-border"
            />
          </div>

          {error && <p className="text-sm text-error sm:col-span-2">{error}</p>}

          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              label={isSubmitting ? "Saving..." : "Save changes"}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
