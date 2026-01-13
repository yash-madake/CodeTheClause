import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>  {/* Add Outer Provider */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)