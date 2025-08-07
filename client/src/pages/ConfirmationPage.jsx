import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();
  const order = location.state?.order || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-block mb-4"
          >
            <FaCheckCircle className="text-6xl text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your order. Here's your confirmation:</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order #{order.order_id}</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Order Time</p>
              <p>{order.timestamp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Ready Time</p>
              <p>{order.estimated_ready_time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Items</p>
              {order.items?.map((item, index) => (
                <p key={index}>{item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}</p>
              ))}
            </div>
            <div className="border-t pt-2">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.total?.toFixed(2)}</span>
              </p>
              {order.discount && (
                <p className="flex justify-between text-green-600">
                  <span>Discount ({order.discount.name}):</span>
                  <span>-${order.discount.amount.toFixed(2)}</span>
                </p>
              )}
              <p className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${(order.discounted_total || order.total)?.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
            >
              <FaHome />
              Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationPage;