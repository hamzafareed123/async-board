import { ERROR_MESSAGE } from "../../constants/error-message";
import { STATUS_CODE } from "../../constants/status-codes";
import { ICreateElementDTO } from "../../types/element-types";
import { customError } from "../../utils/custom-error";
import { elementRepository } from "./element-repositories";

export const elementService = {

    async createElement(elementData: ICreateElementDTO, user_id: string, room_id: string) {

        const element = await elementRepository.createElement(elementData, user_id, room_id);

        if (!element) {
            throw new customError(ERROR_MESSAGE.ELEMENT_NOT_CREATED, STATUS_CODE.BAD_REQUEST)
        }

        return element;

    },

    async getElements(user_id:string,room_id:string){

        const elements = await elementRepository.getElements(user_id,room_id)

        if(!elements){
            throw new customError(ERROR_MESSAGE.ELEMENT_NOT_FOUND,STATUS_CODE.NOT_FOUND)
        }

        return elements;
    }
}