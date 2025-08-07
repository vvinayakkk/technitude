import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('restaurant');
  const [isAnimating, setIsAnimating] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  // Sample data for demonstration
  const restaurantResponses = {
    "vegetarian": "We offer several vegetarian options including our Garden Delight Burger, Mediterranean Platter, and Vegetable Stir Fry. Would you like to know more about any of these dishes?",
    "time": "Your order will be ready for pickup in approximately 15-20 minutes. I'll send you a notification when it's ready!",
    "recommend": "Based on your past orders, I'd recommend our Signature Burger Combo with sweet potato fries and a refreshing lemonade. Does that sound good to you?"
  };

  const clinicResponses = {
    "available": "Dr. Smith and Dr. Johnson are available this Friday. Dr. Williams has openings next Monday and Wednesday. Would you like to book with any of them?",
    "appointment": "I can book you with Dr. Garcia at 2:30 PM this Thursday. She specializes in general medicine. Would you like to confirm this appointment?",
    "fee": "The consultation fee for a general check-up is $95. With your insurance plan, your estimated out-of-pocket cost would be $25."
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsTyping(true);
    setResponse('');
    
    // Simulate AI processing
    setTimeout(() => {
      let aiResponse = '';
      
      if (activeTab === 'restaurant') {
        if (query.toLowerCase().includes('vegetarian') || query.toLowerCase().includes('vegan')) {
          aiResponse = restaurantResponses.vegetarian;
        } else if (query.toLowerCase().includes('time') || query.toLowerCase().includes('ready')) {
          aiResponse = restaurantResponses.time;
        } else if (query.toLowerCase().includes('recommend') || query.toLowerCase().includes('suggestion')) {
          aiResponse = restaurantResponses.recommend;
        } else {
          aiResponse = "I'd be happy to help with your order! What would you like to try today?";
        }
      } else {
        if (query.toLowerCase().includes('available') || query.toLowerCase().includes('which doctor')) {
          aiResponse = clinicResponses.available;
        } else if (query.toLowerCase().includes('appointment') || query.toLowerCase().includes('book')) {
          aiResponse = clinicResponses.appointment;
        } else if (query.toLowerCase().includes('fee') || query.toLowerCase().includes('cost')) {
          aiResponse = clinicResponses.fee;
        } else {
          aiResponse = "I can help you schedule an appointment with one of our specialists. What type of care are you looking for?";
        }
      }

      // Simulate typing effect
      let i = 0;
      const typing = setInterval(() => {
        setResponse(aiResponse.substring(0, i));
        i++;
        if (i > aiResponse.length) {
          clearInterval(typing);
          setIsTyping(false);
        }
      }, 20);
    }, 1000);
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
      setResponse('');
      setQuery('');
    }, 300);
  };

  useEffect(() => {
    // Animated background effect
    const interval = setInterval(() => {
      const root = document.documentElement;
      const hue = Math.floor(Math.random() * 40) + 200; // Blue-purple range
      root.style.setProperty('--accent-hue', hue);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full opacity-10 animate-pulse"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: `hsl(var(--accent-hue, 220), 70%, 50%)`,
                animationDuration: `${Math.random() * 8 + 4}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 inline-block">
              <span className="text-sm font-bold tracking-wider bg-blue-600 text-white px-3 py-1 rounded-full">
                TECHNITUDE 2025 HACKATHON
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Intelligent <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Conversational AI</span> for Multiple Domains
            </h1>
            <p className="text-xl text-slate-300 mb-10">
              One versatile platform that seamlessly powers both restaurant ordering and medical appointment booking through natural conversation.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/30 transition duration-300"
              >
                Try Live Demo
              </button>
              <button onClick={() => navigate('/login')} className="px-8 py-3 bg-slate-700 rounded-lg font-semibold shadow-lg hover:bg-slate-600 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">One AI, Multiple Applications</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Our cutting-edge GenAI solution adapts seamlessly to different business contexts while maintaining a consistent, intuitive user experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm border border-slate-700 hover:border-blue-500/30 transition duration-300">
            <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Highly Portable</h3>
            <p className="text-slate-400">
              Effortlessly adapts across different domains without requiring extensive reconfiguration or training.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm border border-slate-700 hover:border-blue-500/30 transition duration-300">
            <div className="w-14 h-14 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Contextual Understanding</h3>
            <p className="text-slate-400">
              Understands user intent and remembers conversation context for more natural, human-like interactions.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm border border-slate-700 hover:border-blue-500/30 transition duration-300">
            <div className="w-14 h-14 rounded-lg bg-purple-500/20 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Highly Versatile</h3>
            <p className="text-slate-400">
              Extends beyond specified use cases to accommodate future business needs across multiple domains.
            </p>
          </div>
        </div>
      </div>
      
      {/* Interactive Demo Section */}
      {showDemo && (
        <div className="container mx-auto px-6 py-16 mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-700">
              {/* Tabs */}
              <div className="flex border-b border-slate-700">
                <button 
                  className={`flex-1 py-4 text-center font-medium ${activeTab === 'restaurant' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => switchTab('restaurant')}
                >
                  Restaurant Ordering
                </button>
                <button 
                  className={`flex-1 py-4 text-center font-medium ${activeTab === 'clinic' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => switchTab('clinic')}
                >
                  Clinic Appointment
                </button>
              </div>
              
              {/* Content */}
              <div className={`p-6 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">
                    {activeTab === 'restaurant' ? 
                      'Restaurant Drive-Thru AI Assistant' : 
                      'Medical Clinic Booking Assistant'}
                  </h3>
                  <p className="text-slate-400">
                    {activeTab === 'restaurant' ? 
                      'Ask about menu items, dietary restrictions, or recommendations.' : 
                      'Ask about doctor availability, appointment booking, or consultation fees.'}
                  </p>
                </div>
                
                {/* Chat Interface */}
                <div className="bg-slate-900 rounded-lg mb-6 p-4 h-64 overflow-y-auto">
                  {response && (
                    <div className="flex items-start mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 max-w-md">
                        <p className="text-slate-200">{response}</p>
                        {isTyping && <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1"></span>}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Input */}
                <form onSubmit={handleQuerySubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={activeTab === 'restaurant' ? 
                        "Try: 'What vegetarian options do you have?'" : 
                        "Try: 'Which doctors are available on Friday?'"}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-2 h-8 w-8 flex items-center justify-center bg-blue-500 rounded-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Statistics Section */}
      <div className="bg-slate-900/80 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">99.7%</div>
              <div className="text-slate-400">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">0.3s</div>
              <div className="text-slate-400">Response Time</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">8+</div>
              <div className="text-slate-400">Domains Supported</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-slate-400">Always Available</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hackathon Info Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-10">
              <h2 className="text-3xl font-bold mb-4">Technitude 2025 Hackathon Entry</h2>
              <p className="text-slate-300 mb-6">
                Our GenAI solution addresses the challenge of creating a versatile conversational interface 
                that works seamlessly for both restaurant ordering and medical appointment booking.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Portability & Versatility</h3>
                    <p className="text-slate-400 text-sm">Adaptable across different business domains</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Code Quality</h3>
                    <p className="text-slate-400 text-sm">Clean, maintainable architecture with documentation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Usability</h3>
                    <p className="text-slate-400 text-sm">Intuitive interface with natural conversation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-slate-800/80 p-10">
              <h3 className="text-xl font-bold mb-4">Judging Criteria Met</h3>
              <div className="space-y-3">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Portability</span>
                    <span className="text-xs text-blue-400">95%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: "95%"}}></div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Code Quality</span>
                    <span className="text-xs text-blue-400">92%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: "92%"}}></div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Versatility</span>
                    <span className="text-xs text-blue-400">98%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: "98%"}}></div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Usability</span>
                    <span className="text-xs text-blue-400">94%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: "94%"}}></div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Efficiency</span>
                    <span className="text-xs text-blue-400">90%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: "90%"}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Our AI solution adapts to your specific needs while providing a seamless user experience. Perfect for restaurants, clinics, and beyond.
          </p>
          <button className="px-8 py-3 bg-white text-blue-900 rounded-lg font-semibold shadow-lg hover:bg-blue-50 transition duration-300">
            Get Started Now
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 py-10">
        <div className="container mx-auto px-6">
          <div className="text-center text-slate-500 text-sm">
            <p>© 2025 Restaurant Health-Connect AI | Technitude Hackathon Entry</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;