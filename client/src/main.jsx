import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { OrderProvider } from './contexts/OrderContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <OrderProvider >
    <StrictMode>
      <App />
    </StrictMode>
    </OrderProvider>
  </BrowserRouter>
)
