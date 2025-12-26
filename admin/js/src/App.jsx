import React, { useEffect } from 'react';
import CanvasEditor from './components/Canvas/CanvasEditor';
import Toolbar from './components/Toolbar/Toolbar';
import PropertiesPanel from './components/Sidebar/PropertiesPanel';
import { useEditorStore } from './store/useEditorStore';
import { loadProfileData, saveProfileData } from './utils/api';
import './App.css';

function App() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:9',message:'App component mounting',data:{hasPlintusEditor:typeof window.plintusEditor!=='undefined',plintusEditorKeys:typeof window.plintusEditor!=='undefined'?Object.keys(window.plintusEditor):'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    const { selectedElements, loadProfile } = useEditorStore();
    const profileId = window.plintusEditor?.profileId;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:14',message:'Profile ID extracted',data:{profileId,hasLoadProfile:typeof loadProfile!=='undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    useEffect(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:18',message:'useEffect triggered',data:{profileId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        // Загружаем данные профиля при монтировании
        if (profileId) {
            loadProfileData(profileId).then((response) => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:23',message:'Profile data loaded',data:{hasResponse:!!response,hasData:!!(response&&response.data)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                // #endregion
                if (response && response.data) {
                    loadProfile(response.data);
                }
            });
        }
    }, [profileId, loadProfile]);

    // Простое автосохранение через таймер
    useEffect(() => {
        const interval = setInterval(() => {
            const { elements, grid, viewbox } = useEditorStore.getState();
            if (profileId && elements.length >= 0) {
                saveProfileData(profileId, { elements, grid, viewbox });
            }
        }, 5000); // Сохраняем каждые 5 секунд
        
        return () => clearInterval(interval);
    }, [profileId]);

    // #region agent log
    useEffect(() => {
        const contentEl = document.querySelector('.plintus-editor-content');
        const panelEl = document.querySelector('.plintus-properties-panel');
        if (contentEl) {
            const styles = window.getComputedStyle(contentEl);
            fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:50',message:'Layout debug',data:{selectedCount:selectedElements.length,contentDisplay:styles.display,contentPosition:styles.position,hasPanel:!!panelEl,panelDisplay:panelEl?window.getComputedStyle(panelEl).display:'none',panelPosition:panelEl?window.getComputedStyle(panelEl).position:'none'},timestamp:Date.now(),sessionId:'debug-session',runId:'fix1',hypothesisId:'A'})}).catch(()=>{});
        }
    }, [selectedElements]);
    // #endregion

    return (
        <div className="plintus-editor">
            <Toolbar />
            <div className="plintus-editor-content">
                <div className="plintus-editor-canvas-wrapper">
                    <CanvasEditor />
                </div>
                {selectedElements.length > 0 && (
                    <PropertiesPanel elements={selectedElements} />
                )}
            </div>
        </div>
    );
}

export default App;

