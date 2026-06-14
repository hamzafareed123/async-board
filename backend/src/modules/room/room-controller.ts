import { Request, Response, NextFunction } from "express";
import { ICreateRoomDTO } from "../../types/room-types";
import { roomServices } from "./room-services";
import { SUCCESS_MESSAGE } from '../../constants/success-message';
import { OutputHandler } from "../../middlewares/outputHandler-middleware";
import { STATUS_CODE } from "../../constants/status-codes";

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as any).id;
        const roomData: ICreateRoomDTO = req.body;

        const result = await roomServices.createRoom(userId, roomData);

        (res as any).result = { data: result, message: SUCCESS_MESSAGE.ROOM_CREATED }

        OutputHandler(STATUS_CODE.CREATED, req, res, next);

    } catch (error) {
        next(error)
    }
}