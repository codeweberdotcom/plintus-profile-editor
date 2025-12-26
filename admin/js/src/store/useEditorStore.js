import { create } from 'zustand';

export const useEditorStore = create((set, get) => ({
    // State
    elements: [],
    selectedElements: [], // Массив выбранных элементов для множественного выбора
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
    setSelectedTool: (tool) => set({ selectedTool: tool, selectedElements: [] }),
    addArcAtCorner: (line1Id, line2Id, arcElement) => set((state) => {
        // Заменяем две линии на новые линии с дугой между ними
        const line1 = state.elements.find(el => el.id === line1Id);
        const line2 = state.elements.find(el => el.id === line2Id);
        
        if (!line1 || !line2 || line1.type !== 'line' || line2.type !== 'line') {
            return state;
        }

        // Удаляем старые линии
        const newElements = state.elements.filter(el => el.id !== line1Id && el.id !== line2Id);
        
        // Добавляем новые элементы (модифицированные линии + дуга)
        return {
            elements: [...newElements, ...arcElement],
            selectedElements: [],
        };
    }),
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
        selectedElements: state.selectedElements.filter((el) => el.id !== id),
    })),
    deleteSelectedElements: () => set((state) => {
        const selectedIds = new Set(state.selectedElements.map(el => el.id));
        return {
            elements: state.elements.filter((el) => !selectedIds.has(el.id)),
            selectedElements: [],
        };
    }),
    selectElement: (element, isMultiSelect = false) => set((state) => {
        if (!element) {
            return { selectedElements: [] };
        }
        
        if (isMultiSelect) {
            // Множественный выбор: добавляем или удаляем элемент
            const exists = state.selectedElements.some(el => el.id === element.id);
            if (exists) {
                // Удаляем элемент из выбранных
                return { selectedElements: state.selectedElements.filter(el => el.id !== element.id) };
            } else {
                // Добавляем элемент к выбранным
                return { selectedElements: [...state.selectedElements, element] };
            }
        } else {
            // Одиночный выбор
            return { selectedElements: [element] };
        }
    }),
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

