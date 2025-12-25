import React from 'react';
import { Arc, Text, Circle } from 'react-konva';

function ArcElement({ element, isSelected, onSelect }) {
    const { center, radius, startAngle = 0, endAngle = 90 } = element;

    return (
        <>
            <Arc
                x={center.x}
                y={center.y}
                innerRadius={0}
                outerRadius={radius}
                angle={endAngle - startAngle}
                rotation={startAngle}
                stroke={isSelected ? '#0073aa' : '#000'}
                strokeWidth={isSelected ? 3 : 2}
                fill=""
                onClick={onSelect}
                onTap={onSelect}
            />
            {/* Центр дуги */}
            <Circle
                x={center.x}
                y={center.y}
                radius={3}
                fill={isSelected ? '#0073aa' : '#000'}
                onClick={onSelect}
                onTap={onSelect}
            />
            {/* Отображение радиуса */}
            <Text
                x={center.x - 25}
                y={center.y - radius - 20}
                text={`R: ${Math.round(radius)}px`}
                fontSize={12}
                fill={isSelected ? '#0073aa' : '#666'}
                onClick={onSelect}
                onTap={onSelect}
            />
        </>
    );
}

export default ArcElement;
