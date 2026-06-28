import Element from "../../models/element-model";
import Snapshot from "../../models/snapshot-model";
import { ICREATESnapShotDTO } from "../../types/snapshot-types";

export const snapshotRepositories = {
    async createSnapshot(data: ICREATESnapShotDTO, userId: string, roomId: string) {

        const currentElements = await Element.find({ roomId })

        return await Snapshot.create({
            roomId: roomId,
            createdBy: userId,
            label: data.label,
            elements: currentElements,
        })
    },

    async getSnapshot(roomId: string) {
        return await Snapshot.find({ roomId: roomId }).sort({ createdAt: -1 })
    },
}
