import React from 'react';
import LineProperties from './LineProperties';
import ArcProperties from './ArcProperties';
import { useEditorStore } from '../../store/useEditorStore';
import './PropertiesPanel.css';

function PropertiesPanel({ element }) {
    const { updateElement, deleteElement } = useEditorStore();

    // #region agent log
    React.useEffect(() => {
        const panelEl = document.querySelector('.plintus-properties-panel');
        if (panelEl) {
            const styles = window.getComputedStyle(panelEl);
            fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PropertiesPanel.jsx:7',message:'Panel mounted',data:{position:styles.position,right:styles.right,top:styles.top,bottom:styles.bottom,zIndex:styles.zIndex,width:styles.width},timestamp:Date.now(),sessionId:'debug-session',runId:'fix1',hypothesisId:'A'})}).catch(()=>{});
        }
    }, []);
    // #endregion

    const handleDelete = () => {
        deleteElement(element.id);
    };

    return (
        <div className="plintus-properties-panel">
            <div className="panel-header">
                <h3>Properties</h3>
                <button onClick={handleDelete} className="delete-button">
                    Delete
                </button>
            </div>

            <div className="panel-content">
                {element.type === 'line' && (
                    <LineProperties element={element} onUpdate={updateElement} />
                )}
                {element.type === 'arc' && (
                    <ArcProperties element={element} onUpdate={updateElement} />
                )}
            </div>
        </div>
    );
}

export default PropertiesPanel;

