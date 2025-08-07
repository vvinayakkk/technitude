import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FindDoctor = () => {
  const [searchType, setSearchType] = useState('specialty');
  const [specialty, setSpecialty] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [name, setName] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [results, setResults] = useState([]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5001/api/doctors')
      .then(res => {
        setSpecializations(res.data.specializations || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching specializations:', err);
        setError('Failed to load specializations. Please try again later.');
        setSpecializations([]);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    const data = { search_type: searchType };
    if (searchType === 'specialty') data.specialty = specialty;
    if (searchType === 'symptoms') data.symptoms = symptoms;
    if (searchType === 'name') data.name = name;
    
    axios.post('http://localhost:5001/api/doctors', data).then(res => {
      setResults(res.data.results || []);
      setAiAdvice(res.data.ai_advice || '');
    }).catch(err => {
      console.error('Error searching doctors:', err);
      setResults([]);
      setAiAdvice('');
      setError('Failed to search doctors. Please try again later.');
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Find Your Doctor</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <label><input type="radio" value="specialty" checked={searchType === 'specialty'} onChange={() => setSearchType('specialty')} /> Specialty</label>
          <label><input type="radio" value="symptoms" checked={searchType === 'symptoms'} onChange={() => setSearchType('symptoms')} /> Symptoms</label>
          <label><input type="radio" value="name" checked={searchType === 'name'} onChange={() => setSearchType('name')} /> Name</label>
        </div>
        {searchType === 'specialty' && (
          loading ? <p>Loading specializations...</p> : 
          <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="border p-2 rounded">
            <option value="">Select a specialty</option>
            {Array.isArray(specializations) && specializations.map(spec => 
              <option key={spec} value={spec}>{spec}</option>
            )}
          </select>
        )}
        {searchType === 'symptoms' && (
          <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} className="border p-2 rounded w-full" placeholder="Describe your symptoms" />
        )}
        {searchType === 'name' && (
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded w-full" placeholder="Enter doctor name" />
        )}
        <button onClick={handleSearch} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Search</button>
      </div>
      {results.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold">Found {results.length} doctors</h3>
          {results.map(doctor => (
            <div key={doctor.id} className="border p-4 rounded mb-4">
              <h4 className="text-lg font-bold">{doctor.name}</h4>
              <p>{doctor.specialization}</p>
              <p>{doctor.bio}</p>
              <button onClick={() => navigate(`/book-appointment?doctor_id=${doctor.id}`)} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">Book Appointment</button>
            </div>
          ))}
          {aiAdvice && <p className="mt-4 text-blue-600">AI Recommendation: {aiAdvice}</p>}
        </div>
      )}
    </div>
  );
};

export default FindDoctor;