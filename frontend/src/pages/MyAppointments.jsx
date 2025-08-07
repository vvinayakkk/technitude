import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  // Sample dummy data
  const dummyDoctors = {
    1: { id: 1, name: "Dr. Strange", specialty: "Mystic Arts", icon: "user-md" },
    2: { id: 2, name: "Dr. Frankenstein", specialty: "Reanimation", icon: "flask" },
    3: { id: 3, name: "Dr. Zoidberg", specialty: "Alien Anatomy", icon: "stethoscope" },
    4: { id: 4, name: "Dr. Jekyll", specialty: "Personality Disorders", icon: "brain" }
  };

  const dummyAppointments = [
    { appointment_id: 101, doctor_id: 1, date: "2025-03-25", time: "10:00 AM", reason: "Third Eye Examination", status: "Confirmed", notes: "Bring your own mystical amulet" },
    { appointment_id: 102, doctor_id: 2, date: "2025-03-26", time: "11:30 PM", reason: "Lightning Rod Replacement", status: "Confirmed", notes: "It's alive! IT'S ALIVE!" },
    { appointment_id: 103, doctor_id: 3, date: "2025-02-20", time: "3:00 PM", reason: "Tentacle Massage", status: "Past", notes: "Why not Zoidberg?" },
    { appointment_id: 104, doctor_id: 4, date: "2025-01-15", time: "9:00 AM", reason: "Personality Split Therapy", status: "Cancelled", notes: "Patient became someone else before appointment" },
    { appointment_id: 105, doctor_id: 1, date: "2025-04-01", time: "12:00 PM", reason: "Time Stone Consultation", status: "Confirmed", notes: "Dormammu, I've come to bargain" }
  ];

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call with dummy data
    setIsLoading(true);
    setTimeout(() => {
      const filteredAppointments = dummyAppointments.filter(apt => {
        if (filter === 'All') return true;
        return apt.status === filter;
      });
      setAppointments(filteredAppointments);
      setDoctors(dummyDoctors);
      setIsLoading(false);
    }, 800);
  }, [filter]);

  const handleAction = (action, aptId) => {
    if (action === 'reschedule') {
      navigate('/reschedule/' + aptId);
    } else if (action === 'cancel') {
      setAppointments(prev => 
        prev.map(apt => 
          apt.appointment_id === aptId ? {...apt, status: 'Cancelled'} : apt
        )
      );
    }
  };

  // Helper function to render icon based on doctor's icon property
  const renderDoctorIcon = (iconName) => {
    // Simple mapping of icon names to SVG icons
    const icons = {
      "user-md": (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      "flask": (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      "stethoscope": (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      "brain": (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    };
    
    return icons[iconName] || (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen p-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700">
            My Appointments
          </h1>
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          {['All', 'Confirmed', 'Past', 'Cancelled'].map(option => (
            <label key={option} className="relative inline-block cursor-pointer">
              <input 
                type="radio" 
                value={option} 
                checked={filter === option} 
                onChange={() => setFilter(option)} 
                className="sr-only"
              />
              <span className={`px-4 py-2 rounded-full transition-all ${filter === option 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {option}
              </span>
            </label>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin text-blue-600">
              <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((apt) => (
              <div 
                id={`appointment-${apt.appointment_id}`}
                key={apt.appointment_id} 
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-center mb-3">
                  <div className="w-16 h-16 rounded-full mr-4 overflow-hidden flex items-center justify-center bg-blue-100 text-blue-600">
                    {renderDoctorIcon(doctors[apt.doctor_id]?.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{doctors[apt.doctor_id]?.name}</h3>
                    <p className="text-sm text-gray-600">{doctors[apt.doctor_id]?.specialty}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold 
                      ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                        apt.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {apt.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {apt.date} at 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {apt.time}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {apt.reason}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded mb-4">
                  <p className="text-sm text-gray-500">Special Notes</p>
                  <p className="italic text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {apt.notes}
                  </p>
                </div>

                {apt.status === 'Confirmed' && new Date(apt.date) >= new Date() && (
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => handleAction('cancel', apt.appointment_id)} 
                      className="bg-white border border-red-500 text-red-500 px-4 py-2 rounded-md flex-1 hover:bg-red-50 transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleAction('reschedule', apt.appointment_id)} 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md flex-1 hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reschedule
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {appointments.length === 0 && !isLoading && (
          <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-medium text-gray-800">No appointments found</p>
            <p className="text-gray-600">Try changing your filter or book a new appointment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;