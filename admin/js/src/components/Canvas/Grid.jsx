import React from 'react';
import { Line } from 'react-konva';

function Grid({ stepPixels, width, height, color = '#e0e0e0', showMajorLines = false, majorLinesStep = 10 }) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Grid.jsx:5',message:'Grid rendering',data:{stepPixels,width,height,color,showMajorLines,majorLinesStep,hasLine:typeof Line!=='undefined',hasReactKonva:typeof window.Konva!=='undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    const lines = [];
    
    // Вычисляем шаг для основных линий в пикселях (10 мм = 10 шагов)
    const majorLinesStepPixels = stepPixels * majorLinesStep;
    const majorLinesColor = '#b0b0b0'; // Более темный цвет для основных линий
    const majorLinesWidth = 1.5; // Более толстые линии
    
    // Вертикальные линии
    for (let x = 0; x <= width; x += stepPixels) {
        // Определяем, является ли линия основной (кратна 10 мм)
        // Используем проверку с небольшой погрешностью для чисел с плавающей точкой
        const stepIndex = Math.round(x / stepPixels);
        const isMajorLine = showMajorLines && (stepIndex % majorLinesStep === 0);
        
        lines.push(
            <Line
                key={`v-${x}`}
                points={[x, 0, x, height]}
                stroke={isMajorLine ? majorLinesColor : color}
                strokeWidth={isMajorLine ? majorLinesWidth : 1}
                listening={false}
            />
        );
    }
    
    // Горизонтальные линии
    for (let y = 0; y <= height; y += stepPixels) {
        // Определяем, является ли линия основной (кратна 10 мм)
        // Используем проверку с небольшой погрешностью для чисел с плавающей точкой
        const stepIndex = Math.round(y / stepPixels);
        const isMajorLine = showMajorLines && (stepIndex % majorLinesStep === 0);
        
        lines.push(
            <Line
                key={`h-${y}`}
                points={[0, y, width, y]}
                stroke={isMajorLine ? majorLinesColor : color}
                strokeWidth={isMajorLine ? majorLinesWidth : 1}
                listening={false}
            />
        );
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Grid.jsx:35',message:'Grid lines created',data:{totalLines:lines.length,showMajorLines},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    return <>{lines}</>;
}

export default Grid;

