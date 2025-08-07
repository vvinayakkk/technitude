import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from './Sidebar';

const Home = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5001/api/doctors')
      .then(res => {
        const doctors = res.data.doctors;
        setFeaturedDoctors(doctors.sort(() => 0.5 - Math.random()).slice(0, 3));
      })
      .catch(err => {
        console.error("Failed to fetch doctors:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex flex-1 pt-16"> {/* pt-16 adds padding to account for navbar height */}
        <Sidebar />
        
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-4">Welcome to HealthConnect AI</h1>
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Your AI-Powered Healthcare Companion</h3>
            <p>HealthConnect AI makes it easy to find the right doctor, book appointments, and manage your healthcare journey.</p>
            <div className="mt-4 flex space-x-4">
              <button onClick={() => navigate('/find-doctor')} className="bg-blue-500 text-white px-4 py-2 rounded">Find a Doctor</button>
              <button onClick={() => navigate('/book-appointment')} className="bg-blue-500 text-white px-4 py-2 rounded">Book Appointment</button>
              <button onClick={() => navigate('/health-assistant')} className="bg-blue-500 text-white px-4 py-2 rounded">Health Assistant</button>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Featured Doctors</h3>
          {loading ? (
            <p>Loading featured doctors...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredDoctors.map(doctor => (
                <div key={doctor.id} className="border p-4 rounded shadow hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-bold">{doctor.name}</h4>
                  <p>{doctor.specialization}</p>
                  <p>Rating: {doctor.rating}/5</p>
                  <button 
                    onClick={() => navigate(`/book-appointment?doctor_id=${doctor.id}`)} 
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 p-4 bg-blue-50 rounded">
            <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
            <p className="mb-2">Not sure which doctor to choose? Our AI assistant can help you find the right specialist.</p>
            <button 
              onClick={() => navigate('/health-assistant')} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Get AI Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;