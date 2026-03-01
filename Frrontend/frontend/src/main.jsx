import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BookingProvider } from './Context/ApartmenContextt.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BookingProvider>
   <App />
  </BookingProvider>
   

)
