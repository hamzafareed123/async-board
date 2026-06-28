import { Request, Response, NextFunction } from "express";
import { ICREATESnapShotDTO } from "../../types/snapshot-types";
import { SUCCESS_MESSAGE } from "../../constants/success-message";
import { STATUS_CODE } from "../../constants/status-codes";
import { OutputHandler } from "../../middlewares/outputHandler-middleware";
import { snapshotServices } from "./shapshot-service";

export const createSnapshot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as any).id;
        const roomId = (req as any).room._id;
        const data: ICREATESnapShotDTO = req.body;

        const result = await snapshotServices.createSnapshot(data, userId, roomId);

        (res as any).result = { data: result, message: SUCCESS_MESSAGE.SNAPSHOT_CREATED }

        OutputHandler(STATUS_CODE.CREATED, req, res, next);

    } catch (error) {
        next(error)
    }
}

export const getSnapshot = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId = (req.user as any).id;
        const roomId = (req as any).room._id;

        const result = await snapshotServices.getSnapshot(roomId);

        (res as any).result = { data: result, message: SUCCESS_MESSAGE.SNAPSHOT_FETCHED }

        OutputHandler(STATUS_CODE.OK, req, res, next);

    } catch (error) {
        next(error)
    }
}

export const restoreSnapshot = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const roomId = (req as any).room._id;
        const snapshotId = req.params.snapshot_id as string;


        const result = await snapshotServices.restoreSnapshot(roomId, snapshotId);

        (res as any).result = { data: result, message: SUCCESS_MESSAGE.SNAPSHOT_UPDATED }

        OutputHandler(STATUS_CODE.OK, req, res, next);

    } catch (error) {
        next(error)
    }
}


