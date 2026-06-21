import { Request, Response, NextFunction } from "express";
import { ICreateElementDTO } from "../../types/element-types";
import { SUCCESS_MESSAGE } from "../../constants/success-message";
import { OutputHandler } from "../../middlewares/outputHandler-middleware";
import { STATUS_CODE } from "../../constants/status-codes";
import { elementService } from "./element-services";


export const createElement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const elementData = req.body as ICreateElementDTO;
        const user_id = (req.user as any).id;
        const room_id = req.params.room_id as string;



        const element = await elementService.createElement(elementData, user_id, room_id);

        (res as any).result = { data: element, message: SUCCESS_MESSAGE.ELEMENT_CREATED };

        OutputHandler(STATUS_CODE.CREATED, req, res, next);
    } catch (error) {
        next(error);
    }
}