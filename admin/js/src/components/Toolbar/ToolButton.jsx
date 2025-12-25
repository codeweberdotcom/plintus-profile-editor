import React from 'react';
import './ToolButton.css';

function ToolButton({ tool, isActive, onClick }) {
    const handleClick = (e) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ToolButton.jsx:6',message:'Button clicked',data:{toolId:tool.id,toolLabel:tool.label,isActive,defaultPrevented:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        e.preventDefault();
        e.stopPropagation();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ToolButton.jsx:10',message:'Calling onClick handler',data:{toolId:tool.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        if (onClick) {
            onClick();
        }
    };

    return (
        <button
            type="button"
            className={`plintus-tool-button ${isActive ? 'active' : ''}`}
            onClick={handleClick}
            title={tool.label}
        >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-label">{tool.label}</span>
        </button>
    );
}

export default ToolButton;

