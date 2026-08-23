import { useRoomStore } from "../../../../store/room-store";
import RoomCard from "./RoomCard";
import { useAuthStore } from "../../../../store/auth-store";
import EmptyState from "./EmptyState";
import { useNavigate } from "react-router-dom";

interface UserBoard {
  openCreateModal: () => void;
}

const UserBoard = ({ openCreateModal }: UserBoard) => {
  const { rooms, deleteRoom } = useRoomStore();
  const { authUser } = useAuthStore();

  const navigate = useNavigate();

  const handleClick = (roomId: string) => {
    navigate(`/canvas/${roomId}`);
  };

  return (
    <div>
      {rooms.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
          <EmptyState
            title="No boards yet"
            description="Create your first board to get started"
            actionLabel="+ Create board"
            onAction={openCreateModal}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {rooms.map((room) => (
            <RoomCard
              onClick={() => handleClick(room._id)}
              key={room._id}
              room={room}
              currentUserId={authUser?.id || ""}
              onDelete={deleteRoom}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBoard;
