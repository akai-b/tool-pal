import React from 'react'
import { createRoot } from 'react-dom/client'
import { FontCompressTool } from '@pal/tool-font-compress'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FontCompressTool />
  </React.StrictMode>
)
