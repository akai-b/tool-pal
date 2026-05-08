import React from 'react'
import { createRoot } from 'react-dom/client'
import { GifMakerTool } from '@pal/tool-gif-maker'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GifMakerTool />
  </React.StrictMode>
)
