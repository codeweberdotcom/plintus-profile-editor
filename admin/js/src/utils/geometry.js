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

/**
 * Проверка попадания точки на линию
 * @param {Object} point - Точка {x, y}
 * @param {Object} lineStart - Начало линии {x, y}
 * @param {Object} lineEnd - Конец линии {x, y}
 * @param {number} tolerance - Радиус попадания в пикселях (по умолчанию 10)
 * @returns {boolean} - true если точка попадает на линию
 */
export function isPointOnLine(point, lineStart, lineEnd, tolerance = 10) {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) return false;
    
    // Находим проекцию точки на линию
    const t = Math.max(0, Math.min(1, 
        ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (length * length)
    ));
    const projX = lineStart.x + t * dx;
    const projY = lineStart.y + t * dy;
    
    // Вычисляем расстояние от точки до проекции
    const dist = Math.sqrt(
        Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2)
    );
    
    return dist < tolerance;
}

/**
 * Находит точку пересечения двух линий
 * @param {Object} line1 - Первая линия {start: {x, y}, end: {x, y}}
 * @param {Object} line2 - Вторая линия {start: {x, y}, end: {x, y}}
 * @returns {Object|null} - Точка пересечения {x, y} или null если нет пересечения
 */
export function lineIntersection(line1, line2) {
    const x1 = line1.start.x;
    const y1 = line1.start.y;
    const x2 = line1.end.x;
    const y2 = line1.end.y;
    const x3 = line2.start.x;
    const y3 = line2.start.y;
    const x4 = line2.end.x;
    const y4 = line2.end.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    
    if (Math.abs(denom) < 1e-10) {
        // Линии параллельны или совпадают
        return null;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    // Проверяем, что точка пересечения находится на обоих отрезках
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1),
        };
    }

    return null;
}

/**
 * Вычисляет направление линии (единичный вектор)
 * @param {Object} line - Линия {start: {x, y}, end: {x, y}}
 * @returns {Object} - Направление {x, y}
 */
export function lineDirection(line) {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    if (len < 1e-10) {
        return { x: 0, y: 0 };
    }
    
    return { x: dx / len, y: dy / len };
}

/**
 * Проверяет, соединяются ли две линии в одной точке
 * @param {Object} line1 - Первая линия {start: {x, y}, end: {x, y}}
 * @param {Object} line2 - Вторая линия {start: {x, y}, end: {x, y}}
 * @param {number} tolerance - Допустимое расстояние для совпадения точек
 * @returns {Object|null} - Точка соединения {x, y, line1End: boolean, line2End: boolean} или null
 */
export function findConnectionPoint(line1, line2, tolerance = 1) {
    const points = [
        { point: line1.start, line1End: false, line2End: null },
        { point: line1.end, line1End: true, line2End: null },
        { point: line2.start, line1End: null, line2End: false },
        { point: line2.end, line1End: null, line2End: true },
    ];

    // Проверяем все комбинации точек
    for (let i = 0; i < 2; i++) {
        for (let j = 2; j < 4; j++) {
            const dist = distance(points[i].point, points[j].point);
            if (dist < tolerance) {
                return {
                    x: (points[i].point.x + points[j].point.x) / 2,
                    y: (points[i].point.y + points[j].point.y) / 2,
                    line1End: points[i].line1End,
                    line2End: points[j].line2End,
                };
            }
        }
    }

    return null;
}

