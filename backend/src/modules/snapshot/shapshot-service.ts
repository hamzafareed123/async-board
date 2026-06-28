import { ERROR_MESSAGE } from "../../constants/error-message";
import { STATUS_CODE } from "../../constants/status-codes";
import Element from "../../models/element-model";
import Snapshot from "../../models/snapshot-model";
import { ICREATESnapShotDTO } from "../../types/snapshot-types";
import { customError } from "../../utils/custom-error";
import { snapshotRepositories } from "./snapshot-repositories";

export const snapshotServices = {

    async createSnapshot(data: ICREATESnapShotDTO, user_id: string, room_id: string): Promise<any> {

        const result = await snapshotRepositories.createSnapshot(data, user_id, room_id);

        if (!result) {
            throw new customError(ERROR_MESSAGE.SNAPSHOT_NOT_FOUND, STATUS_CODE.NOT_FOUND)
        }

        return result;
    },

    async getSnapshot(roomId: string) {
        const result = await snapshotRepositories.getSnapshot(roomId);

        return result;
    },

    async restoreSnapshot(roomId: string, snapshotId: string) {
        const snapshot = await Snapshot.findOne({ _id: snapshotId, roomId })


        if (!snapshot) return null;

        await Element.deleteMany({ roomId });

        const elements = snapshot.elements.map(el => ({
            type: el.type,
            position: { x: el.position.x, y: el.position.y },
            size: { width: el.size.width, height: el.size.height },
            points: el.points,
            style: {
                color: el.style.color,
                fillColor: el.style.fillColor,
                strokeWidth: el.style.strokeWidth,
                opacity: el.style.opacity,
                fontSize: el.style.fontSize
            },
            text: el.text,
            roomId,
            createdBy: snapshot.createdBy,
            version: 0
        }));

        await Element.insertMany(elements);

        return snapshot;
    }
}
