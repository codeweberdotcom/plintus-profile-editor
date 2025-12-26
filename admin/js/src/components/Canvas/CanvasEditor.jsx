import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';
import Grid from './Grid';
import { useEditorStore } from '../../store/useEditorStore';
import { snapToGrid } from './SnapToGrid';
import { snapToOrthogonal, distance, mmToPixels, isPointOnLine, findConnectionPoint, lineDirection, angle, pointAtDistance } from '../../utils/geometry';
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
        selectedElements,
        selectElement,
        addElement,
        isDrawing,
        setIsDrawing,
        currentLineStart,
        setCurrentLineStart,
        clearCurrentLineStart,
        deleteElement,
        deleteSelectedElements,
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
    
    // Функция для создания скругления между двумя линиями
    const createArcAtCorner = React.useCallback((line1, line2) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CanvasEditor.jsx:56',message:'createArcAtCorner called',data:{line1:{start:line1.start,end:line1.end,id:line1.id},line2:{start:line2.start,end:line2.end,id:line2.id}},timestamp:Date.now(),sessionId:'debug-session',runId:'arc-fix1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Находим точку соединения двух линий
        const connection = findConnectionPoint(line1, line2, 10);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CanvasEditor.jsx:62',message:'Connection point found',data:{connection,hasConnection:!!connection},timestamp:Date.now(),sessionId:'debug-session',runId:'arc-fix1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        if (!connection) {
            // Линии не соединяются, выходим
            return;
        }
        
        // Определяем радиус скругления (можно сделать настраиваемым, пока используем фиксированный)
        const arcRadius = mmToPixels(5); // 5 мм по умолчанию
        
        // Определяем, какие точки линий остаются (не соединенные с точкой соединения)
        const line1StartPoint = connection.line1End ? line1.start : line1.end;
        const line2StartPoint = connection.line2End ? line2.start : line2.end;
        
        // Определяем направления линий ОТ точки соединения (внутрь угла)
        const dir1 = lineDirection({ start: connection, end: line1StartPoint });
        const dir2 = lineDirection({ start: connection, end: line2StartPoint });
        
        // Вычисляем углы направлений (в градусах)
        const angle1 = Math.atan2(dir1.y, dir1.x) * (180 / Math.PI);
        const angle2 = Math.atan2(dir2.y, dir2.x) * (180 / Math.PI);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CanvasEditor.jsx:82',message:'Angles calculated',data:{angle1,angle2,dir1,dir2,connection,line1StartPoint,line2StartPoint},timestamp:Date.now(),sessionId:'debug-session',runId:'arc-fix1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Определяем точки начала и конца дуги на линиях (на расстоянии радиуса от точки соединения)
        const arcStartPoint = {
            x: connection.x + dir1.x * arcRadius,
            y: connection.y + dir1.y * arcRadius,
        };
        const arcEndPoint = {
            x: connection.x + dir2.x * arcRadius,
            y: connection.y + dir2.y * arcRadius,
        };
        
        // Вычисляем биссектрису угла
        const bisectorAngle = (angle1 + angle2) / 2;
        const bisectorRad = (bisectorAngle * Math.PI) / 180;
        const bisectorDir = { x: Math.cos(bisectorRad), y: Math.sin(bisectorRad) };
        
        // Вычисляем угол между линиями
        let angleDiff = Math.abs(angle2 - angle1);
        if (angleDiff > 180) {
            angleDiff = 360 - angleDiff;
        }
        const angleDiffRad = (angleDiff * Math.PI) / 180;
        
        // Расстояние от точки соединения до центра дуги по биссектрисе
        const centerDist = arcRadius / Math.sin(angleDiffRad / 2);
        const arcCenter = {
            x: connection.x + bisectorDir.x * centerDist,
            y: connection.y + bisectorDir.y * centerDist,
        };
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CanvasEditor.jsx:115',message:'Arc points calculated',data:{arcStartPoint,arcEndPoint,arcCenter,arcRadius,centerDist,angleDiff,angleDiffRad},timestamp:Date.now(),sessionId:'debug-session',runId:'arc-fix2',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        // Создаем новые элементы: две обрезанные линии + дуга
        const newLine1 = {
            type: 'line',
            start: line1StartPoint,
            end: arcStartPoint,
            length: distance(line1StartPoint, arcStartPoint),
        };
        
        const newLine2 = {
            type: 'line',
            start: arcEndPoint,
            end: line2StartPoint,
            length: distance(arcEndPoint, line2StartPoint),
        };
        
        // Вычисляем углы для дуги (от центра дуги к точкам начала и конца, в радианах)
        const arcStartAngleRad = Math.atan2(arcStartPoint.y - arcCenter.y, arcStartPoint.x - arcCenter.x);
        const arcEndAngleRad = Math.atan2(arcEndPoint.y - arcCenter.y, arcEndPoint.x - arcCenter.x);
        
        // Угол дуги должен быть равен углу между линиями (angleDiffRad)
        // Используем уже вычисленный angleDiffRad для угла дуги
        const arcAngleRad = angleDiffRad;
        
        // Конвертируем начальный угол в градусы (для rotation в Konva)
        let arcStartAngle = arcStartAngleRad * (180 / Math.PI);
        // Нормализуем в диапазон [-180, 180] для Konva rotation
        if (arcStartAngle > 180) arcStartAngle -= 360;
        if (arcStartAngle < -180) arcStartAngle += 360;
        
        // Угол дуги в градусах
        const arcAngle = arcAngleRad * (180 / Math.PI);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CanvasEditor.jsx:150',message:'Arc angles calculated',data:{arcStartAngle,arcAngle,arcStartAngleRad,arcEndAngleRad,arcAngleRad,angleDiffRad},timestamp:Date.now(),sessionId:'debug-session',runId:'arc-fix2',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        const newArc = {
            type: 'arc',
            center: arcCenter,
            radius: arcRadius,
            startAngle: arcStartAngle, // Начальный угол (для rotation в Konva)
            endAngle: arcStartAngle + arcAngle, // Конечный угол (для совместимости)
            angle: arcAngle, // Размер угла дуги (для отображения в Konva)
        };
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CanvasEditor.jsx:143',message:'New elements created',data:{newLine1,newLine2,newArc},timestamp:Date.now(),sessionId:'debug-session',runId:'arc-fix3',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        // Удаляем старые линии и добавляем новые элементы (обрезанные линии + дуга)
        deleteElement(line1.id);
        deleteElement(line2.id);
        addElement(newLine1);
        addElement(newLine2);
        addElement(newArc);
        
        // Сбрасываем выбор
        selectElement(null);
    }, [deleteElement, addElement, selectElement]);
    
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
        // Обработка инструмента дуги (выбор элементов для создания скругления)
        else if (selectedTool === 'arc') {
            // Проверяем, кликнули ли по элементу
            const clickedElement = elements.find(el => {
                if (el.type === 'line') {
                    return isPointOnLine(point, el.start, el.end, 10);
                }
                return false;
            });
            
            if (clickedElement) {
                // Проверяем, не превышен ли лимит выбора (максимум 2 элемента)
                const isAlreadySelected = selectedElements.some(el => el.id === clickedElement.id);
                
                if (isAlreadySelected) {
                    // Убираем элемент из выбранных
                    selectElement(clickedElement, true);
                } else if (selectedElements.length < 2) {
                    // Добавляем элемент к выбранным (максимум 2)
                    selectElement(clickedElement, true);
                }
            } else {
                // Если клик не по элементу, снимаем весь выбор
                selectElement(null);
            }
        }
        // Обработка инструмента выбора
        else if (selectedTool === 'select') {
            // Проверяем, кликнули ли по элементу
            const clickedElement = elements.find(el => {
                if (el.type === 'line') {
                    return isPointOnLine(point, el.start, el.end, 10);
                }
                if (el.type === 'arc') {
                    // Проверяем, находится ли точка рядом с дугой
                    const dist = distance(point, el.center);
                    return Math.abs(dist - el.radius) < 10; // tolerance 10px
                }
                return false;
            });
            
            if (clickedElement) {
                // Всегда используем toggle-логику (добавить/удалить из выбранных)
                selectElement(clickedElement, true);
            } else {
                // Если клик не по элементу, снимаем весь выбор
                selectElement(null);
            }
        }
        // Удаление элемента
        else if (selectedTool === 'delete') {
            // Проверяем, кликнули ли по элементу для удаления
            const clickedElement = elements.find(el => {
                if (el.type === 'line') {
                    return isPointOnLine(point, el.start, el.end, 10);
                }
                // Можно добавить проверку для других типов элементов
                return false;
            });
            
            if (clickedElement) {
                deleteElement(clickedElement.id);
            } else if (selectedElements.length > 0) {
                // Если клик не по элементу, но есть выбранные элементы, удаляем их
                deleteSelectedElements();
            }
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
        
        // Если режим выбора, удаления или arc активен, проверяем наведение на элементы
        if (selectedTool === 'select' || selectedTool === 'delete' || selectedTool === 'arc') {
            const hoveredElement = elements.find(el => {
                if (el.type === 'line') {
                    return isPointOnLine(point, el.start, el.end, 10);
                }
                if (el.type === 'arc') {
                    // Проверяем, находится ли точка рядом с дугой (в пределах радиуса + tolerance)
                    const dist = distance(point, el.center);
                    return Math.abs(dist - el.radius) < 10; // tolerance 10px
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

    // Обработка создания скругления, когда выбрано 2 элемента в режиме arc
    useEffect(() => {
        if (selectedTool === 'arc' && selectedElements.length === 2) {
            const [line1, line2] = selectedElements;
            if (line1 && line2 && line1.type === 'line' && line2.type === 'line') {
                createArcAtCorner(line1, line2);
            }
        }
    }, [selectedTool, selectedElements, createArcAtCorner]);

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
            // Delete/Backspace - удалить выбранные элементы
            else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElements.length > 0) {
                deleteSelectedElements();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElements, deleteSelectedElements, currentLineStart, clearCurrentLineStart, setIsDrawing]);


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
                            const isSelected = selectedElements.some(sel => sel.id === element.id);
                            
                            if (element.type === 'line') {
                                return (
                                    <LineElement
                                        key={element.id}
                                        element={element}
                                        isSelected={isSelected}
                                        isHovered={hoveredElementId === element.id && (selectedTool === 'select' || selectedTool === 'delete' || selectedTool === 'arc')}
                                        hoverColor={selectedTool === 'delete' ? '#dc3545' : '#0073aa'}
                                        onSelect={(e) => {
                                            if (selectedTool === 'delete') {
                                                deleteElement(element.id);
                                            } else if (selectedTool === 'select' || selectedTool === 'arc') {
                                                // Всегда используем toggle-логику (добавить/удалить из выбранных)
                                                // Для arc: максимум 2 элемента
                                                if (selectedTool === 'arc' && selectedElements.length >= 2 && !selectedElements.some(el => el.id === element.id)) {
                                                    // Не добавляем, если уже выбрано 2 элемента
                                                    return;
                                                }
                                                selectElement(element, true);
                                            }
                                        }}
                                        showDimensions={dimensionsVisible}
                                    />
                                );
                            }
                        if (element.type === 'arc') {
                            return (
                                <ArcElement
                                    key={element.id}
                                    element={element}
                                    isSelected={isSelected}
                                    isHovered={hoveredElementId === element.id && (selectedTool === 'select' || selectedTool === 'delete' || selectedTool === 'arc')}
                                    hoverColor={selectedTool === 'delete' ? '#dc3545' : '#0073aa'}
                                    onSelect={(e) => {
                                        if (selectedTool === 'delete') {
                                            deleteElement(element.id);
                                        } else if (selectedTool === 'select' || selectedTool === 'arc') {
                                            // Всегда используем toggle-логику (добавить/удалить из выбранных)
                                            // Для arc: максимум 2 элемента
                                            if (selectedTool === 'arc' && selectedElements.length >= 2 && !selectedElements.some(el => el.id === element.id)) {
                                                // Не добавляем, если уже выбрано 2 элемента
                                                return;
                                            }
                                            selectElement(element, true);
                                        }
                                    }}
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

