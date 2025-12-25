import { create } from 'zustand';

export const useEditorStore = create((set, get) => ({
    // State
    elements: [],
    selectedElement: null,
    selectedTool: 'select', // 'line', 'arc', 'select', 'delete'
    grid: {
        stepMM: 1, // Шаг сетки всегда 1 мм
        snap: true,
        visible: true,
        showMajorLines: false, // Показывать темные линии через 10 мм
    },
    dimensionsVisible: true, // Видимость размеров (сносок)
    viewbox: {
        x: 0,
        y: 0,
        width: 800,
        height: 400,
    },
    isDrawing: false,
    currentLineStart: null,
    
    // Actions
    setSelectedTool: (tool) => set({ selectedTool: tool, selectedElement: null }),
    addElement: (element) => set((state) => ({
        elements: [...state.elements, { ...element, id: `element-${Date.now()}-${Math.random()}` }],
    })),
    updateElement: (id, updates) => set((state) => ({
        elements: state.elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
        ),
    })),
    deleteElement: (id) => set((state) => ({
        elements: state.elements.filter((el) => el.id !== id),
        selectedElement: state.selectedElement?.id === id ? null : state.selectedElement,
    })),
    selectElement: (element) => set({ selectedElement: element }),
    toggleGridVisible: () => set((state) => ({
        grid: { ...state.grid, visible: !state.grid.visible },
    })),
    toggleMajorLines: () => set((state) => ({
        grid: { ...state.grid, showMajorLines: !state.grid.showMajorLines },
    })),
    toggleDimensionsVisible: () => set((state) => ({
        dimensionsVisible: !state.dimensionsVisible,
    })),
    loadProfile: (data) => set({
        elements: data.elements || [],
        grid: data.grid || get().grid,
        viewbox: data.viewbox || get().viewbox,
    }),
    setIsDrawing: (isDrawing) => set({ isDrawing }),
    setCurrentLineStart: (point) => set({ currentLineStart: point }),
    clearCurrentLineStart: () => set({ currentLineStart: null }),
}));

