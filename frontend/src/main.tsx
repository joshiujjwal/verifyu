import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { StytchProvider } from '@stytch/react'
import { stytch } from './lib/stytch.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StytchProvider stytch={stytch}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StytchProvider>
  </React.StrictMode>,
)