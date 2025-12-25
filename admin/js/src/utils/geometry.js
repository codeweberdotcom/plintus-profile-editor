/**
 * Вычисление расстояния между двумя точками
 */
export function distance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Вычисление угла между двумя точками (в градусах)
 */
export function angle(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
}

/**
 * Округление угла до ближайшего кратного 90 градусов
 */
export function snapAngle(angle, snapTo = 90) {
    return Math.round(angle / snapTo) * snapTo;
}

/**
 * Получение точки на указанном расстоянии от начальной точки под углом
 */
export function pointAtDistance(start, angle, distance) {
    const radians = (angle * Math.PI) / 180;
    return {
        x: start.x + distance * Math.cos(radians),
        y: start.y + distance * Math.sin(radians),
    };
}

/**
 * Проверка, является ли линия горизонтальной или вертикальной (под углом 90 градусов)
 */
export function isOrthogonal(point1, point2, tolerance = 5) {
    const dx = Math.abs(point2.x - point1.x);
    const dy = Math.abs(point2.y - point1.y);
    
    // Если одна из координат почти не изменилась, это горизонтальная или вертикальная линия
    return dx < tolerance || dy < tolerance;
}

/**
 * Приведение точки к ближайшей ортогональной (90 градусов)
 */
export function snapToOrthogonal(start, end) {
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    
    if (dx > dy) {
        // Ближе к горизонтальной линии
        return { x: end.x, y: start.y };
    } else {
        // Ближе к вертикальной линии
        return { x: start.x, y: end.y };
    }
}

/**
 * Конвертация пикселей в миллиметры
 * Используется стандартное разрешение 96 DPI (точки на дюйм)
 * 1 дюйм = 25.4 мм, поэтому 1 пиксель = 25.4 / 96 = 0.264583 мм
 */
export function pixelsToMM(pixels, dpi = 96) {
    const mmPerInch = 25.4;
    return (pixels * mmPerInch) / dpi;
}

/**
 * Форматирование длины в миллиметрах с округлением до 1 знака после запятой
 */
export function formatLengthMM(pixels, dpi = 96) {
    const mm = pixelsToMM(pixels, dpi);
    return `${mm.toFixed(1)} мм`;
}

/**
 * Конвертация миллиметров в пиксели
 */
export function mmToPixels(mm, dpi = 96) {
    const mmPerInch = 25.4;
    return (mm * dpi) / mmPerInch;
}

/**
 * Округление значения до ближайшего кратного
 */
export function roundToMultiple(value, multiple) {
    return Math.round(value / multiple) * multiple;
}

