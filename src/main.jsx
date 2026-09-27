import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource-variable/ibm-plex-sans/wght.css'
import App from './App'
import './index.css'

// The intro is a first-load moment only. Drop its class once it has played, so a
// hero that re-mounts later (coming back from a GSoC entry) is simply there.
if (document.documentElement.classList.contains('intro')) {
  setTimeout(() => document.documentElement.classList.remove('intro'), 2000)
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
