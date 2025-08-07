import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useOrder } from '../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { currentOrder, clearOrder, calculateTotal } = useOrder();
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_discounts');
        const data = await response.json();
        setDiscounts(data);
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };
    fetchDiscounts();
  }, []);

  const handleApplyDiscount = async (discountCode) => {
    try {
      const response = await fetch('http://localhost:5000/apply_discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discount_code: discountCode }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedDiscount(data.discount);
      }
    } catch (error) {
      console.error('Error applying discount:', error);
    }
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/complete_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.order) {
        clearOrder();
        navigate('/confirmation', { state: { order: data.order } });
      }
    } catch (error) {
      console.error('Error completing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = calculateTotal();
  const discountAmount = selectedDiscount ? 
    (selectedDiscount.discount_type === 'percentage' ? 
      subtotal * (selectedDiscount.discount_value / 100) : 
      selectedDiscount.discount_value) : 
    0;
  const total = subtotal - discountAmount;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 max-w-4xl mx-auto"
    >
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          {currentOrder.map((item, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {selectedDiscount && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discount ({selectedDiscount.name})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment and Discounts */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Available Discounts</label>
            <select
              onChange={(e) => handleApplyDiscount(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select a discount</option>
              {discounts.map(discount => (
                <option key={discount.id} value={discount.code}>
                  {discount.name} - {discount.description}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompleteOrder}
              disabled={isProcessing || currentOrder.length === 0}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
            >
              {isProcessing ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaCreditCard />
              )}
              Complete Order
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;