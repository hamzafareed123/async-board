import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRoomStore } from "../../store/room-store";
import CanvasHeader from "./components/header/CanvasHeader";

import ToolBar from "./components/toolbar/ToolBar";
import CanvasBoard from "./components/canvas/CanvasBoard";
import { useSocket } from "../../hooks/useSocket";

const CanvasPage = () => {
  const { roomId } = useParams();
  const { getRoomById, room } = useRoomStore();
  const {onlineMembers} = useSocket(roomId ?? "");
  console.log("avatar")
  useEffect(() => {
    if (roomId) getRoomById(roomId);
  }, [getRoomById]);

  console.log("Online members", onlineMembers);
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <CanvasBoard />
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <CanvasHeader
            roomName={room?.name || ""}
            roomId={roomId || ""}
            onlineMembers={onlineMembers} // ← from socket later
            onExport={() => {}}
            onShare={() => {}}
          />
        </div>
      </div>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <ToolBar />
      </div>
    </div>
  );
};

export default CanvasPage;
