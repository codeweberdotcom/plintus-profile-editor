import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


// #region agent log
fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.js:10',message:'Initializing React app',data:{hasWindow:typeof window!=='undefined',hasReact:typeof React!=='undefined',hasReactDOM:typeof ReactDOM!=='undefined',hasKonva:typeof window!=='undefined'&&typeof window.Konva!=='undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
// #endregion

const container = document.getElementById('plintus-profile-editor-root');
// #region agent log
fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.js:8',message:'Container check',data:{containerFound:!!container,containerId:container?.id,plintusEditor:typeof window.plintusEditor!=='undefined'?Object.keys(window.plintusEditor||{}):'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
// #endregion

if (container) {
    try {
        const root = ReactDOM.createRoot(container);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.js:13',message:'Rendering App component',data:{rootCreated:!!root},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        root.render(<App />);
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.js:18',message:'Error rendering React app',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.error('Error rendering React app:', error);
    }
} else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.js:23',message:'Container not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
}

