import { Request, Response, NextFunction } from "express";
import { roomRepository } from "../modules/room/room-repositories";
import { customError } from "../utils/custom-error";
import { ERROR_MESSAGE } from "../constants/error-message";
import { STATUS_CODE } from '../constants/status-codes';
import { getRoomAndMember } from "../utils/getRoomAndMembers";


export const isMember = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user_id = (req.user as any).id;
        const room_id = req.params.room_id as string;

        const { room, member } = await getRoomAndMember(room_id, user_id);

        (req as any).member = member;
        (req as any).room = room;
        next()
    } catch (error) {
        next(error)
    }
}

export const isEditorOrAbove = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user_id = (req.user as any).id;
        const room_id = req.params.room_id as string;

        const { room, member } = await getRoomAndMember(room_id, user_id)


        if (member?.role !== "editor" && member?.role !== "owner") {
            throw new customError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.FORBIDDEN)
        }

        (req as any).member = member;
        (req as any).room = room;
        next()
    } catch (error) {
        next(error)
    }
}

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user_id = (req.user as any).id;
        const room_id = req.params.room_id as string;

        const { room, member } = await getRoomAndMember(room_id, user_id);


        if (member?.role !== "owner") {
            throw new customError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.FORBIDDEN)
        }

        (req as any).member = member;
        (req as any).room = room;
        next()
    } catch (error) {
        next(error)
    }
}