import { create } from "zustand";
import type { IRoom, IMember, ICreateRoomDTO, IJoinRoomResponse } from "../types/room-types";
import { roomServices } from "../services/room-services";

interface IRoomStore {
    isLoading: boolean;
    room: IRoom | null;
    rooms: IRoom[];
    members: IMember[];
    inviteLink: string | null;

    createRoom: (data: ICreateRoomDTO) => Promise<void>;
    deleteRoom: (roomId: string) => Promise<void>;
    getRooms: () => Promise<void>;
    getMembers: (roomId: string) => Promise<void>;
    getRoomById: (roomId: string) => Promise<void>;
    joinRoom: (code: string,role:string) => Promise<IJoinRoomResponse>;
}

export const useRoomStore = create<IRoomStore>((set) => ({
    isLoading: false,
    room: null,
    rooms: [],
    members: [],
    inviteLink: null,

    createRoom: async (data) => {
        set({ isLoading: true });
        try {
            const response = await roomServices.createRoom(data);
            set((state) => ({
                rooms: [...state.rooms, response.data.room],
                room: response.data.room,
                inviteLink: response.data.inviteLink
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
        } finally {
            set({ isLoading: false });
        }
    },

    getRoomById: async (roomId: string) => {
        set({ isLoading: true });
        try {
            const response = await roomServices.getRoomById(roomId);
            set({ room: response.data });
        } finally {
            set({ isLoading: false });
        }
    },

    joinRoom: async (code: string,role:string) => {
        set({ isLoading: true });
        try {
            const response = await roomServices.joinRoom(code,role);
            console.log("Response is ", response)
            const room = response.data;
            console.log("Room Data is ", room)
            set({ room });
            return room;
        } finally {
            set({ isLoading: false });
        }
    },
}));