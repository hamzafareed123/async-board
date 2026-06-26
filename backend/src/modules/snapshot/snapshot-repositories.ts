import Snapshot from "../../models/snapshot-model";
import { ICREATESnapShotDTO, IUPDATESnapShotDTO } from "../../types/snapshot-types";

export const snapshotRepositories = {
    async createSnapshot(data: ICREATESnapShotDTO, userId: string, roomId: string) {
        return await Snapshot.create({
            roomId: roomId,
            createdBy: userId,
            ...data,
        })
    },

    async getSnapshot(userId: string, roomId: string) {
        return await Snapshot.find({ roomId: roomId, createdBy: userId })
    },

    async updateSnapshot(data: IUPDATESnapShotDTO, userId: string, roomId: string, snapshotId: string) {
        return await Snapshot.findOneAndUpdate(
            { _id: snapshotId, roomId: roomId, createdBy: userId },
            { $set: data },
            { returnDocument: "after" }
        )
    }
}
