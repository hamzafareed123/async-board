import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useRoomStore } from "../../store/room-store";
import CanvasHeader from "./components/header/CanvasHeader";
import { useCanvasStore } from "../../store/canvas-store";
import ToolBar from "./components/toolbar/ToolBar";
import CanvasBoard from "./components/canvas/CanvasBoard";
import { useSocket } from "../../hooks/useSocket";

const CanvasPage = () => {
  const { roomId } = useParams();
  const { getRoomById, room } = useRoomStore();
  const { onlineMembers,cursors } = useSocket(roomId ?? "");
  

  const copiedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { loadElements, clearElements } = useCanvasStore();

  useEffect(() => {
    if (roomId) getRoomById(roomId);
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      loadElements(roomId);
    }
    return () => {
      clearElements();
    };
  }, [roomId, loadElements, clearElements]);

  useEffect(
    () => () => {
      if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
    },
    [],
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <CanvasBoard roomId={roomId || ""} cursors={cursors} />
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <CanvasHeader
            roomName={room?.name || ""}
            roomId={roomId || ""}
            onlineMembers={onlineMembers}
            onExport={() => {}}
        
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
