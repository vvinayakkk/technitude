import React, { useState } from 'react';

const AxioFinanceUI = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-black p-6 flex flex-col">
        <div className="mb-12">
          <h1 className="text-3xl font-bold">
            <span className="text-white">a</span>
            <span className="text-green-500">x</span>
            <span className="text-white">:</span>
            <span className="text-green-500">io</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Finance management, made simple</p>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-4">
            <li 
              className={`p-3 rounded-md cursor-pointer ${activeTab === 'dashboard' ? 'bg-gray-800 border-l-4 border-green-500' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </li>
            <li 
              className={`p-3 rounded-md cursor-pointer ${activeTab === 'transactions' ? 'bg-gray-800 border-l-4 border-green-500' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </li>
            <li 
              className={`p-3 rounded-md cursor-pointer ${activeTab === 'payments' ? 'bg-gray-800 border-l-4 border-green-500' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </li>
            <li 
              className={`p-3 rounded-md cursor-pointer ${activeTab === 'reports' ? 'bg-gray-800 border-l-4 border-green-500' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </li>
            <li 
              className={`p-3 rounded-md cursor-pointer ${activeTab === 'settings' ? 'bg-gray-800 border-l-4 border-green-500' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black font-bold">Y</div>
            <div className="ml-3">
              <p className="font-medium">Yash</p>
              <p className="text-sm text-gray-400">Premium Account</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gray-900 p-6 flex justify-between items-center border-b border-gray-800">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-green-500 hover:bg-green-600">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-400 mb-2">Total Balance</p>
              <h3 className="text-3xl font-bold">₹3,52,500</h3>
              <div className="flex items-center mt-4 text-green-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+4.3%</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-400 mb-2">Monthly Spend</p>
              <h3 className="text-3xl font-bold">₹14,206</h3>
              <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{width: '65%'}}></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">65% of monthly budget</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-400 mb-2">Payments Due</p>
              <h3 className="text-3xl font-bold">₹1,200</h3>
              <button className="mt-4 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg px-4 py-2">
                Pay Now
              </button>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Recent Transactions</h3>
              <button className="text-green-500 hover:text-green-400">View All</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-pink-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Zomato</p>
                    <p className="text-sm text-gray-400">04:30 PM, 14 May</p>
                  </div>
                </div>
                <p className="font-medium">₹220</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1H4V6h7v6h2v3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V9l-3-5H3z"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Uber</p>
                    <p className="text-sm text-gray-400">06:22 PM, 14 May</p>
                  </div>
                </div>
                <p className="font-medium">₹340</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-yellow-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Shopping</p>
                    <p className="text-sm text-gray-400">02:15 PM, 15 May</p>
                  </div>
                </div>
                <p className="font-medium">₹1,850</p>
              </div>
            </div>
          </div>
          
          {/* Payment Due */}
          <div className="mt-6 bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-green-500 uppercase text-sm font-medium">Due Today</p>
                <div className="flex items-center mt-2">
                  <div className="w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-black font-bold">X</div>
                  <p className="ml-3 text-xl font-bold">₹1,200</p>
                </div>
                <p className="text-sm text-gray-400 mt-1">axio Pay Later</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg px-4 py-2 flex items-center">
                Pay Due
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AxioFinanceUI;