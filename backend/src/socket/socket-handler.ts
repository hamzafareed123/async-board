import { Server } from "socket.io";
import { roomRepository } from "../modules/room/room-repositories";
import { ERROR_MESSAGE } from "../constants/error-message";
import { STATUS_CODE } from "../constants/status-codes";
import { SOCKET_EVENTS } from "./socket-events";

export const registerSocketHandler = async (io: Server) => {
    io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
        console.log("user connected", socket.data.userId)

        socket.on(SOCKET_EVENTS.ROOM_JOIN, async (roomId: string) => {
            const room = await roomRepository.findRoomById(roomId)

            if (!room) {
                socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGE.ROOM_NOT_FOUND, STATUS_CODE.NOT_FOUND)
                return
            }

            const isMember = room.members.find(u =>
                u.userId.toString() === socket.data.userId.toString()
            );

            if (!isMember) {
                socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGE.ROOM_MEMBER_NOT_FOUND, STATUS_CODE.NOT_FOUND)
                return
            }

            socket.join(roomId)

            const connectedSockets = await io.in(roomId).fetchSockets();
            const onlineMembers = Array.from(
                new Map(
                    connectedSockets.map((connectedSocket) => [
                        connectedSocket.data.userId,
                        {
                            userId: connectedSocket.data.userId,
                            fullName: connectedSocket.data.fullName,
                            profilePic: connectedSocket.data.profilePic,
                            cursorColor: connectedSocket.data.cursorColor,
                        },
                    ])
                ).values()
            );

            socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
                roomId,
                members: onlineMembers,
            });




            socket.to(roomId).emit("user:joined", {
                userId: socket.data.userId,
                fullName: socket.data.fullName,
                profilePic: socket.data.profilePic,
                cursorColor: socket.data.cursorColor,
            });

        })

        socket.on(SOCKET_EVENTS.ROOM_LEAVE, async (roomId: string) => {
            socket.leave(roomId)
            const connectedSockets = await io.in(roomId).fetchSockets();
            const userIsStillConnected = connectedSockets.some(
                (connectedSocket) => connectedSocket.data.userId === socket.data.userId
            );

            if (!userIsStillConnected) {
                socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
                    userId: socket.data.userId
                })
            }
        })


        socket.on(SOCKET_EVENTS.CURSOR_MOVE, (data: { roomId: string, cursorPosition: { x: number, y: number }, fullName: string, cursorColor: string }) => {
            socket.to(data.roomId).emit(SOCKET_EVENTS.CURSOR_MOVED, {
                userId: socket.data.userId,
                cursorPosition: data.cursorPosition,
                fullName: socket.data.fullName,
                cursorColor: socket.data.cursorColor
            })
        })

        socket.on(SOCKET_EVENTS.ELEMENT_CREATED, (data: { roomId: string, element: any }) => {
            socket.to(data.roomId).emit(SOCKET_EVENTS.ELEMENT_CREATED, {
                userId: socket.data.userId,
                element: data.element
            })
        })

        socket.on(SOCKET_EVENTS.ELEMENT_PREVIEW, (data: { roomId: string, shape: any }) => {
            socket.to(data.roomId).emit(SOCKET_EVENTS.ELEMENT_PREVIEW, {
                userId: socket.data.userId,
                shape: data.shape
            })
        })

        socket.on(SOCKET_EVENTS.ELEMENT_PREVIEW_END, (data: { roomId: string, shapeId: string }) => {
            socket.to(data.roomId).emit(SOCKET_EVENTS.ELEMENT_PREVIEW_END, {
                userId: socket.data.userId,
                shapeId: data.shapeId
            })
        })

        socket.on(SOCKET_EVENTS.ELEMENT_UPDATE, (data: { roomId: string, elementId: string, change: any }) => {
            socket.to(data.roomId).emit(SOCKET_EVENTS.ELEMENT_UPDATED, {
                userId: socket.data.userId,
                elementId: data.elementId,
                change: data.change
            })
        })

        socket.on(SOCKET_EVENTS.ELEMENT_DELETE, (data: { roomId: string, elementId: string }) => {
            socket.to(data.roomId).emit(SOCKET_EVENTS.ELEMENT_DELETED, {
                userId: socket.data.userId,
                elementId: data.elementId
            })
        })

        socket.on(SOCKET_EVENTS.SNAPSHOT_RESTORE, (data: { roomId: string, elements: any }) => {
            io.to(data.roomId).emit(SOCKET_EVENTS.SNAPSHOT_RESTORED, {
                userId: socket.data.userId,
                elements: data.elements
            })
        })
        socket.on("disconnecting", async () => {
            console.log("user disconnected", socket.data.userId)
            const roomIds = Array.from(socket.rooms).filter(
                (roomId): roomId is string => typeof roomId === "string" && roomId !== socket.id
            );

            for (const roomId of roomIds) {
                const connectedSockets = await io.in(roomId).fetchSockets();
                const userIsStillConnected = connectedSockets.some(
                    (connectedSocket) =>
                        connectedSocket.id !== socket.id &&
                        connectedSocket.data.userId === socket.data.userId
                );

                if (!userIsStillConnected) {
                    socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
                        userId: socket.data.userId
                    })
                }
            }
        })

    })
}
