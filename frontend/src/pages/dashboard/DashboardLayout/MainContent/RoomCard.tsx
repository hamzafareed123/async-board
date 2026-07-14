import { Trash2, Users, Calendar, Lock, Globe } from "lucide-react";
import type { IRoom } from "../../../../types/room-types";

interface RoomCardProps {
  room: IRoom;
  onDelete: (id: string) => void;
  onClick: () => void;
  currentUserId: string;
}

const RoomCard = ({
  room,
  onDelete,
  onClick,
  currentUserId,
}: RoomCardProps) => {
  const isOwner = room.members.find(
    (m) => m.userId._id === currentUserId && m.role === "owner",
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // ← stops card click from firing
    onDelete(room._id);
  };

  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border rounded-xl p-5 cursor-pointer
                hover:border-primary hover:shadow-sm transition-all group"
    >
      {/* Top row — name + delete */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-text-primary text-sm leading-snug">
          {room.name}
        </h3>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition
                            text-text-secondary hover:text-error p-1 rounded"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Description */}
      {room.description && (
        <p className="text-xs text-text-secondary mb-3 line-clamp-2">
          {room.description}
        </p>
      )}

      {/* Bottom row — meta info */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          {/* Member count */}
          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <Users size={12} />
            {room.members.length}
          </span>

          {/* Created date */}
          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <Calendar size={12} />
            {new Date(room.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Public / Private badge */}
        <span className="flex items-center gap-1 text-xs text-text-secondary">
          {room.isPublic ? (
            <>
              <Globe size={11} /> Public
            </>
          ) : (
            <>
              <Lock size={11} /> Private
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default RoomCard;
