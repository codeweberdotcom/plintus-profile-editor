import React from 'react';
import { Line, Text, Group } from 'react-konva';
import { formatLengthMM } from '../../utils/geometry';

function LineElement({ element, isSelected, isHovered = false, onSelect, showDimensions = true }) {
    const { start, end, length } = element;
    
    // Конвертируем длину в миллиметры
    const lengthText = formatLengthMM(length);
    
    // Параметры сноски
    const leaderLength = 15; // Длина косой линии (выноски)
    const horizontalLength = 40; // Длина горизонтальной линии
    
    // Сноска от середины линии
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    
    // Угол косой линии (45 градусов)
    const angle = 45;
    const angleRad = (angle * Math.PI) / 180;
    
    // Косая линия от середины основной линии
    const leaderStartX = midX;
    const leaderStartY = midY;
    const leaderEndX = midX + Math.cos(angleRad) * leaderLength;
    const leaderEndY = midY - Math.sin(angleRad) * leaderLength; // Минус для направления вверх
    
    // Горизонтальная линия
    const horizontalStartX = leaderEndX;
    const horizontalStartY = leaderEndY;
    const horizontalEndX = leaderEndX + horizontalLength;
    const horizontalEndY = leaderEndY;
    
    // Позиция текста на горизонтальной линии (немного выше)
    const textX = horizontalStartX + horizontalLength / 2;
    const textY = horizontalStartY - 12; // Поднят выше линии

    // Определяем цвет линии в зависимости от состояния
    let lineStroke = '#000';
    let lineStrokeWidth = 2;
    
    if (isSelected) {
        lineStroke = '#0073aa';
        lineStrokeWidth = 3;
    } else if (isHovered) {
        lineStroke = '#0073aa'; // Подсветка при наведении
        lineStrokeWidth = 2.5;
    }
    
    const strokeColor = isSelected ? '#0073aa' : (isHovered ? '#0073aa' : '#666');
    const textColor = isSelected ? '#0073aa' : (isHovered ? '#0073aa' : '#333');

    return (
        <Group onClick={onSelect} onTap={onSelect}>
            {/* Основная линия */}
            <Line
                points={[start.x, start.y, end.x, end.y]}
                stroke={lineStroke}
                strokeWidth={lineStrokeWidth}
            />
            
            {/* Размеры (сноска) - отображаются только если showDimensions === true */}
            {showDimensions && (
                <>
                    {/* Косая линия (выноска) */}
                    <Line
                        points={[leaderStartX, leaderStartY, leaderEndX, leaderEndY]}
                        stroke={strokeColor}
                        strokeWidth={1}
                    />
                    
                    {/* Горизонтальная линия */}
                    <Line
                        points={[horizontalStartX, horizontalStartY, horizontalEndX, horizontalEndY]}
                        stroke={strokeColor}
                        strokeWidth={1}
                    />
                    
                    {/* Текст размера */}
                    <Text
                        x={textX - 25}
                        y={textY}
                        text={lengthText}
                        fontSize={11}
                        fill={textColor}
                        fontStyle="normal"
                    />
                </>
            )}
        </Group>
    );
}

export default LineElement;

