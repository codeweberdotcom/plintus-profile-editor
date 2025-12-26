import React from 'react';
import { Path } from 'react-konva';

function ArcElement({ element, isSelected, isHovered = false, hoverColor = '#0073aa', onSelect }) {
    const { center, radius, startAngle = 0, endAngle, angle: arcAngle } = element;

    const handleSelect = (e) => {
        if (onSelect) {
            onSelect(e);
        }
    };

    // Определяем цвет в зависимости от состояния
    const strokeColor = isSelected ? '#0073aa' : (isHovered ? hoverColor : '#000');
    const strokeWidth = isSelected ? 3 : (isHovered ? 2.5 : 2);

    // Используем angle если он есть, иначе вычисляем из startAngle и endAngle
    const angleToRender = arcAngle !== undefined ? arcAngle : (endAngle !== undefined ? endAngle - startAngle : 90);
    
    // Конвертируем углы в радианы
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = startAngleRad + (angleToRender * Math.PI) / 180;
    
    // Вычисляем точки начала и конца дуги
    const startX = center.x + radius * Math.cos(startAngleRad);
    const startY = center.y + radius * Math.sin(startAngleRad);
    const endX = center.x + radius * Math.cos(endAngleRad);
    const endY = center.y + radius * Math.sin(endAngleRad);
    
    // Определяем направление дуги (большая или малая дуга)
    const largeArcFlag = angleToRender > 180 ? 1 : 0;
    
    // Создаем SVG path команду для дуги
    // M - move to, A - arc to (radiusX, radiusY, rotation, largeArcFlag, sweepFlag, endX, endY)
    const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

    return (
        <Path
            data={pathData}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill=""
            onClick={handleSelect}
            onTap={handleSelect}
        />
    );
}

export default ArcElement;
