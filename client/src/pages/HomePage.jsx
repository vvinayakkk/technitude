import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUtensils, FaArrowRight } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={stagger}
        className="flex flex-col items-center justify-center min-h-[80vh] pt-20"
      >
        <motion.div 
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto mb-8 bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-full w-32 h-32 flex items-center justify-center"
          >
            <FaUtensils className="text-5xl text-white" />
          </motion.div>
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Gourmet Delight
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-600 max-w-2xl"
          >
            Experience the finest cuisine with our AI-powered ordering system. 
            Personalized recommendations, seamless ordering, and delicious food await you.
          </motion.p>
        </motion.div>
        
        <motion.div 
          variants={fadeInUp}
          className="grid md:grid-cols-2 gap-8 max-w-5xl"
        >
          <Link to="/menu">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300 border border-gray-100 hover:border-purple-300 hover:shadow-purple-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Browse Our Menu</h2>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaArrowRight className="text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600">
                Explore our wide range of dishes, from pizzas to pasta, salads to desserts.
              </p>
            </motion.div>
          </Link>
          
          <Link to="/order">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300 border border-gray-100 hover:border-purple-300 hover:shadow-purple-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Order with AI</h2>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaArrowRight className="text-purple-600" />
                </div>
              </div>
              <p className="text-gray-600">
                Let our AI assistant help you find the perfect meal based on your preferences.
              </p>
            </motion.div>
          </Link>
        </motion.div>
        
        <motion.div 
          variants={fadeInUp}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-semibold mb-6">Today's Special</h3>
          <motion.div 
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto"
          >
            <h4 className="text-xl font-bold mb-2">Friday's Special: Family Friday</h4>
            <p className="mb-4">Free dessert with orders over $40</p>
            <p className="text-sm opacity-80">Featured item: Chocolate Cake</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;