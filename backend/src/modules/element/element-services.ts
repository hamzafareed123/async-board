import { ERROR_MESSAGE } from "../../constants/error-message";
import { STATUS_CODE } from "../../constants/status-codes";
import { ICreateElementDTO, IUPDATEELEMENTDTO } from "../../types/element-types";
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

    async getElements(room_id: string) {

        return await elementRepository.getElements(room_id)
    },

    async updateElement(data: IUPDATEELEMENTDTO, room_id: string, element_id: string) {
        const element = await elementRepository.updateElement(data, room_id, element_id)

        if (!element) {
            throw new customError(ERROR_MESSAGE.ELEMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        return element;
    },

    async deleteElement(room_id: string, element_id: string) {

        const element = await elementRepository.deleteElement(room_id, element_id)
        if (!element) {
            throw new customError(ERROR_MESSAGE.ELEMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        return element
    }
}