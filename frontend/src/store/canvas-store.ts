import { create } from "zustand";
import { apiClient } from "../config/axios";

interface ICanvasStore {
    activeTool: string;
    isLoading: boolean;
    elements: any[];
    setActiveTool: (tool: string) => void;
    addElement: (element: any) => void;
    updateElement: (id: string, changes: any) => void;
    deleteElement: (id: string) => void;
    loadElements: (roomId: string) => Promise<void>;
    clearElements: () => void;
}

export const useCanvasStore = create<ICanvasStore>((set) => ({
    activeTool: "Select",
    isLoading: false,
    setActiveTool: (tool) => set({ activeTool: tool }),
    elements: [],
    addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
    updateElement: (id, changes) =>
        set((state) => ({
            elements: state.elements.map((element) =>
                element.id === id ? { ...element, ...changes } : element
            ),
        })),
    deleteElement: (id) => set((state) => ({ elements: state.elements.filter((element) => element.id !== id) })),
    loadElements: async (roomId: string) => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get(`/api/rooms/${roomId}/elements`);
            set({ elements: response.data.data });
        } finally {
            set({ isLoading: false });
        }
    },

    clearElements: () => set({ elements: [] });

}))

