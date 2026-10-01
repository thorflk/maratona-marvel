import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ProgressoProvider } from './state/ProgressoProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressoProvider>
      <App />
    </ProgressoProvider>
  </StrictMode>,
)
