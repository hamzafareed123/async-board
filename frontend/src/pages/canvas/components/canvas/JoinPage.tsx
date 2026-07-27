import { useNavigate, useParams } from "react-router-dom";
import { useRoomStore } from "../../../../store/room-store";
import { useState } from "react";
import { getErrorMessage } from "../../../../utils/error-helper";

export const JoinPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { joinRoom } = useRoomStore(); 
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setJoining(true);
    setError(null);
    try {
      const room = await joinRoom(code!); 
      console.log("room new data",room)
      navigate(`/canvas/${room._id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't join this room."));
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center border border-border rounded-xl p-8 bg-surface">
        <h2 className="text-xl font-semibold mb-2">Join this board?</h2>
        <p className="text-sm text-text-secondary mb-6">
          You've been invited to collaborate on this board.
        </p>
        <button disabled={joining} onClick={handleJoin}>
          {joining ? "Joining..." : "Join Room"}
        </button>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};