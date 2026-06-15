import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Catch errors before React mounts
window.addEventListener('error', (e) => {
  const root = document.getElementById('root')
  if (root && root.children.length === 0) {
    root.innerHTML = `<div style="padding:24px;color:#00EF9E;font-family:monospace;background:#000;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
      <div style="font-size:15px;font-weight:700">Erro ao carregar</div>
      <div style="font-size:12px;max-width:500px;text-align:center;background:#0d0d10;padding:12px;border-radius:8px;border:1px solid #8928FF">${e.message} (${e.filename}:${e.lineno})</div>
      <button onclick="window.location.reload()" style="background:#00EF9E;color:#000;border:none;border-radius:8px;padding:10px 24px;font-family:monospace;font-size:13px;font-weight:700;cursor:pointer">Recarregar</button>
    </div>`
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
