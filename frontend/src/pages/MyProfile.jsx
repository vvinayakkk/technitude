import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyProfile = () => {
  const [profile, setProfile] = useState({});
  const [insuranceOptions, setInsuranceOptions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/profile').then(res => {
      setProfile(res.data.profile);
      setInsuranceOptions(res.data.insurance_options);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5001/api/profile', profile).then(() => alert('Profile updated'));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My Health Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Personal Information</h3>
          <input name="name" value={profile.name || ''} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded w-full" />
          <input name="dob" type="date" value={profile.dob || ''} onChange={handleChange} className="border p-2 rounded w-full" />
          <select name="gender" value={profile.gender || ''} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Select Gender</option>
            {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <input name="contact_number" value={profile.contact_number || ''} onChange={handleChange} placeholder="Contact Number" className="border p-2 rounded w-full" />
          <input name="email" value={profile.email || ''} onChange={handleChange} placeholder="Email" className="border p-2 rounded w-full" />
          <textarea name="address" value={profile.address || ''} onChange={handleChange} placeholder="Address" className="border p-2 rounded w-full" />
          <input name="emergency_contact" value={profile.emergency_contact || ''} onChange={handleChange} placeholder="Emergency Contact" className="border p-2 rounded w-full" />
          <select name="insurance" value={profile.insurance || ''} onChange={handleChange} className="border p-2 rounded w-full">
            {insuranceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Medical History</h3>
          <input name="medical_history" value={(profile.medical_history || []).join(',')} onChange={e => setProfile(prev => ({ ...prev, medical_history: e.target.value.split(',') }))} placeholder="Medical History (comma-separated)" className="border p-2 rounded w-full" />
          <input name="allergies" value={(profile.allergies || []).join(',')} onChange={e => setProfile(prev => ({ ...prev, allergies: e.target.value.split(',') }))} placeholder="Allergies (comma-separated)" className="border p-2 rounded w-full" />
          <input name="current_medications" value={(profile.current_medications || []).join(',')} onChange={e => setProfile(prev => ({ ...prev, current_medications: e.target.value.split(',') }))} placeholder="Medications (comma-separated)" className="border p-2 rounded w-full" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Preferences</h3>
          <input name="preferred_pharmacy" value={profile.preferred_pharmacy || ''} onChange={handleChange} placeholder="Preferred Pharmacy" className="border p-2 rounded w-full" />
          <select name="preferred_contact_method" value={profile.preferred_contact_method || 'Phone'} onChange={handleChange} className="border p-2 rounded w-full">
            {['Phone', 'Email', 'Text'].map(method => <option key={method} value={method}>{method}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Profile</button>
      </form>
    </div>
  );
};

export default MyProfile;