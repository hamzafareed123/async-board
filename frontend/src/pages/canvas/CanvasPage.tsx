import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRoomStore } from "../../store/room-store";
import CanvasHeader from "./components/header/CanvasHeader";
import { onlineMembers } from "../../data/onlineMembersData";
import ToolBar from "./components/toolbar/ToolBar";

const CanvasPage = () => {
  const { roomId } = useParams();
  const { getRoomById, room } = useRoomStore();

  useEffect(() => {
    if (roomId) getRoomById(roomId);
  }, [getRoomById]);

  console.log("Room id", roomId);
  return (
    <div>
      <CanvasHeader
        roomName={room?.name || ""}
        roomId={roomId || ""}
        onlineMembers={onlineMembers} // ← from socket later
        onExport={() => {}}
        onShare={() => {}}
      />

      <ToolBar/>

    </div>
  );
};

export default CanvasPage;
