import { ENV } from "../../config/env";
import { ERROR_MESSAGE } from "../../constants/error-message";
import { STATUS_CODE } from "../../constants/status-codes";
import { ICreateRoomDTO } from '../../types/room-types';
import { customError } from "../../utils/custom-error";
import crypto from 'crypto';
import { roomRepository } from "./room-repositories";


export const roomServices = {
    async createRoom(userId: string, roomData: ICreateRoomDTO) {

        const code = crypto.randomBytes(4).toString("hex");

        const room = await roomRepository.createRoom(userId, { ...roomData, inviteCode: code });

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

    async joinRoom(user_id: string, room_code: string) {

        const room = await roomRepository.findRoomByCode(room_code);

        if (!room) {
            throw new customError(ERROR_MESSAGE.ROOM_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        if (room.inviteCode?.expiresAt && room.inviteCode.expiresAt < new Date()) {
            throw new customError(ERROR_MESSAGE.ROOM_EXPIRED, STATUS_CODE.NOT_FOUND)
        }

        if (room.inviteCode.maxMembers && room.members.length >= room.inviteCode.maxMembers) {
            throw new customError(ERROR_MESSAGE.ROOM_FULL, STATUS_CODE.NO_CONTENT)
        }

        const alreadyMember = room.members.find(f => f.userId.toString() === user_id.toString());

        if (alreadyMember) {
            throw new customError(ERROR_MESSAGE.ROOM_ALREADY_JOINED, STATUS_CODE.BAD_REQUEST)
        }

        const updatedRoom = await roomRepository.joinRoom(user_id, room.id);
        return updatedRoom
    },

    async getRoomMembers(user_id: string, room_id: string) {

        const room = await roomRepository.findRoomAndPopulateMember(user_id, room_id)

        if (!room) {
            throw new customError(ERROR_MESSAGE.ROOM_MEMBER_NOT_FOUND, STATUS_CODE.NOT_FOUND)
        }

        return room.members;
    }
}


