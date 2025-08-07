import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrderPage from './pages/OrderPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { OrderProvider } from './contexts/OrderContext';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  return (
        
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/order" element={<OrderPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/confirmation" element={<ConfirmationPage />} />
                </Routes>
  );
}

export default App;