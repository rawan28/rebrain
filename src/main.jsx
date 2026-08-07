import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initRebrainSettings } from '@/lib/initRebrainSettings'

// Initialize settings synchronously before React initial render
initRebrainSettings()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)