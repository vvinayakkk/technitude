import React, { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isFirstTimeCustomer, setIsFirstTimeCustomer] = useState(true);
  const [orderId, setOrderId] = useState(Math.random().toString(36).substring(2, 10));
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Get applicable discounts whenever the order changes
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_discounts');
        const data = await response.json();
        setAvailableDiscounts(data);
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };

    if (currentOrder.length > 0) {
      fetchDiscounts();
    }
  }, [currentOrder]);

  const addToOrder = async (itemName, quantity) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/add_to_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_name: itemName, quantity }),
      });

      const data = await response.json();
      if (data.success) {
        // Update local state
        const orderResponse = await fetch('http://localhost:5000/get_order');
        const orderData = await orderResponse.json();
        setCurrentOrder(orderData);
      }
    } catch (error) {
      console.error('Error adding item to order:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromOrder = async (itemName) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/remove_from_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_name: itemName }),
      });

      const data = await response.json();
      if (data.success) {
        // Update local state
        const orderResponse = await fetch('http://localhost:5000/get_order');
        const orderData = await orderResponse.json();
        setCurrentOrder(orderData);
      }
    } catch (error) {
      console.error('Error removing item from order:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearOrder = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:5000/clear_order', { method: 'POST' });
      setCurrentOrder([]);
      setAppliedDiscount(null);
      setOrderId(Math.random().toString(36).substring(2, 10));
    } catch (error) {
      console.error('Error clearing order:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/complete_order', { method: 'POST' });
      const data = await response.json();
      
      if (data.order) {
        setOrderHistory([...orderHistory, data.order]);
        setCurrentOrder([]);
        setAppliedDiscount(null);
        setIsFirstTimeCustomer(false);
        setOrderId(Math.random().toString(36).substring(2, 10));
        return data.order;
      }
      return null;
    } catch (error) {
      console.error('Error completing order:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyDiscount = async (discountCode) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/apply_discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discount_code: discountCode }),
      });

      const data = await response.json();
      if (data.success) {
        setAppliedDiscount(data.discount);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error applying discount:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const processQuery = async (query) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/process_query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      // Update chat history
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: query },
        { role: 'assistant', content: data.response }
      ]);

      // Process commands
      if (data.commands && data.commands.length > 0) {
        for (const command of data.commands) {
          switch (command.type) {
            case 'add':
              await addToOrder(command.item, command.quantity);
              break;
            case 'remove':
              await removeFromOrder(command.item);
              break;
            case 'clear':
              await clearOrder();
              break;
            case 'complete':
              await completeOrder();
              break;
            case 'discount':
              await applyDiscount(command.code);
              break;
            default:
              break;
          }
        }
      }

      // Refresh order data
      const orderResponse = await fetch('http://localhost:5000/get_order');
      const orderData = await orderResponse.json();
      setCurrentOrder(orderData);

      return data.response;
    } catch (error) {
      console.error('Error processing query:', error);
      return 'Sorry, there was an error processing your request.';
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return currentOrder.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscountedTotal = () => {
    const total = calculateTotal();
    if (!appliedDiscount) return total;

    let discountAmount = 0;
    if (appliedDiscount.discount_type === 'percentage') {
      discountAmount = total * (appliedDiscount.discount_value / 100);
    } else if (appliedDiscount.discount_type === 'amount') {
      discountAmount = appliedDiscount.discount_value;
    } else if (appliedDiscount.discount_type === 'special' && appliedDiscount.code === 'PIZZA50') {
      // Special handling for pizza discount
      const pizzaItems = currentOrder.filter(item => item.category === 'Pizza');
      if (pizzaItems.length >= 2) {
        // Sort by price to discount the cheaper one
        pizzaItems.sort((a, b) => a.price - b.price);
        discountAmount = pizzaItems[0].price * 0.5;
      }
    }
    return Math.max(total - discountAmount, 0);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orderHistory,
        appliedDiscount,
        isFirstTimeCustomer,
        orderId,
        availableDiscounts,
        loading,
        chatHistory,
        addToOrder,
        removeFromOrder,
        clearOrder,
        completeOrder,
        applyDiscount,
        processQuery,
        calculateTotal,
        calculateDiscountedTotal,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};