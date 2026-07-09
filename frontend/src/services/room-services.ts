import { apiClient } from "../config/axios";
import type { ICreateRoomDTO } from "../types/room-types";

export const roomServices = {

    getRooms: async () => {
        const response = await apiClient.get("/api/room")
        return response.data;
    },
    createRoom: async (data: ICreateRoomDTO) => {
        const response = await apiClient.post("/api/room", data)
        return response.data;
    },

    deleteRoom: async (id: string) => {
        const response = await apiClient.delete(`/api/room/${id}`)
        return response.data;
    },

    joinRoom: async (code: string) => {
        const response = await apiClient.get(`/api/room/join/${code}`)
        return response.data;
    },

    getMembers: async (roomId: string) => {
        const response = await apiClient.get(`/api/room/${roomId}/members`)
        return response.data;
    }
}