import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'; // <--- IMPORT THIS

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>  {/* <--- WRAP APP WITH THIS */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)