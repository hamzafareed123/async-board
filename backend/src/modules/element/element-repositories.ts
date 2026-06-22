import Element from "../../models/element-model";
import Room from "../../models/room-model";
import { ICreateElementDTO } from "../../types/element-types";

export const elementRepository = {
    async createElement(data: ICreateElementDTO, user_id: string, room_id: string) {
        return await Element.create({
            ...data,
            roomId: room_id,
            createdBy: user_id
        })
    },

    async getElements(user_id:string,room_id:string){
        return await Element.find({roomId:room_id})
    }
}