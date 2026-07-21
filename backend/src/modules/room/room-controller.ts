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


export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const creator_id = (req.user as any).id;

        const room_id = req.params.room_id as string

        await roomServices.deleteRoom(creator_id, room_id);
        (res as any).result = { data: null, message: SUCCESS_MESSAGE.ROOM_DELETED }
        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error)
    }
}


export const joinRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req.user as any).id;
        const room_code = req.params.code as string;

        const updatedRoom = await roomServices.joinRoom(user_id, room_code);
        (res as any).result = { data: updatedRoom, message: SUCCESS_MESSAGE.ROOM_JOIN }
        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error)
    }
}

export const getRoomMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req.user as any).id;
        const room_id = req.params.room_id as string;

        const roomMembers = await roomServices.getRoomMembers(user_id, room_id);
        (res as any).result = { data: roomMembers, message: SUCCESS_MESSAGE.ROOM_MEMBERS_FETCH };
        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error)
    }
}

export const getUserRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as any).id;
        const rooms = await roomServices.getUserRooms(userId);

        (res as any).result = { data: rooms, message: SUCCESS_MESSAGE.ROOM_FETCHED };
        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error);
    }
}

export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    try {
     
        const room_id = req.params.room_id as string;

        const room = await roomServices.getRoomById(room_id);
        (res as any).result = { data: room, message: SUCCESS_MESSAGE.ROOM_FETCHED };
        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error)
    }
}

