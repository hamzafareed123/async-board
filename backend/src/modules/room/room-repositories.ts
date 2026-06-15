import Room from "../../models/room-model"
import { ICreateRoomDTO } from "../../types/room-types"

export const roomRepository = {

    async createRoom(userId: string, data: ICreateRoomDTO) {

        return await Room.create({
            name: data.name,
            description: data.description,
            isPublic: data.isPublic ?? false,
            createdBy: userId,
            members: [{ userId, role: "owner" }],
            inviteCode: {
                code: data.inviteCode,
                maxMembers: data.maxMembers ?? null,
                expiresAt: data.expiresAt ?? null,
            }
        });
    },

    async findRoomByIdAndCreator(creator_id: string, room_id: string) {
        return await Room.findOne({
            _id: room_id,
            createdBy: creator_id,
        })
    },

    async deleteRoom(room_id: string) {
        await Room.findByIdAndDelete(room_id)
    }
}

