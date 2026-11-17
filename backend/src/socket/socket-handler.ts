import { Server, Socket } from "socket.io";
import { roomRepository } from "../modules/room/room-repositories";
import { ERROR_MESSAGE } from "../constants/error-message";
import { STATUS_CODE } from "../constants/status-codes";
import { SOCKET_EVENTS } from "./socket-events";

type RoomEvent = { roomId?: unknown; [key: string]: unknown };

export const registerSocketHandler = async (io: Server) => {
  io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
    const userId = String(socket.data.userId);

    const authorizeRoom = async (roomId: unknown, write = false) => {
      if (typeof roomId !== "string" || !roomId || !socket.rooms.has(roomId)) {
        socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
        return false;
      }
      const room = await roomRepository.findRoomById(roomId);
      const member = room?.members.find((entry) => entry.userId.toString() === userId);
      if (!member || (write && member.role !== "owner" && member.role !== "editor")) {
        socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
        return false;
      }
      return true;
    };

    socket.on(SOCKET_EVENTS.ROOM_JOIN, async (roomId: unknown) => {
      if (typeof roomId !== "string" || !roomId) return;
      const room = await roomRepository.findRoomById(roomId);
      if (!room) {
        socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGE.ROOM_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        return;
      }
      const member = room.members.some((entry) => entry.userId.toString() === userId);
      if (!member) {
        socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGE.ROOM_MEMBER_NOT_FOUND, STATUS_CODE.FORBIDDEN);
        return;
      }

      await socket.join(roomId);
      const connectedSockets = await io.in(roomId).fetchSockets();
      const onlineMembers = Array.from(new Map(connectedSockets.map((connectedSocket) => [
        connectedSocket.data.userId,
        {
          userId: connectedSocket.data.userId,
          fullName: connectedSocket.data.fullName,
          profilePic: connectedSocket.data.profilePic,
          cursorColor: connectedSocket.data.cursorColor,
        },
      ])).values());

      socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomId, members: onlineMembers });
      socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, {
        userId,
        fullName: socket.data.fullName,
        profilePic: socket.data.profilePic,
        cursorColor: socket.data.cursorColor,
      });
    });

    socket.on(SOCKET_EVENTS.ROOM_LEAVE, async (roomId: unknown) => {
      if (typeof roomId !== "string" || !socket.rooms.has(roomId)) return;
      await socket.leave(roomId);
      const connectedSockets = await io.in(roomId).fetchSockets();
      if (!connectedSockets.some((connectedSocket) => connectedSocket.data.userId === userId)) {
        socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, { userId });
      }
    });

    socket.on(SOCKET_EVENTS.CURSOR_MOVE, async (data: RoomEvent) => {
      if (!data || !(await authorizeRoom(data.roomId))) return;
      const position = data.cursorPosition as { x?: unknown; y?: unknown } | undefined;
      if (!position || typeof position.x !== "number" || typeof position.y !== "number" ||
        !Number.isFinite(position.x) || !Number.isFinite(position.y)) return;
      socket.to(data.roomId as string).emit(SOCKET_EVENTS.CURSOR_MOVED, {
        userId, cursorPosition: position, fullName: socket.data.fullName, cursorColor: socket.data.cursorColor,
      });
    });

    const relayEditorEvent = (event: string, outputEvent: string, map: (data: RoomEvent) => object = (data) => data) => {
      socket.on(event, async (data: RoomEvent) => {
        if (!data || !(await authorizeRoom(data.roomId, true))) return;
        socket.to(data.roomId as string).emit(outputEvent, { userId, ...map(data) });
      });
    };

    relayEditorEvent(SOCKET_EVENTS.ELEMENT_CREATED, SOCKET_EVENTS.ELEMENT_CREATED);
    relayEditorEvent(SOCKET_EVENTS.ELEMENT_PREVIEW, SOCKET_EVENTS.ELEMENT_PREVIEW);
    relayEditorEvent(SOCKET_EVENTS.ELEMENT_PREVIEW_END, SOCKET_EVENTS.ELEMENT_PREVIEW_END);
    relayEditorEvent(SOCKET_EVENTS.ELEMENT_UPDATE, SOCKET_EVENTS.ELEMENT_UPDATED);
    relayEditorEvent(SOCKET_EVENTS.ELEMENT_DELETE, SOCKET_EVENTS.ELEMENT_DELETED);

    socket.on(SOCKET_EVENTS.SNAPSHOT_RESTORE, async (data: RoomEvent) => {
      if (!data || !(await authorizeRoom(data.roomId, true))) return;
      const room = await roomRepository.findRoomById(data.roomId as string);
      const member = room?.members.find((entry) => entry.userId.toString() === userId);
      if (member?.role !== "owner") {
        socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
        return;
      }
      io.to(data.roomId as string).emit(SOCKET_EVENTS.SNAPSHOT_RESTORED, { userId, elements: data.elements });
    });

    socket.on("disconnecting", async () => {
      const roomIds = Array.from(socket.rooms).filter((roomId) => roomId !== socket.id);
      for (const roomId of roomIds) {
        const connectedSockets = await io.in(roomId).fetchSockets();
        if (!connectedSockets.some((connectedSocket) => connectedSocket.id !== socket.id && connectedSocket.data.userId === userId)) {
          socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, { userId });
        }
      }
    });
  });
};
