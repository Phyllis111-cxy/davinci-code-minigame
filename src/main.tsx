import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { startImagePreload } from './media/preload'
import './styles/global.css'

startImagePreload()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
