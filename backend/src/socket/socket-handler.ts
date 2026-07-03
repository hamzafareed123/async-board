import { Server } from "socket.io";
import { roomRepository } from "../modules/room/room-repositories";
import { ERROR_MESSAGE } from "../constants/error-message";
import { STATUS_CODE } from "../constants/status-codes";
import { SOCKET_EVENTS } from "./socket-events";

export const registerSocketHandler = async (io: Server) => {
    io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
        console.log("user connected", (socket as any).userId)

        socket.on(SOCKET_EVENTS.ROOM_JOIN, async (roomId: string) => {
            console.log("room:join received", roomId);

            const room = await roomRepository.findRoomById(roomId)

            if (!room) {
                socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGE.ROOM_NOT_FOUND, STATUS_CODE.NOT_FOUND)
                return
            }

            const isMember = room.members.find(u => u.userId.toString() === (socket as any).userId.toString())

            if (!isMember) {
                socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGE.ROOM_MEMBER_NOT_FOUND, STATUS_CODE.NOT_FOUND)
                return
            }

            socket.join(roomId)

            socket.emit(SOCKET_EVENTS.ROOM_JOINED,
                { roomId, members: room.members.map(m => m.userId.toString()) })

            socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, {
                userId: (socket as any).userId.toString(),
                members: room.members.map(m => m.userId.toString())
            })

        })

        socket.on(SOCKET_EVENTS.ROOM_LEAVE, (roomId: string) => {
            socket.leave(roomId)
            socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
                userId: (socket as any).userId
            })
        })

        socket.on(SOCKET_EVENTS.CURSOR_MOVE, (data: { roomId: string, cursorPosition: { x: number, y: number } }) => {
            socket.to(data.roomId).emit(SOCKET_EVENTS.CURSOR_MOVED, {
                userId: (socket as any).userId,
                cursorPosition: data.cursorPosition
            })
        })

        socket.on(SOCKET_EVENTS.ELEMENT_CREATED, (data: { roomId: string, element: any }) => {
            socket.to(data.roomId).emit(SOCKET_EVENTS.ELEMENT_CREATED, {
                userId: (socket as any).userId,
                element: data.element
            })
        })

        socket.on(SOCKET_EVENTS.ELEMENT_UPDATE, (data: { roomId: string, elementId: string, change: any }) => {
            socket.to(data.roomId).emit(SOCKET_EVENTS.ELEMENT_UPDATED, {
                userId: (socket as any).userId,
                elementId: data.elementId,
                change: data.change
            })
        })

        socket.on(SOCKET_EVENTS.ELEMENT_DELETE, (data: { roomId: string, elementId: string }) => {
            socket.to(data.roomId).emit(SOCKET_EVENTS.ELEMENT_DELETED, {
                userId: (socket as any).userId,
                elementId: data.elementId
            })
        })

        socket.on(SOCKET_EVENTS.SNAPSHOT_RESTORE,(data:{roomId:string,elements:any})=>{
            io.to(data.roomId).emit(SOCKET_EVENTS.SNAPSHOT_RESTORED,{
                userId:(socket as any).userId,
                elements:data.elements
            })
        })
        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log("user disconnected", (socket as any).userId)
            socket.rooms.forEach((roomId: string) => {
                socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
                    userId: (socket as any).userId
                })
            })
        })

    })
}