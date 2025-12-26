import React from 'react';
import LineProperties from './LineProperties';
import ArcProperties from './ArcProperties';
import { useEditorStore } from '../../store/useEditorStore';
import { distance, formatLengthMM } from '../../utils/geometry';
import './PropertiesPanel.css';

function PropertiesPanel({ elements }) {
    const { updateElement, deleteSelectedElements } = useEditorStore();

    // #region agent log
    React.useEffect(() => {
        const panelEl = document.querySelector('.plintus-properties-panel');
        if (panelEl) {
            const styles = window.getComputedStyle(panelEl);
            fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PropertiesPanel.jsx:7',message:'Panel mounted',data:{position:styles.position,right:styles.right,top:styles.top,bottom:styles.bottom,zIndex:styles.zIndex,width:styles.width,selectedCount:elements.length},timestamp:Date.now(),sessionId:'debug-session',runId:'fix1',hypothesisId:'A'})}).catch(()=>{});
        }
    }, [elements]);
    // #endregion

    const handleDelete = () => {
        deleteSelectedElements();
    };

    // Фильтруем только линии для вычисления общей длины
    const lineElements = elements.filter(el => el.type === 'line');
    const arcElements = elements.filter(el => el.type === 'arc');

    // Функция для вычисления длины элемента
    const getElementLength = (element) => {
        if (element.type === 'line') {
            if (element.start && element.end) {
                return distance(element.start, element.end);
            } else if (element.length) {
                return element.length;
            }
            return 0;
        }
        if (element.type === 'arc') {
            // Для дуги вычисляем длину дуги: L = r * angle (в радианах)
            const radius = element.radius || 0;
            const startAngle = element.startAngle || 0;
            const endAngle = element.endAngle || 90;
            const angleRad = ((endAngle - startAngle) * Math.PI) / 180;
            return radius * angleRad;
        }
        return 0;
    };

    return (
        <div className="plintus-properties-panel">
            <div className="panel-header">
                <h3>
                    {elements.length === 0 
                        ? 'Properties' 
                        : `Properties (${elements.length} selected)`}
                </h3>
                {elements.length > 0 && (
                    <button onClick={handleDelete} className="delete-button">
                        Delete
                    </button>
                )}
            </div>

            <div className="panel-content">
                {/* Список выбранных элементов */}
                {elements.length > 0 && (
                    <div className="properties-elements-list">
                        <h4>Selected Elements:</h4>
                        <ul className="properties-elements-list-items">
                            {elements.map((element, index) => {
                                const elementLength = getElementLength(element);
                                const lengthText = formatLengthMM(elementLength);
                                return (
                                    <li key={element.id} className="properties-element-item">
                                        <span className="element-type-badge">{element.type}</span>
                                        <span className="element-id">#{index + 1}</span>
                                        <span className="element-length">{lengthText}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Общая длина всех линий */}
                {lineElements.length > 0 && (
                    <LineProperties elements={lineElements} />
                )}

                {/* Свойства для дуг (если нужно) */}
                {arcElements.length > 0 && arcElements.length === 1 && (
                    <ArcProperties element={arcElements[0]} onUpdate={updateElement} />
                )}
            </div>
        </div>
    );
}

export default PropertiesPanel;

