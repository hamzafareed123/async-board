import {
  ArrowUpRight,
  Calendar,
  Globe,
  LayoutDashboard,
  Lock,
  Trash2,
  Users,
} from "lucide-react";
import type { IRoom } from "../../../../types/room-types";

interface RoomCardProps {
  room: IRoom;
  onDelete: (id: string) => void;
  onClick?: () => void;
  currentUserId: string;
}

const RoomCard = ({ room, onDelete, onClick, currentUserId }: RoomCardProps) => {
  const isOwner = room.members.some(
    (member) => member.userId?._id === currentUserId && member.role === "owner",
  );
  const membersToShow = room.members.slice(0, 3);
  const remainingMembers = room.members.length - membersToShow.length;
  const createdDate = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(room.createdAt));

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(room._id);
  };

  return (
    <article
      onClick={onClick}
      className={`group cursor-pointer relative flex flex-col overflow-hidden  border border-border bg-surface p-4 shadow-sm transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
          : "hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 " />

      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <LayoutDashboard size={19} />
        </div>
        {isOwner && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl p-2 text-text-muted opacity-0 transition hover:bg-red-50 hover:text-error focus:opacity-100 group-hover:opacity-100"
            aria-label={`Delete ${room.name}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                room.isPublic
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-surface-2 text-text-secondary"
              }`}
            >
              {room.isPublic ? <Globe size={12} /> : <Lock size={12} />}
              {room.isPublic ? "Public" : "Private"}
            </span>
            {isOwner && (
              <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                Owner
              </span>
            )}
          </div>

          <h3 className="line-clamp-1 text-lg font-semibold text-text-primary">
            {room.name}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm leading-5 text-text-secondary">
            {room.description || "A shared space for ideas, plans, and teamwork."}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="flex -space-x-2">
            {membersToShow.map((member) => {
              const memberName = member.userId?.fullName || "Member";
              const profilePic = member.userId?.profilePic;

              return (
                <div
                  key={member._id}
                  title={memberName}
                  className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-primary-light text-[9px] font-semibold text-primary"
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    memberName.slice(0, 1).toUpperCase()
                  )}
                </div>
              );
            })}
            {remainingMembers > 0 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-surface-2 text-[9px] font-semibold text-text-secondary">
                +{remainingMembers}
              </div>
            )}
          </div>
          <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-text-secondary">
            <Users size={11} />
            {room.members.length} member{room.members.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-end border-t border-border pt-3">
        <div className="text-right">
          <span className="flex items-center justify-end gap-1 text-xs text-text-secondary">
            <Calendar size={12} />
            {createdDate}
          </span>
          {onClick && (
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Open board <ArrowUpRight size={13} />
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
