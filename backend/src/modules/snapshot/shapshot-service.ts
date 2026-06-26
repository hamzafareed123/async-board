import { ERROR_MESSAGE } from "../../constants/error-message";
import { STATUS_CODE } from "../../constants/status-codes";
import { ICREATESnapShotDTO, IUPDATESnapShotDTO } from "../../types/snapshot-types";
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

    async getSnapshot(userId: string, roomId: string) {
        const result = await snapshotRepositories.getSnapshot(userId, roomId);

        if (!result) {
            throw new customError(ERROR_MESSAGE.SNAPSHOT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        return result;
    },

    async updateSnapshot(data: IUPDATESnapShotDTO, userId: string, roomId: string, snapshotId: string) {
        const result = await snapshotRepositories.updateSnapshot(data, userId, roomId, snapshotId);

        if (!result) {
            throw new customError(ERROR_MESSAGE.SNAPSHOT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        return result;
    }
}
