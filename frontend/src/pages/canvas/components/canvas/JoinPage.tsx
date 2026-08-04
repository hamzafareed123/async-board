import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRoomStore } from "../../../../store/room-store";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../../utils/error-helper";
import { roomServices } from "../../../../services/room-services";

export const JoinPage = () => {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "viewer";
  const navigate = useNavigate();
  const { joinRoom } = useRoomStore();
  const [joining, setJoining] = useState(false);
  const [checkingRoom, setCheckingRoom] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const redirectExistingMember = async () => {
      if (!code) {
        setCheckingRoom(false);
        return;
      }

      try {
        const response = await roomServices.getRooms();
        const existingRoom = response.data.find(
          (room: { _id: string; inviteCode: { code: string } }) =>
            room.inviteCode.code === code,
        );

        if (isActive && existingRoom) {
          navigate(`/canvas/${existingRoom._id}`, { replace: true });
          return;
        }
      } catch {
        // The join request below will show any invitation-related error.
      } finally {
        if (isActive) {
          setCheckingRoom(false);
        }
      }
    };

    redirectExistingMember();

    return () => {
      isActive = false;
    };
  }, [code, navigate]);

  const handleJoin = async () => {
    setJoining(true);
    setError(null);
    try {
      const room = await joinRoom(code!, role);
      console.log("room new data", room);
      navigate(`/canvas/${room.updatedRoom._id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't join this room."));
    } finally {
      setJoining(false);
    }
  };

  if (checkingRoom) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-text-secondary">Checking invitation...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center border border-border rounded-xl p-8 bg-surface">
        <h2 className="text-xl font-semibold mb-2">Join this board?</h2>
        <p className="text-sm text-text-secondary mb-6">
          You've been invited to collaborate on this board.
        </p>
        <button
          disabled={joining}
          onClick={handleJoin}
          className="px-4 py-2 bg-primary text-white rounded cursor-pointer hover:bg-primary-dark disabled:opacity-50"
        >
          {joining ? "Joining..." : "Join Room"}
        </button>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};
