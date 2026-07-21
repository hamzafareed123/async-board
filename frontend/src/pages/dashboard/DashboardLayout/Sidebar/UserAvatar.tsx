import React from "react";
import { CircleUserRound } from "lucide-react";

interface UserAvatarProps {
  profilePic?: string;
  size?: number; // pixels
  alt?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  profilePic,
  size = 40,
  alt = "User avatar",
  className,
}) => {
  const px = `${size}px`;

  return (
    <div
      style={{ width: px, height: px }}
      className={`rounded-full cursor-pointer overflow-hidden bg-surface flex items-center justify-center ${
        className ?? ""
      }`}
    >
      {profilePic ? (
        <img
          src={profilePic}
          alt={alt}
          onError={(e) => {
           
            e.currentTarget.style.display = "none";
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <CircleUserRound size={Math.max(16, Math.floor(size * 0.6))} className="text-text-secondary" />
      )}
    </div>
  );
};

export default UserAvatar