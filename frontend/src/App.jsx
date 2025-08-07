import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import MyProfile from './pages/MyProfile'
import HealthAssistant from './pages/HealthAssistant'
import MyAppointments from './pages/MyAppointments'
import BookAppointment from './pages/BookAppointment'
import FindDoctor from './pages/FindDoctor'

function App() {
  const [count, setCount] = useState(0)
  

  return (
    <Routes>
                  <Route path="/" element={<LandingPage/>} />
                  <Route path="/login" element={<LoginPage/>} />
                   <Route path="/home" element={<HomePage/>} />
                  <Route path="/find-doctor" element={<FindDoctor/>} />
                  <Route path="/book-appointment" element={<BookAppointment/>} />
                  <Route path="/my-appointments" element={<MyAppointments/>} />
                  <Route path="/health-assistant" element={<HealthAssistant/>} />
                  <Route path="/my-profile" element={<MyProfile/>} />
                  {/* <Route path="/menu" element={<MenuPage />} />
                  <Route path="/order" element={<OrderPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/confirmation" element={<ConfirmationPage />} /> */}
                </Routes>
  );
  
}

export default App
