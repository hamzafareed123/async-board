import { ENV } from "../../config/env";
import { ERROR_MESSAGE } from "../../constants/error-message";
import { STATUS_CODE } from "../../constants/status-codes";
import { ICreateRoomDTO } from '../../types/room-types';
import { customError } from "../../utils/custom-error";
import { authRepository } from "../auth/auth-repositories";
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


    }
}


