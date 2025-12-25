import React from 'react';
import ToolButton from './ToolButton';
import { useEditorStore } from '../../store/useEditorStore';
import './Toolbar.css';

function Toolbar() {
    const { selectedTool, setSelectedTool, grid, toggleGridVisible, toggleMajorLines, dimensionsVisible, toggleDimensionsVisible } = useEditorStore();

    const tools = [
        { id: 'select', label: 'Select', icon: 'uil-hand-pointer' },
        { id: 'line', label: 'Line', icon: 'uil-minus' },
        { id: 'arc', label: 'Arc', icon: 'uil-circle' },
        { id: 'delete', label: 'Delete', icon: 'uil-trash-alt' },
    ];

    return (
        <div className="plintus-toolbar">
            <div className="plintus-toolbar-section">
                {tools.map((tool) => (
                    <ToolButton
                        key={tool.id}
                        tool={tool}
                        isActive={selectedTool === tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                    />
                ))}
            </div>

            <div className="plintus-toolbar-section plintus-toolbar-section-right">
                <button
                    type="button"
                    onClick={(e) => {
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Toolbar.jsx:54',message:'Grid visible button clicked',data:{currentVisible:grid.visible},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                        // #endregion
                        e.preventDefault();
                        e.stopPropagation();
                        toggleGridVisible();
                    }}
                    className={grid.visible ? 'active' : ''}
                    title="Show/Hide Grid"
                >
                    <i className="uil uil-grid"></i>
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMajorLines();
                    }}
                    className={grid.showMajorLines ? 'active' : ''}
                    title="Show/Hide Major Grid Lines (10mm)"
                >
                    <i className="uil uil-grids"></i>
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDimensionsVisible();
                    }}
                    className={dimensionsVisible ? 'active' : ''}
                    title="Show/Hide Dimensions"
                >
                    <i className="uil uil-ruler"></i>
                </button>
            </div>
        </div>
    );
}

export default Toolbar;

