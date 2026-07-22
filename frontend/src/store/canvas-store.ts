import { create } from "zustand";

interface ICanvasStore {
    activeTool: string;
    setActiveTool: (tool: string) => void;
    elements: any[];
    addElement: (element: any) => void;
    updateElement: (id: string, changes: any) => void;
    deleteElement: (id: string) => void;
}

export const useCanvasStore = create<ICanvasStore>((set) => ({
    activeTool: "Select",
    setActiveTool: (tool) => set({ activeTool: tool }),
    elements: [],
    addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
    updateElement: (id, changes) =>
        set((state) => ({
            elements: state.elements.map((element) =>
                element.id === id ? { ...element, ...changes } : element
            ),
        })),
    deleteElement: (id) => set((state) => ({ elements: state.elements.filter((element) => element.id !== id) }))
}))

