import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';
import Grid from './Grid';
import { useEditorStore } from '../../store/useEditorStore';
import { snapToGrid } from './SnapToGrid';
import { snapToOrthogonal, distance, mmToPixels, isPointOnLine } from '../../utils/geometry';
import LineElement from '../Elements/LineElement';
import ArcElement from '../Elements/ArcElement';
import TempLinePreview from './TempLinePreview';

function CanvasEditor() {
    const stageRef = useRef(null);
    const containerRef = useRef(null);
    const [tempEndPoint, setTempEndPoint] = useState(null);
    const [containerSize, setContainerSize] = useState({ width: 800, height: 400 });
    const {
        elements,
        selectedTool,
        grid,
        viewbox,
        selectedElement,
        selectElement,
        addElement,
        isDrawing,
        setIsDrawing,
        currentLineStart,
        setCurrentLineStart,
        clearCurrentLineStart,
        deleteElement,
        dimensionsVisible,
    } = useEditorStore();

    // Обновляем размер контейнера при изменении
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setContainerSize({ width: rect.width, height: rect.height });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Используем размер контейнера или viewbox
    const canvasWidth = containerSize.width || viewbox.width;
    const canvasHeight = containerSize.height || viewbox.height;

    // Конвертируем шаг сетки из миллиметров в пиксели
    const gridStepPixels = mmToPixels(grid.stepMM);
    
    // Обработка кликов на канвасе
    const handleStageClick = (e) => {
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        
        // Привязка к сетке всегда включена
        let snappedPoint = snapToGrid(point, gridStepPixels);

        // Обработка инструмента линии
        if (selectedTool === 'line') {
            if (!currentLineStart) {
                // Начало новой линии
                setCurrentLineStart(snappedPoint);
                setIsDrawing(true);
            } else {
                // Завершение линии (только под 90 градусов)
                const endPoint = snapToOrthogonal(currentLineStart, snappedPoint);
                const finalEndPoint = snapToGrid(endPoint, gridStepPixels);
                
                addElement({
                    type: 'line',
                    start: currentLineStart,
                    end: finalEndPoint,
                    length: distance(currentLineStart, finalEndPoint),
                });
                
                // Автоматически начинаем следующую линию от конечной точки
                // Это позволяет рисовать непрерывную цепочку линий
                setCurrentLineStart(finalEndPoint);
                setIsDrawing(true);
                setTempEndPoint(null);
            }
        }
        // Обработка инструмента дуги
        else if (selectedTool === 'arc') {
            // Для упрощения создаем дугу с центром в точке клика
            // Радиус можно будет изменить в свойствах
            addElement({
                type: 'arc',
                center: snappedPoint,
                radius: 20, // Радиус по умолчанию
                startAngle: 0,
                endAngle: 90,
            });
        }
        // Обработка инструмента выбора
        else if (selectedTool === 'select') {
            // Проверяем, кликнули ли по элементу
            const clickedElement = elements.find(el => {
                if (el.type === 'line') {
                    // Упрощенная проверка попадания (можно улучшить)
                    const dx = el.end.x - el.start.x;
                    const dy = el.end.y - el.start.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const t = Math.max(0, Math.min(1, 
                        ((point.x - el.start.x) * dx + (point.y - el.start.y) * dy) / (length * length)
                    ));
                    const projX = el.start.x + t * dx;
                    const projY = el.start.y + t * dy;
                    const dist = Math.sqrt(
                        Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2)
                    );
                    return dist < 10; // Точность попадания
                }
                return false;
            });

            if (clickedElement) {
                selectElement(clickedElement);
            } else {
                selectElement(null);
            }
        }
        // Удаление элемента
        else if (selectedTool === 'delete' && selectedElement) {
            deleteElement(selectedElement.id);
        }
    };

    // Состояние для позиции курсора
    const [cursorPosition, setCursorPosition] = useState(null);
    // Состояние для наведенного элемента (для подсветки)
    const [hoveredElementId, setHoveredElementId] = useState(null);

    // Обработка наведения мыши (для предпросмотра линии и курсора)
    const handleStageMouseMove = (e) => {
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        
        // Всегда обновляем позицию курсора с привязкой к сетке
        let snappedPoint = snapToGrid(point, gridStepPixels);
        setCursorPosition(snappedPoint);
        
        // Если режим выбора активен, проверяем наведение на элементы
        if (selectedTool === 'select') {
            const hoveredElement = elements.find(el => {
                if (el.type === 'line') {
                    return isPointOnLine(point, el.start, el.end, 10);
                }
                return false;
            });
            setHoveredElementId(hoveredElement ? hoveredElement.id : null);
        } else {
            setHoveredElementId(null);
        }
        
        if (selectedTool === 'line' && currentLineStart) {
            const endPoint = snapToOrthogonal(currentLineStart, snappedPoint);
            const finalEndPoint = snapToGrid(endPoint, gridStepPixels);
            setTempEndPoint(finalEndPoint);
        } else {
            setTempEndPoint(null);
        }
    };

    // Обработка ухода мыши с канваса
    const handleStageMouseLeave = () => {
        setCursorPosition(null);
        setTempEndPoint(null);
        setHoveredElementId(null);
    };

    // Обработка клавиши Delete и Escape (для отмены текущей линии)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Escape - отменить текущую линию
            if (e.key === 'Escape' && currentLineStart) {
                clearCurrentLineStart();
                setIsDrawing(false);
                setTempEndPoint(null);
                setCursorPosition(null);
            }
            // Delete/Backspace - удалить выбранный элемент
            else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
                deleteElement(selectedElement.id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElement, deleteElement, currentLineStart, clearCurrentLineStart, setIsDrawing]);


    return (
        <div ref={containerRef} className="canvas-editor">
            <Stage
                ref={stageRef}
                width={canvasWidth}
                height={canvasHeight}
                onClick={handleStageClick}
                onMouseMove={handleStageMouseMove}
                onMouseLeave={handleStageMouseLeave}
            >
                <Layer>
                    {/* #region agent log */}
                    {(() => {
                        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CanvasEditor.jsx:190',message:'Grid visibility check',data:{gridVisible:grid.visible,gridStepMM:grid.stepMM,gridStepPixels,viewboxWidth:viewbox.width,viewboxHeight:viewbox.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
                        return null;
                    })()}
                    {/* #endregion */}
                    {grid.visible && (
                        <Grid
                            stepPixels={gridStepPixels}
                            width={canvasWidth}
                            height={canvasHeight}
                            showMajorLines={grid.showMajorLines}
                            majorLinesStep={10}
                        />
                    )}

                        {/* Рендеринг элементов */}
                        {elements.map((element) => {
                            if (element.type === 'line') {
                                return (
                                    <LineElement
                                        key={element.id}
                                        element={element}
                                        isSelected={selectedElement?.id === element.id}
                                        isHovered={hoveredElementId === element.id && selectedTool === 'select'}
                                        onSelect={() => selectElement(element)}
                                        showDimensions={dimensionsVisible}
                                    />
                                );
                            }
                        if (element.type === 'arc') {
                            return (
                                <ArcElement
                                    key={element.id}
                                    element={element}
                                    isSelected={selectedElement?.id === element.id}
                                    onSelect={() => selectElement(element)}
                                />
                            );
                        }
                        return null;
                    }).filter(Boolean)}

                    {/* Временная линия для предпросмотра */}
                    {currentLineStart && tempEndPoint && dimensionsVisible && (
                        <TempLinePreview start={currentLineStart} end={tempEndPoint} />
                    )}

                    {/* Индикатор позиции курсора при рисовании линии */}
                    {selectedTool === 'line' && cursorPosition && (
                        <Circle
                            x={cursorPosition.x}
                            y={cursorPosition.y}
                            radius={4}
                            fill="#0073aa"
                            stroke="#fff"
                            strokeWidth={1}
                            opacity={0.8}
                            listening={false}
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
}

export default CanvasEditor;

