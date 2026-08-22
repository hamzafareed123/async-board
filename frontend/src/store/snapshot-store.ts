import { create } from "zustand";
import { snapshotServices } from "../services/snapshot-services";

export interface ISnapshot {
    _id: string;
    roomId: string;
    createdBy: string;
    label: string;
    elements: unknown[];
    createdAt: string;
    updatedAt: string;
}

interface ISnapshotStore {
    snapshots: ISnapshot[];
    isLoading: boolean;
    getSnapshots: (roomId: string) => Promise<void>;
    saveSnapshot: (roomId: string, label: string) => Promise<ISnapshot>;
    restoreSnapshot: (roomId: string, snapshotId: string) => Promise<ISnapshot>;
    clearSnapshots: () => void;
}

export const useSnapshotStore = create<ISnapshotStore>((set) => ({
    snapshots: [],
    isLoading: false,

    getSnapshots: async (roomId) => {
        set({ isLoading: true });
        try {
            const response = await snapshotServices.getSnapshots(roomId);
            set({ snapshots: response.data });
        } finally {
            set({ isLoading: false });
        }
    },

    saveSnapshot: async (roomId, label) => {
        set({ isLoading: true });
        try {
            const response = await snapshotServices.saveSnapshot(roomId, label);
            const snapshot = response.data as ISnapshot;
            set((state) => ({ snapshots: [snapshot, ...state.snapshots] }));
            return snapshot;
        } finally {
            set({ isLoading: false });
        }
    },

    restoreSnapshot: async (roomId, snapshotId) => {
        set({ isLoading: true });
        try {
            const response = await snapshotServices.restoreSnapshot(roomId, snapshotId);
            return response.data as ISnapshot;
        } finally {
            set({ isLoading: false });
        }
    },

    clearSnapshots: () => set({ snapshots: [] }),
}));
