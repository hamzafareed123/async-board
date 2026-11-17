import { ENV } from "../../config/env";
import { ERROR_MESSAGE } from "../../constants/error-message";
import { STATUS_CODE } from "../../constants/status-codes";
import { ICreateRoomDTO } from '../../types/room-types';
import { customError } from "../../utils/custom-error";
import crypto from 'crypto';
import { roomRepository } from "./room-repositories";


export const roomServices = {
    async createRoom(userId: string, roomData: ICreateRoomDTO) {

        const code = crypto.randomBytes(16).toString("hex");
        const editorCode = crypto.randomBytes(16).toString("hex");

        const room = await roomRepository.createRoom(userId, { ...roomData, inviteCode: code, editorCode });

        return {
            room,
            inviteLink: `${ENV.SERVER_URL}/join/${code}`
        };


    },

    async deleteRoom(creator_id: string, room_id: string) {

        const room = await roomRepository.findRoomByIdAndCreator(creator_id, room_id);

        if (!room) {
            throw new customError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED)
        }

        await roomRepository.deleteRoom(room_id)
    },

    async joinRoom(user_id: string, room_code: string, role: "editor" | "viewer" = "viewer") {

        const room = await roomRepository.findRoomByCode(room_code);

        if (!room) {
            throw new customError(ERROR_MESSAGE.ROOM_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        if (role === "editor" && room.inviteCode.editorCode !== room_code) {
            throw new customError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
        }

        if (room.inviteCode?.expiresAt && room.inviteCode.expiresAt < new Date()) {
            throw new customError(ERROR_MESSAGE.ROOM_EXPIRED, STATUS_CODE.NOT_FOUND)
        }

        const alreadyMember = room.members.find(
            (f) => f.userId.toString() === user_id.toString()
        );

        if (alreadyMember) {
            return {
                updatedRoom: (() => {
                    const safeRoom = room.toObject();
                    delete safeRoom.inviteCode.editorCode;
                    return safeRoom;
                })(),
                alreadyJoined: true,
            };
        }

        if (
            room.inviteCode.maxMembers &&
            room.members.length >= room.inviteCode.maxMembers
        ) {
            throw new customError(ERROR_MESSAGE.ROOM_FULL, STATUS_CODE.BAD_REQUEST);
        }

        const updatedRoom = await roomRepository.joinRoom(user_id, room.id,role);

        const safeRoom = updatedRoom?.toObject();
        if (!safeRoom) throw new customError(ERROR_MESSAGE.ROOM_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        if (safeRoom?.inviteCode) delete safeRoom.inviteCode.editorCode;

        return {
            updatedRoom: safeRoom,
            alreadyJoined: false,
        };
    },

    async getRoomMembers(user_id: string, room_id: string) {

        const room = await roomRepository.findRoomAndPopulateMember(user_id, room_id)

        if (!room) {
            throw new customError(ERROR_MESSAGE.ROOM_MEMBER_NOT_FOUND, STATUS_CODE.NOT_FOUND)
        }

        return room.members;
    },
    async getUserRooms(userId: string) {
        return await roomRepository.getUserRooms(userId);
    },
    async getRoomById(room_id: string) {

        const room = await roomRepository.getRoomById(room_id)
        if (!room) {
            throw new customError(ERROR_MESSAGE.ROOM_NOT_FOUND, STATUS_CODE.NOT_FOUND)
        }

        return room;
    },
    async getEditorInviteCode(userId: string, roomId: string) {
        const room = await roomRepository.findRoomByIdAndCreator(userId, roomId);
        if (!room) throw new customError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
        if (room.inviteCode.editorCode) return room.inviteCode.editorCode;

        const code = crypto.randomBytes(16).toString("hex");
        const savedCode = await roomRepository.setEditorInviteCodeIfMissing(roomId, code);
        if (savedCode) return savedCode;

        const updatedRoom = await roomRepository.findRoomByIdAndCreator(userId, roomId);
        if (updatedRoom?.inviteCode.editorCode) return updatedRoom.inviteCode.editorCode;
        throw new customError(ERROR_MESSAGE.ROOM_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    },
}


