import { apiClient } from "../config/axios";

export const elementServices = {
    createElement: async (roomId: string, data: any) => {
        const response = await apiClient.post(
            `/api/elements/${roomId}/elements`, data
        );
        return response.data;
    },

    getElements: async (roomId: string) => {
        const response = await apiClient.get(
            `/api/elements/${roomId}/elements`
        );
        return response.data;
    },

    updateElement: async (roomId: string, elementId: string, data: any) => {
        const response = await apiClient.put(
            `/api/elements/${roomId}/elements/${elementId}`, data
        );
        return response.data;
    },

    deleteElement: async (roomId: string, elementId: string) => {
        const response = await apiClient.delete(
            `/api/elements/${roomId}/elements/${elementId}`
        );
        return response.data;
    }
};