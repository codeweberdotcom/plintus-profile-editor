import React from 'react';
import { Line, Text, Group } from 'react-konva';
import { distance, formatLengthMM } from '../../utils/geometry';

function TempLinePreview({ start, end }) {
    if (!start || !end) {
        return null;
    }

    // Вычисляем длину линии в пикселях
    const lengthPixels = distance(start, end);
    // Конвертируем в миллиметры
    const lengthText = formatLengthMM(lengthPixels);
    
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

    const strokeColor = '#999999';
    const opacity = 0.6;

    return (
        <Group opacity={opacity}>
            {/* Основная линия (фантомная) */}
            <Line
                points={[start.x, start.y, end.x, end.y]}
                stroke={strokeColor}
                strokeWidth={2}
            />
            
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
                fill="#666666"
                fontStyle="normal"
            />
        </Group>
    );
}

export default TempLinePreview;

