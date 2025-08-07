import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaShoppingCart, FaTrash, FaPaperPlane, FaFilePdf, FaMicrophone } from 'react-icons/fa'; // Import FaMicrophone
import { useReactToPrint } from 'react-to-print';
import { useOrder } from '../contexts/OrderContext';
import logo from '../assets/logo.png';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Import the plugin
import Navbar from '../components/Navbar';

// Custom plugin to handle bold text
const boldPlugin = () => {
  const bold = (text) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return (tree) => {
    tree.children.forEach((node) => {
      if (node.type === 'text') {
        node.value = bold(node.value);
      }
    });
  };
};

const OrderPage = () => {
  const { currentOrder, addToOrder, removeFromOrder, clearOrder } = useOrder();
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderReport, setOrderReport] = useState('');
  const [initialCartLoaded, setInitialCartLoaded] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState(null);
  const receiptRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true; // Set continuous to true
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        recognition.stop(); // Stop recognition after getting the result
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }, []);

  const handleVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  // Format chat responses with special handling for bulletins
  const formatChatResponse = (content) => {
    // Check if the response starts with "IMPORT COMPLIANCE BULLETIN"
    if (content.includes("IMPORT COMPLIANCE BULLETIN")) {
      const formattedContent = content.split("\n").map((line) => {
        // Format headers with bold text
        if (line.startsWith("**")) {
          const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
          return `<h3 class="text-lg font-bold text-blue-300 mt-4 mb-2">${boldText}</h3>`;
        }
        // Format bullet points
        if (line.trim().startsWith("*")) {
          // Handle any bold text within bullet points
          const bulletText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>').replace(/^\*/, '•');
          return `<li class="ml-4 mb-2 text-blue-100">${bulletText}</li>`;
        }
        // Format regular paragraphs with potential bold text
        if (line.trim()) {
          const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
          return `<p class="mb-2 text-blue-100">${formattedLine}</p>`;
        }
        return "";
      }).join("");

      return <div dangerouslySetInnerHTML={{ __html: formattedContent }} className="chat-bulletin bg-blue-900 p-4 rounded-lg" />;
    }
    
    // Add handling for PDF-like content
    if (content.includes("[PDF DOCUMENT]") || content.includes("PDF DOCUMENT") || content.includes("DOCUMENT PREVIEW")) {
      const formattedPdfContent = content.split('\n').map((line, i) => {
        // Handle document title/header
        if (line.includes("[PDF DOCUMENT]") || line.includes("PDF DOCUMENT") || line.includes("DOCUMENT PREVIEW")) {
          return `<h2 class="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">${line}</h2>`;
        }
        
        // Handle headers in PDF content
        if (line.trim().startsWith('##') || line.trim().startsWith("#")) {
          const headingLevel = line.trim().startsWith('##') ? 3 : 2;
          const prefix = line.trim().startsWith('##') ? 2 : 1;
          const headingText = line.trim().substring(prefix).trim();
          return `<h${headingLevel} class="text-${headingLevel === 2 ? 'xl' : 'lg'} font-bold mt-3 mb-2">${headingText}</h${headingLevel}>`;
        }
        
        // Process tables (simple detection)
        if (line.includes('|') && (line.trim().startsWith('|') || line.includes('-+-'))) {
          return `<div class="font-mono text-sm my-1">${line}</div>`;
        }
        
        // Process bold text and other formatting
        if (line.trim()) {
          const processedLine = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
          return `<p class="mb-2">${processedLine}</p>`;
        }
        
        return '<br/>';
      }).join("");
      
      return <div dangerouslySetInnerHTML={{ __html: formattedPdfContent }} className="pdf-document bg-white border border-gray-300 p-4 rounded-lg shadow-sm font-serif" />;
    }
    
    // For regular messages, properly handle bold text formatting and headings
    const formattedRegularContent = content.split('\n').map((line, i) => {
      // Process headings (lines starting with ##)
      if (line.trim().startsWith('##') || line.trim().startsWith("#") || line.trim().startsWith("###")) {
        const headingText = line.trim().substring(2).trim();
        return `<h2 class="text-xl font-bold mt-3 mb-2">${headingText}</h2>`;
      }
      
      // Process bold text in regular messages
      if (line.trim()) {
        const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return `<p class="mb-2">${processedLine}</p>`;
      }
      
      // Add empty line for paragraph breaks
      return '<br/>';
    }).join("");
    
    return <div dangerouslySetInnerHTML={{ __html: formattedRegularContent }} />;
  };
  
  // Calculate order total
  const orderTotal = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Handle printing/downloading receipt
  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: 'Order Receipt',
    onAfterPrint: () => console.log('Receipt printed/downloaded successfully')
  });

  // Scroll to bottom of chat when history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Only fetch cart once on initial load
  useEffect(() => {
    if (!initialCartLoaded) {
      const fetchCart = async () => {
        try {
          const response = await fetch('http://localhost:5000/get_cart');
          const data = await response.json();
          // Instead of using setOrderDirectly, we'll use addToOrder for each item
          if (data && data.length) {
            // Clear the current order first to ensure we don't duplicate items
            clearOrder();
            // Add each item to the order
            data.forEach(item => {
              addToOrder({
                name: item.name,
                price: item.price || 0
              }, item.quantity || 1);
            });
          }
          setInitialCartLoaded(true);
        } catch (error) {
          console.error('Error fetching cart:', error);
          setInitialCartLoaded(true); // Set to true even on error to prevent retries
        }
      };

      fetchCart();
    }
  }, [initialCartLoaded, addToOrder, clearOrder]);
  
  // Handle query submission
  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    const userMessage = { role: 'user', content: query };
    setChatHistory(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('http://localhost:5000/process_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.response };
      setChatHistory(prev => [...prev, assistantMessage]);
      
      // Handle commands
      if (data.commands && data.commands.length > 0) {
        let cartUpdated = false;
        data.commands.forEach(command => {
          switch (command.type) {
            case 'add':
              addToOrder(command.item, command.quantity);
              cartUpdated = true;
              break;
            case 'remove':
              removeFromOrder(command.item);
              cartUpdated = true;
              break;
            case 'clear':
              clearOrder();
              cartUpdated = true;
              break;
            default:
              break;
          }
        });

        // Instead of fetching the cart again, let the backend handle cart state
        // and trust our local state is correct after applying the commands
      }
    } catch (error) {
      console.error('Error processing query:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, an error occurred while processing your request. Please try again.' 
      }]);
    }
    
    setIsLoading(false);
    setQuery('');
  };

  const handleCompleteOrder = async () => {
    try {
      const response = await fetch('http://localhost:5000/complete_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: currentOrder }), // Send current order state
      });
      const data = await response.json();
      if (data.order) {
        setOrderReport(data.report);
        setOrderCompleted(true);
        // Save order details for receipt
        setCompletedOrderDetails({
          orderNumber: Math.floor(100000 + Math.random() * 900000), // Generate random order number
          items: [...currentOrder],
          subtotal: orderTotal,
          tax: orderTotal * 0.08,
          total: orderTotal * 1.08,
          date: new Date().toLocaleString(),
        });
        clearOrder();
      } else {
        console.error('Order completion failed:', data.error);
      }
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chat Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center">
                  <FaRobot className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Order Assistant</h2>
                </div>
              </div>
              
              <div 
                ref={chatContainerRef}
                className="px-6 py-4 h-[60vh] overflow-y-auto"
              >
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FaRobot className="text-4xl mb-2" />
                    <p className="text-center">
                      Welcome to the Order Assistant. How can I help you today?
                    </p>
                    <p className="text-center text-sm mt-2">
                      Ask about our products, pricing, or place an order.
                    </p>
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div 
                      key={index}
                      className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div 
                        className={`inline-block p-3 rounded-lg max-w-[80%] ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.role === 'assistant' 
                          ? formatChatResponse(message.content)
                          : message.content.split('\n\n').map((paragraph, i) => (
                              <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
                            ))
                        }
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex justify-center items-center my-4">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 px-6 py-4">
                <form onSubmit={handleQuerySubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type your question or order here..."
                    className="flex-1 appearance-none border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isListening ? 'bg-red-600' : 'bg-blue-600'} hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600`}
                  >
                    <FaMicrophone className="mr-2" />
                    {isListening ? 'Listening...' : 'Voice'}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50"
                  >
                    <FaPaperPlane className="mr-2" />
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center">
                  <FaShoppingCart className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                </div>
              </div>
              
              <div className="px-6 py-4">
                {currentOrder.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FaShoppingCart className="text-4xl mb-2" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 max-h-[40vh] overflow-y-auto">
                      {currentOrder.map((item) => (
                        <div 
                          key={item.name}
                          className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              <span className="inline-block mr-2 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                {item.quantity}x
                              </span>
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <p className="font-medium text-gray-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <button
                              onClick={() => removeFromOrder(item.name)}
                              className="text-red-600 hover:text-red-800"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-600">Subtotal:</p>
                        <p className="font-medium">${orderTotal.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-600">Tax (8%):</p>
                        <p className="font-medium">${(orderTotal * 0.08).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-200">
                        <p className="text-lg font-bold">Total:</p>
                        <p className="text-lg font-bold">${(orderTotal * 1.08).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={clearOrder}
                          className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Clear Order
                        </button>
                        <button
                          onClick={handleCompleteOrder}
                          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Complete Order
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Information Section */}
            <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Order Information</h2>
              </div>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Delivery Options</h3>
                  <p className="text-sm text-gray-600">Standard: 3-5 business days</p>
                  <p className="text-sm text-gray-600">Express: 1-2 business days</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Payment Methods</h3>
                  <p className="text-sm text-gray-600">Credit Card, Corporate Account, Purchase Order</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Need Assistance?</h3>
                  <p className="text-sm text-gray-600">Contact our support team at support@company.com or call (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">&copy; 2025 Company Name. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Support</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Order Completion Modal */}
      {orderCompleted && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Order Completed</h2>
            {/* Remove className from ReactMarkdown */}
            <div className="mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm, boldPlugin]}>{orderReport}</ReactMarkdown>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setOrderCompleted(false)}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
              <button
                onClick={handlePrintReceipt}
                className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <FaFilePdf className="mr-2" /> Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Template (hidden, used for PDF generation) */}
      <div className="hidden">
        <div ref={receiptRef} className="p-8 bg-white max-w-md mx-auto">
          {completedOrderDetails && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <img src={logo} alt="Logo" className="h-12 w-auto" />
                  <h2 className="text-xl font-bold mt-2">Order Receipt</h2>
                </div>
                <div className="text-right">
                  <p className="font-bold">Order #{completedOrderDetails.orderNumber}</p>
                  <p className="text-gray-600 text-sm">{completedOrderDetails.date}</p>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                <h3 className="font-bold mb-2">Order Summary</h3>
                {completedOrderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex justify-between py-1">
                  <span>Subtotal</span>
                  <span>${completedOrderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Tax (8%)</span>
                  <span>${completedOrderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-lg">
                  <span>Total</span>
                  <span>${completedOrderDetails.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 text-center text-gray-600 text-sm">
                <p>Thank you for your order!</p>
                <p>For customer support, contact support@company.com</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;