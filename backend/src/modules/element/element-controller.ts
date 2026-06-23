import { Request, Response, NextFunction } from "express";
import { ICreateElementDTO, IUPDATEELEMENTDTO } from "../../types/element-types";
import { SUCCESS_MESSAGE } from "../../constants/success-message";
import { OutputHandler } from "../../middlewares/outputHandler-middleware";
import { STATUS_CODE } from "../../constants/status-codes";
import { elementService } from "./element-services";


export const createElement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const elementData = req.body as ICreateElementDTO;
        const user_id = (req.user as any).id;
        const room_id = (req as any).room._id;

        const element = await elementService.createElement(elementData, user_id, room_id);

        (res as any).result = { data: element, message: SUCCESS_MESSAGE.ELEMENT_CREATED };

        OutputHandler(STATUS_CODE.CREATED, req, res, next);
    } catch (error) {
        next(error);
    }
}


export const getElements = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const room_id = (req as any).room._id;

        const elements = await elementService.getElements(room_id);

        (res as any).result = { data: elements, message: SUCCESS_MESSAGE.ELEMENT_FETCH };

        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error);
    }
}

export const updateElement = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data = req.body as IUPDATEELEMENTDTO;
        const room_id = (req as any).room._id;
        const element_id = req.params.element_id as string

        const updateElement = await elementService.updateElement(data, room_id, element_id);
        (res as any).result = { data: updateElement, message: SUCCESS_MESSAGE.ELEMENT_UPDATE };
        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error)
    }
}


export const deleteElement = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const room_id = (req as any).room._id;
        const element_id = req.params.element_id as string

        

        const result = await elementService.deleteElement(room_id, element_id);
        (res as any).result = { data: result, message: SUCCESS_MESSAGE.ELEMENT_DELETED };
        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error)
    }
}