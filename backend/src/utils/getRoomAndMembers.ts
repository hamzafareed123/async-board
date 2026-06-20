import { ERROR_MESSAGE } from "../constants/error-message";
import { STATUS_CODE } from "../constants/status-codes";
import { roomRepository } from "../modules/room/room-repositories";
import { customError } from "./custom-error";


export const getRoomAndMember = async (room_id: string, user_id: string) => {

    const room = await roomRepository.findRoomById(room_id)

    if (!room) {
        throw new customError(ERROR_MESSAGE.ROOM_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const member = room.members.find(m => m.userId.toString() === user_id.toString())

    if (!member) {
        throw new customError(ERROR_MESSAGE.NOT_MEMBER, STATUS_CODE.UNAUTHORIZED);
    }

    return { room, member }
}