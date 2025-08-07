import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaFilter, FaSearch, FaStar, FaRobot } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import Navbar from '../components/Navbar';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  exit: { opacity: 0 },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

const MenuPage = () => {
  const { addToOrder, currentOrder, calculateTotal } = useOrder();
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const history = useNavigate();

  // Fetch menu data with image URLs
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const menuData = [
          { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 12.99, description: 'Classic pizza with tomato sauce, mozzarella, and basil', dietary_info: 'vegetarian', preparation_time: 15, popular: true, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 2, name: 'Veggie Supreme Pizza', category: 'Pizza', price: 14.99, description: 'Pizza topped with bell peppers, onions, mushrooms, olives, and tomatoes', dietary_info: 'vegetarian', preparation_time: 18, popular: true, imageUrl: 'https://images.unsplash.com/photo-1681567604770-0dc826c870ae?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.' },
          { id: 3, name: 'BBQ Chicken Pizza', category: 'Pizza', price: 15.99, description: 'Pizza with BBQ chicken, red onions, and cilantro', dietary_info: 'contains meat', preparation_time: 18, popular: true, imageUrl: 'https://plus.unsplash.com/premium_photo-1672498268734-0f41e888298d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 4, name: 'Caesar Salad', category: 'Salad', price: 8.99, description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing', dietary_info: 'vegetarian', preparation_time: 5, popular: true, imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74' },
          { id: 5, name: 'Greek Salad', category: 'Salad', price: 9.99, description: 'Mixed greens, feta, olives, cucumbers, and Greek dressing', dietary_info: 'vegetarian', preparation_time: 5, popular: false, imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a' },
          { id: 6, name: 'Garden Salad', category: 'Salad', price: 7.99, description: 'Fresh mixed greens with seasonal vegetables and dressing', dietary_info: 'vegetarian, vegan', preparation_time: 5, popular: false, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' },
          { id: 7, name: 'Spaghetti Bolognese', category: 'Pasta', price: 13.99, description: 'Spaghetti with rich meat sauce and parmesan', dietary_info: 'contains meat', preparation_time: 12, popular: true, imageUrl: 'https://images.unsplash.com/photo-1574636573716-062c8c8c6179?q=80&w=2270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 8, name: 'Vegetable Pasta', category: 'Pasta', price: 12.99, description: 'Pasta with mixed vegetables in marinara sauce', dietary_info: 'vegetarian', preparation_time: 12, popular: false, imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601' },
          { id: 9, name: 'Seafood Pasta', category: 'Pasta', price: 16.99, description: 'Pasta with shrimp, mussels, and calamari in garlic sauce', dietary_info: 'contains seafood', preparation_time: 15, popular: true, imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 10, name: 'Chocolate Cake', category: 'Dessert', price: 6.99, description: 'Rich chocolate cake with ganache frosting', dietary_info: 'vegetarian, contains gluten', preparation_time: 5, popular: true, imageUrl: 'https://images.unsplash.com/photo-1586985289906-406988974504?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 11, name: 'Tiramisu', category: 'Dessert', price: 7.99, description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', dietary_info: 'vegetarian, contains gluten', preparation_time: 5, popular: true, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9' },
          { id: 12, name: 'Cheesecake', category: 'Dessert', price: 7.99, description: 'Creamy New York style cheesecake', dietary_info: 'vegetarian, contains gluten', preparation_time: 5, popular: true, imageUrl: 'https://plus.unsplash.com/premium_photo-1667546202654-e7574a20872c?q=80&w=2346&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 13, name: 'Espresso', category: 'Beverage', price: 3.99, description: 'Strong Italian espresso shot', dietary_info: 'vegetarian, vegan', preparation_time: 2, popular: false, imageUrl: 'https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?q=80&w=2249&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 14, name: 'Cappuccino', category: 'Beverage', price: 4.99, description: 'Espresso with steamed milk and foam', dietary_info: 'vegetarian', preparation_time: 3, popular: true, imageUrl: 'https://images.unsplash.com/photo-1531441802565-2948024f1b22?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 15, name: 'Iced Coffee', category: 'Beverage', price: 4.99, description: 'Chilled coffee served over ice', dietary_info: 'vegetarian', preparation_time: 3, popular: false, imageUrl: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?q=80&w=2519&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 16, name: 'Garlic Bread', category: 'Appetizer', price: 5.99, description: 'Toasted bread with garlic butter and herbs', dietary_info: 'vegetarian, contains gluten', preparation_time: 8, popular: true, imageUrl: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 17, name: 'Bruschetta', category: 'Appetizer', price: 6.99, description: 'Toasted bread topped with diced tomatoes, basil, and olive oil', dietary_info: 'vegetarian, contains gluten', preparation_time: 10, popular: false, imageUrl: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 18, name: 'Mozzarella Sticks', category: 'Appetizer', price: 7.99, description: 'Fried mozzarella sticks with marinara sauce', dietary_info: 'vegetarian, contains gluten', preparation_time: 10, popular: true, imageUrl: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 19, name: 'Coca-Cola', category: 'Beverage', price: 2.99, description: 'Classic cola soft drink', dietary_info: 'vegetarian, vegan', preparation_time: 1, popular: true, imageUrl: 'https://images.unsplash.com/photo-1667204651371-5d4a65b8b5a9?q=80&w=2516&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 20, name: 'Sprite', category: 'Beverage', price: 2.99, description: 'Lemon-lime soft drink', dietary_info: 'vegetarian, vegan', preparation_time: 1, popular: true, imageUrl: 'https://images.unsplash.com/photo-1690988109041-458628590a9e?q=80&w=2352&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ];
        
        setMenu(menuData);
        setFilteredMenu(menuData);
        const uniqueCategories = ['All', ...new Set(menuData.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    let filtered = [...menu];

    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.dietary_info.toLowerCase().includes(query)
      );
    }

    setFilteredMenu(filtered);
  }, [activeCategory, searchQuery, menu]);

  const handleAddToOrder = async (item) => {
    addToOrder(item.name, 1);
    try {
      await fetch('http://localhost:5000/add_to_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name: item.name, quantity: 1 }),
      });
    } catch (error) {
      console.error('Error adding item to order:', error);
    }
  };

  const getItemCount = (itemName) => {
    const item = currentOrder.find(i => i.name === itemName);
    return item ? item.quantity : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <motion.h1 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold text-gray-900"
          >
            Our Menu
          </motion.h1>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative mt-4 sm:mt-0 flex items-center space-x-4"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => history('/order')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium flex items-center hover:bg-blue-700 transition-colors duration-200"
            >
              <FaRobot className="mr-2" />
              Order with our Bot
            </motion.button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex overflow-x-auto pb-4 hide-scrollbar space-x-2 mb-8"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium focus:outline-none flex-shrink-0 transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {currentOrder.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg text-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Current Order</h3>
                <p>{currentOrder.reduce((total, item) => total + item.quantity, 0)} items | ${calculateTotal().toFixed(2)}</p>
              </div>
              <Link 
                to="/checkout"
                className="px-4 py-2 bg-white text-purple-600 rounded-md font-medium flex items-center hover:bg-gray-100 transition-colors duration-200"
              >
                <FaShoppingCart className="mr-2" />
                Checkout
              </Link>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredMenu.map((menuItem) => (
                <motion.div
                  key={menuItem.id}
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                  <img 
                    src={menuItem.imageUrl} 
                    alt={menuItem.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {menuItem.name}
                        </h3>
                        <p className="text-sm text-purple-600 mb-3">
                          {menuItem.category}
                        </p>
                      </div>
                      {menuItem.popular && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <FaStar className="mr-1 text-yellow-500" />
                          Popular
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {menuItem.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {menuItem.dietary_info}
                      </span>
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                        {menuItem.preparation_time} min prep
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-semibold">${menuItem.price.toFixed(2)}</span>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToOrder(menuItem)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          getItemCount(menuItem.name) > 0
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        {getItemCount(menuItem.name) > 0 ? (
                          <>
                            {getItemCount(menuItem.name)} in cart
                          </>
                        ) : (
                          <>
                            Add to Order
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MenuPage;