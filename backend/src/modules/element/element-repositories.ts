import Element from "../../models/element-model";
import { ICreateElementDTO } from "../../types/element-types";

export const elementRepository = {
    async createElement(elementData: ICreateElementDTO, user_id: string, room_id: string) {
        return await Element.create({
            
        })
    }
}