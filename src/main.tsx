import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* teste */}
    <div>
      <h1>Hello World</h1>
    </div>
  </StrictMode>,
)
