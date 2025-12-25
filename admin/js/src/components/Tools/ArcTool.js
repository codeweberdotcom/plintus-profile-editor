/**
 * Инструмент для создания дуг (скруглений)
 */

export const ArcTool = {
    handleClick: (point, { addElement, currentArcStart, setCurrentArcStart, clearCurrentArcStart }) => {
        // Логика создания дуги
        // Для простоты создаем дугу с фиксированным радиусом
        // В будущем можно добавить интерактивное создание
        
        if (!currentArcStart) {
            setCurrentArcStart(point);
        } else {
            // Вычисляем радиус как расстояние между точками
            const dx = point.x - currentArcStart.x;
            const dy = point.y - currentArcStart.y;
            const radius = Math.sqrt(dx * dx + dy * dy);
            
            addElement({
                type: 'arc',
                center: currentArcStart,
                radius: radius,
                startAngle: 0,
                endAngle: 90, // По умолчанию 90 градусов
            });
            
            clearCurrentArcStart();
        }
    },
};

export default ArcTool;

