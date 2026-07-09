import { create } from "zustand";
import type { IRoom, IMember, ICreateRoomDTO } from "../types/room-types";
import { roomServices } from "../services/room-services";

interface IRoomStore {
    isLoading: boolean;
    room: IRoom | null;
    rooms: IRoom[];
    members: IMember[];

    createRoom: (data: ICreateRoomDTO) => Promise<void>;
    deleteRoom: (roomId: string) => Promise<void>;
    getRooms: () => Promise<void>;
}

export const useRoomStore = create<IRoomStore>((set) => ({
    isLoading: false,
    room: null,
    rooms: [],
    members: [],


    createRoom: async (data) => {
        set({ isLoading: true });
        try {
            const response = await roomServices.createRoom(data);
            set((state) => ({
                rooms: [...state.rooms, response.data.room],
                room: response.data.room
            }));
        } finally {
            set({ isLoading: false });
        }
    },

    deleteRoom: async (roomId) => {
        set({ isLoading: true });
        try {
            await roomServices.deleteRoom(roomId);
            set((state) => ({
                rooms: state.rooms.filter(r => r._id !== roomId)
            }));
        } finally {
            set({ isLoading: false });
        }
    },

    getRooms: async () => {
        set({ isLoading: true });
        try {
            const response = await roomServices.getRooms();
            set({ rooms: response.data });
        } finally {
            set({ isLoading: false });
        }
    },
    getMembers: async (roomId: string) => {
        set({ isLoading: true });
        try {
            const response = await roomServices.getMembers(roomId);
            set({ members: response.data });
        }
        finally {
            set({ isLoading: false });
        }
    }
}));