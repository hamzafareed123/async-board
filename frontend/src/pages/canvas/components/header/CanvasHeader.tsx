import { useState } from "react";
import { ArrowLeft, Download, Share2, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MemberAvatars from "./MemberAvatars";
import ShareModal from "../canvas/ShareModal"

interface CanvasHeaderProps {
  roomName: string;
  roomId: string;
  onlineMembers: {
    userId: string;
    fullName: string;
    profilePic?: string;
    cursorColor: string;
  }[];
  onExport: () => void;
 

}

const CanvasHeader = ({
  roomName,
  onlineMembers,
  onExport,
 
 
}: CanvasHeaderProps) => {
  const [name, setName] = useState(roomName);
  const [isEditing, setIsEditing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const navigate = useNavigate();

  const handleBlur = () => setIsEditing(false);

  return (
    <>
      <header className="flex items-center h-12 px-4 bg-white/95 backdrop-blur-sm
          border-b border-gray-200 select-none shadow-sm">

        {/* LEFT */}
        <div className="flex items-center gap-1 min-w-0">

          {/* Back */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center w-7 h-7 rounded-md
                text-gray-400 hover:text-gray-700 hover:bg-gray-100
                transition-all shrink-0 cursor-pointer"
            title="Back to dashboard"
          >
            <ArrowLeft size={15} />
          </button>

          <span className="w-px h-3.5 bg-gray-200 mx-2 shrink-0" />

          {/* Brand */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">AB</span>
            </div>
            <span className="text-xs font-semibold text-gray-800 hidden sm:block">
              Async Board
            </span>
          </div>

          <span className="w-px h-3.5 bg-gray-200 mx-2 shrink-0" />

          {/* Room name */}
          <div className="relative flex items-center group">
            {isEditing ? (
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleBlur();
                  if (e.key === "Escape") {
                    setName(roomName);
                    setIsEditing(false);
                  }
                }}
                className="text-sm font-medium text-gray-800
                    bg-indigo-50 border border-indigo-300 rounded-md
                    px-2 py-0.5 outline-none ring-2 ring-indigo-100
                    w-44 transition-all"
                placeholder="Board name"
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-sm font-medium
                    text-gray-800 px-2 py-0.5 rounded-md
                    hover:bg-gray-100 transition-all truncate max-w-[180px] cursor-pointer"
                title="Click to rename"
              >
                <span className="truncate">{name || "Untitled"}</span>
                <ChevronDown
                  size={11}
                  className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                />
              </button>
            )}
          </div>
        </div>

        {/* SPACER */}
        <div className="flex-1" />

        {/* RIGHT */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Online members */}
          {onlineMembers.length > 0 && (
            <>
              <MemberAvatars members={onlineMembers} />
              <span className="w-px h-3.5 bg-gray-200 mx-1" />
            </>
          )}

          {/* Export */}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-2.5 h-7 rounded-md
                border border-gray-200 text-gray-600 text-xs font-medium
                hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
          >
            <Download size={12} />
            <span className="hidden sm:block">Export</span>
          </button>

          {/* Share */}
          <button
          
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-1.5 px-3 h-7 rounded-md
                bg-primary text-white text-xs font-semibold
                hover:bg-primary-hover active:scale-95
                transition-all shadow-sm cursor-pointer"
          >
            <Share2 size={12} />
            Share
          </button>
        </div>
      </header>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
};

export default CanvasHeader;