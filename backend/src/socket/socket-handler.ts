import { Server } from "socket.io";
import { roomRepository } from "../modules/room/room-repositories";
import { ERROR_MESSAGE } from "../constants/error-message";
import { STATUS_CODE } from "../constants/status-codes";

export const registerSocketHandler = async (io: Server) => {
    io.on("connection", async (socket) => {
        console.log("user connected", (socket as any).userId)

        socket.on("room:join", async (roomId: string) => {
            console.log("room:join received", roomId);

            const room = await roomRepository.findRoomById(roomId)

            if (!room) {
                socket.emit("error", ERROR_MESSAGE.ROOM_NOT_FOUND, STATUS_CODE.NOT_FOUND)
                return
            }

            const isMember = room.members.find(u => u.userId.toString() === (socket as any).userId.toString())

            if (!isMember) {
                socket.emit("error", ERROR_MESSAGE.ROOM_MEMBER_NOT_FOUND, STATUS_CODE.NOT_FOUND)
                return
            }

            socket.join(roomId)

            socket.emit("room:joined",
                { roomId, members: room.members.map(m => m.userId.toString()) })

            socket.to(roomId).emit("user:joined", {
                userId: (socket as any).userId.toString(),
                members: room.members.map(m => m.userId.toString())
            })

        })

        socket.on("room:leave", (roomId: string) => {
            socket.leave(roomId)
            socket.to(roomId).emit("user:left", {
                userId: (socket as any).userId
            })
        })

        socket.on("disconnect", () => {
            console.log("user disconnected", (socket as any).userId)
            socket.rooms.forEach(roomId => {
                socket.to(roomId).emit("user:left", {
                    userId: (socket as any).userId
                })
            })
        })
    })
}