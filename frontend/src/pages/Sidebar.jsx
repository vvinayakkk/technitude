import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">HealthConnect AI</h2>
      <nav>
        <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Home</Link>
        <Link to="/find-doctor" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Find a Doctor</Link>
        <Link to="/book-appointment" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Book Appointment</Link>
        <Link to="/my-appointments" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">My Appointments</Link>
        <Link to="/health-assistant" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Health Assistant</Link>
        <Link to="/my-profile" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">My Profile</Link>
      </nav>
    </div>
  );
};

export default Sidebar;