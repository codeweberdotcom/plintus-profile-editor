/**
 * Привязка точки к сетке (в пикселях)
 */
export function snapToGrid(point, gridStepPixels) {
    return {
        x: Math.round(point.x / gridStepPixels) * gridStepPixels,
        y: Math.round(point.y / gridStepPixels) * gridStepPixels,
    };
}

