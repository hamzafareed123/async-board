import { apiClient } from "../config/axios";

export const snapshotServices = {
    getSnapshots: async (roomId: string) => {
        const response = await apiClient.get(`/api/snapshot/${roomId}`);
        return response.data;
    },

    saveSnapshot: async (roomId: string, label: string) => {
        const response = await apiClient.post(`/api/snapshot/${roomId}`, { label });
        return response.data;
    },

    restoreSnapshot: async (roomId: string, snapshotId: string) => {
        const response = await apiClient.post(
            `/api/snapshot/${roomId}/${snapshotId}/restore`
        );
        return response.data;
    }
};
