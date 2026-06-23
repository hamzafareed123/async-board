import Element from "../../models/element-model";
import { ICreateElementDTO, IUPDATEELEMENTDTO } from "../../types/element-types";

export const elementRepository = {
    async createElement(data: ICreateElementDTO, user_id: string, room_id: string) {
        return await Element.create({
            ...data,
            roomId: room_id,
            createdBy: user_id
        })
    },

    async getElements(room_id: string) {
        return await Element.find({ roomId: room_id })
    },

    async updateElement(data: IUPDATEELEMENTDTO, room_id: string, element_id: string) {

        return await Element.findOneAndUpdate({ _id: element_id, roomId: room_id }, {
            ...data,
            $inc: { version: 1 }
        }, { returnDocument: "after" })
    },

    async deleteElement(room_id: string, element_id: string) {
       return await Element.findOneAndDelete({
            _id: element_id,
            roomId: room_id
        })
    }
}