import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/standard.css'
import '@fontsource/b612-mono/400.css'
import '@fontsource/b612-mono/700.css'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
