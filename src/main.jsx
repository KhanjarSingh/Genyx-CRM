import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LocationProvider } from './context/LocationContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext'
import { DateProvider } from './context/DateContext'
import { NotificationProvider } from './context/NotificationContext'
import { AppConfigProvider } from './context/AppConfigContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AppConfigProvider>
        <LocationProvider>
          <AuthProvider>
            <DateProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </DateProvider>
          </AuthProvider>
        </LocationProvider>
      </AppConfigProvider>
    </ThemeProvider>
  </StrictMode>,
)
