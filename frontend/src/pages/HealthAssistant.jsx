import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Zap, Loader, Clock, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HealthAssistant = () => {
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI Health Assistant. I can help you find doctors, book appointments, and answer health-related questions. How may I assist you today?', timestamp: new Date().toISOString() }
  ]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    'I need to see a cardiologist',
    'What doctors are available next week?',
    'I have a headache and fever',
    'How do I book an appointment?'
  ]);
  const [theme, setTheme] = useState('light');

  const chatContainerRef = React.useRef(null);

  useEffect(() => {
    // Initialize session and fetch existing chat history when component mounts
    const fetchChatHistory = async () => {
      try {
        await axios.get('/api/init');
        const response = await axios.get('/api/health_assistant');
        if (response.data.chat_history && response.data.chat_history.length > 0) {
          setChatHistory(response.data.chat_history.map(msg => ({
            ...msg,
            timestamp: new Date().toISOString()
          })));
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: query, timestamp: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Call backend API
    setIsLoading(true);
    setQuery('');
    
    try {
      const response = await axios.post('/api/health_assistant', { query });
      
      if (response.data.chat_history) {
        // Extract just the last assistant message
        const newMessages = response.data.chat_history;
        const latestAssistantMsg = newMessages[newMessages.length - 1];
        
        if (latestAssistantMsg && latestAssistantMsg.role === 'assistant') {
          setChatHistory(prev => [...prev, {
            ...latestAssistantMsg,
            timestamp: new Date().toISOString()
          }]);
        }
      }
    } catch (error) {
      console.error('Error getting response from assistant:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.', 
        timestamp: new Date().toISOString() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setQuery(question);
    // Focus the input after setting the query
    document.getElementById('query-input').focus();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <header className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-500 text-white">
              <MessageCircle size={24} />
            </div>
            <h1 className="text-2xl font-bold">Medical Assistant</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/home">
              <button className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Back
              </button>
            </Link>
            <Link to="/book_appointment">
              <button className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                <Calendar size={18} className="mr-1" />
                Book Appointment
              </button>
            </Link>
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <p className="text-sm mt-1 text-gray-500">
          I can help you find doctors, book appointments, and answer health questions.
        </p>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Chat container */}
        <div 
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto p-4 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          {chatHistory.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              <div className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="p-2 rounded-full bg-blue-500 text-white mr-2">
                    <Zap size={16} />
                  </div>
                )}
                <div 
                  className={`rounded-lg p-3 shadow-sm ${
                    msg.role === 'user' 
                      ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white' 
                      : theme === 'dark' ? 'bg-gray-700' : 'bg-white border'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div className={`text-xs mt-1 flex justify-between items-center ${
                    msg.role === 'user' ? 'text-blue-200' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.role === 'assistant' && (
                      <div className="flex space-x-2">
                        <button className="hover:text-blue-500"><ThumbsUp size={12} /></button>
                        <button className="hover:text-red-500"><ThumbsDown size={12} /></button>
                      </div>
                    )}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="p-2 rounded-full bg-gray-500 text-white ml-2">
                    <div className="w-4 h-4 flex items-center justify-center">U</div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-500 text-white mr-2">
                <Zap size={16} />
              </div>
              <div className={`rounded-lg p-3 shadow-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-white border'}`}>
                <div className="flex items-center space-x-2">
                  <Loader size={16} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested questions */}
        {suggestedQuestions.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className={`text-sm py-1 px-3 rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {/* Input form */}
        <form 
          onSubmit={handleSubmit} 
          className={`flex rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
        >
          <input
            id="query-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={`flex-1 p-4 rounded-l-lg focus:outline-none ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}
            placeholder="Ask about doctors, appointments, or medical conditions..."
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={`px-4 flex items-center justify-center rounded-r-lg transition-colors ${
              isLoading 
                ? theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </form>

        {/* Disclaimer */}
        <p className={`text-xs mt-2 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          This AI assistant helps with appointment booking and provides general health information. 
          Always consult healthcare professionals for medical advice.
        </p>
      </div>
    </div>
  );
};

export default HealthAssistant;