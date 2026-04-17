import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const designationOptions = [
  "Head coach - Senior", "Head Coach - Junior", "Senior Assistant coach",
  "Junior Assistant coach", "Academy Head Coach", "Fielding coach",
  "Throwdown coach", "Academy coach"
];

const qualificationOptions = [
  "Level 0", "Level 1", "Level 2", "Level 3", "No Qualifications"
];

const districtOptions = ["Galle", "Matara", "hambantota", "Monaragala", "Ratnapura", "Badulla"];
const zoneOptions = ["Galle Zone 1", "Galle Zone 2", "Galle Zone 3"];

export default function CoachForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '', phone: '', nic: '', age: '', gender: '', employment: '',
    designation: [], district: '', zone: '', qualifications: [],
    playingExperience: '', coachingExperience: '', licenseNumber: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // API URL - Vercel in production, localhost in development
  const API_URL = import.meta.env?.VITE_API_URL || (process.env.NODE_ENV === 'production' ? 'https://sl-board-project.vercel.app' : 'http://localhost:5000');

  useEffect(() => {
    if (id) {
      fetchCoachData();
    }
  }, [id]);

  const fetchCoachData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/coaches/${id}?t=${new Date().getTime()}`);
      const coachData = res.data;
      
      setFormData({
        name: coachData.name || '',
        phone: coachData.phone || '',
        nic: coachData.nic || '',
        age: coachData.age || '',
        gender: coachData.gender || '',
        employment: coachData.employment || '',
        designation: Array.isArray(coachData.designation) ? coachData.designation : (coachData.designation ? [coachData.designation] : []),
        district: coachData.district || '',
        zone: coachData.zone || '',
        qualifications: Array.isArray(coachData.qualifications) ? coachData.qualifications : (coachData.qualifications ? [coachData.qualifications] : []),
        playingExperience: coachData.playingExperience || '',
        coachingExperience: coachData.coachingExperience || '',
        licenseNumber: coachData.licenseNumber || ''
      });
      
      // ✅ Handle base64 image for preview
      if (coachData.image && coachData.image.startsWith('data:image')) {
        setImagePreview(coachData.image);
      } else if (coachData.image) {
        setImagePreview(`${API_URL}/uploads/${coachData.image}`);
      }
    } catch (err) {
      console.error('Error fetching coach:', err);
      setError('Failed to load coach data');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheckbox = (value, field) => {
    let arr = [...formData[field]];
    arr = arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value];
    setFormData({ ...formData, [field]: arr });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || formData.name.trim() === '') {
      setError('Please enter Coach Name');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (!formData.nic || formData.nic.trim() === '') {
      setError('Please enter NIC Number (Required)');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (formData.designation.length === 0) {
      setError('Please select at least one Designation');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (formData.qualifications.length === 0) {
      setError('Please select at least one Qualification');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const data = new FormData();
    
    // ✅ Explicitly append ALL fields including NIC
    data.append('name', formData.name || '');
    data.append('phone', formData.phone || '');
    data.append('nic', formData.nic || '');  // CRITICAL: NIC is explicitly appended
    data.append('age', formData.age || '');
    data.append('gender', formData.gender || '');
    data.append('employment', formData.employment || '');
    data.append('district', formData.district || '');
    data.append('zone', formData.zone || '');
    data.append('playingExperience', formData.playingExperience || '');
    data.append('coachingExperience', formData.coachingExperience || '');
    data.append('licenseNumber', formData.licenseNumber || '');
    
    // Handle arrays as JSON strings
    data.append('designation', JSON.stringify(formData.designation));
    data.append('qualifications', JSON.stringify(formData.qualifications));
    
    // Add image if selected
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      let response;
      if (id) {
        response = await axios.put(`${API_URL}/api/coaches/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Update response:', response.data);
      } else {
        response = await axios.post(`${API_URL}/api/coaches`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Create response:', response.data);
      }
      
      // ✅ Verify NIC was saved
      if (response.data && response.data.nic) {
        console.log('NIC saved successfully:', response.data.nic);
      } else {
        console.warn('NIC might not have been saved');
      }
      
      navigate('/');
    } catch (err) {
      console.error('Error saving coach:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to save coach data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isEdit = Boolean(id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes sectionIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .font-sans-custom { font-family: 'DM Sans', sans-serif; }
        .font-serif-custom { font-family: 'Playfair Display', serif; }
        .animate-sectionIn { animation: sectionIn 0.35s ease both; }
      `}</style>
      
      <div 
        className="w-full min-h-screen bg-[#FAF7F2] font-sans-custom pb-20"
        style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(45,106,79,0.06) 0%, transparent 50%)' }}
      >
        <div className="bg-[#1A1A2E] px-5 sm:px-10 flex items-center justify-between h-16 w-full border-b-[2px] border-[#C9A84C] sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C9A84C] rounded-lg flex items-center justify-center text-[18px]">🏏</div>
            <span className="font-serif-custom text-white text-[18px] tracking-[0.5px]">Southern Cricket <span className="text-[#C9A84C]">Authority</span></span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-white/50">
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')}>Coaches</span>
            <span className="text-white/20">›</span>
            <span className="text-[#C9A84C] font-medium">{isEdit ? 'Edit Profile' : 'Register New'}</span>
          </div>
        </div>

        <div className="max-w-[960px] w-full mx-auto px-4 sm:px-8 pt-10 pb-20">

          <div className="mb-9">
            <div className="text-[11px] font-semibold tracking-[2.5px] uppercase text-[#C9A84C] mb-2">{isEdit ? 'Update Record' : 'New Registration'}</div>
            <div className="font-serif-custom text-[34px] text-[#1A1A2E] leading-[1.15]">{isEdit ? 'Edit Coach Profile' : 'Register New Coach'}</div>
            <div className="text-[14px] text-[#4A5568] mt-1.5">
              {isEdit ? 'Modify the details below and save your changes.' : 'Fill in the details below to add a new coach to the registry.'}
            </div>
          </div>

          {error && (
            <div className="bg-[#FFE5E7] border border-[#FFB3B8] rounded-[10px] p-3 text-[13px] text-[#C1121F] font-medium mb-5 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="bg-white border border-[#E8E0D0] rounded-2xl mb-6 overflow-hidden shadow-[0_4px_24px_rgba(26,26,46,0.08)] animate-sectionIn" style={{ animationDelay: '0.05s' }}>
              <div className="flex items-center gap-3 px-6 py-[18px] bg-[#1A1A2E] border-b border-white/10">
                <div className="w-[34px] h-[34px] bg-[#C9A84C]/15 rounded-lg flex items-center justify-center text-[16px] shrink-0">👤</div>
                <div className="font-serif-custom text-[16px] text-white flex-1">Personal Information</div>
                <div className="text-[11px] font-semibold tracking-[1px] text-white/30 uppercase">01</div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Full Name <span className="text-[#C1121F] text-[14px] leading-none">*</span></label>
                    <input className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Phone Number <span className="text-[#C1121F] text-[14px] leading-none">*</span></label>
                    <input className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">NIC Number</label>
                    <input className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" type="text" name="nic" value={formData.nic} onChange={handleChange} placeholder="Enter NIC number" />
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Age</label>
                    <input className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Years" min="16" max="90" />
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Gender</label>
                    <select className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Role & Qualifications Section */}
            <div className="bg-white border border-[#E8E0D0] rounded-2xl mb-6 overflow-hidden shadow-[0_4px_24px_rgba(26,26,46,0.08)] animate-sectionIn" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 px-6 py-[18px] bg-[#1A1A2E] border-b border-white/10">
                <div className="w-[34px] h-[34px] bg-[#C9A84C]/15 rounded-lg flex items-center justify-center text-[16px] shrink-0">🎓</div>
                <div className="font-serif-custom text-[16px] text-white flex-1">Role & Qualifications</div>
                <div className="text-[11px] font-semibold tracking-[1px] text-white/30 uppercase">02</div>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Designation (Position) <span className="text-[#C1121F] text-[14px] leading-none">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
                    {designationOptions.map(opt => {
                      const checked = formData.designation.includes(opt);
                      return (
                        <label key={opt} className={`flex items-center gap-2.5 px-3.5 py-2.5 border-[1.5px] rounded-[10px] cursor-pointer transition-all text-[13px] ${checked ? 'border-[#C9A84C] bg-[#F0E4C2] text-[#1A1A2E] font-semibold' : 'border-[#E8E0D0] bg-[#FAF7F2] text-[#4A5568] font-medium hover:border-[#C9A84C] hover:bg-[#F0E4C2] hover:text-[#1A1A2E]'}`}>
                          <input className="hidden" type="checkbox" value={opt} checked={checked} onChange={() => handleCheckbox(opt, 'designation')} />
                          <div className={`w-[18px] h-[18px] border-2 rounded-[5px] flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-[#C9A84C] border-[#C9A84C]' : 'bg-white border-[#E8E0D0]'}`}>
                            <div className={`w-2.5 h-[7px] border-l-2 border-b-2 border-[#1A1A2E] -rotate-45 -translate-y-[1px] ${checked ? 'block' : 'hidden'}`} />
                          </div>
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Coaching Qualifications <span className="text-[#C1121F] text-[14px] leading-none">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1">
                    {qualificationOptions.map(opt => {
                      const checked = formData.qualifications.includes(opt);
                      return (
                        <label key={opt} className={`flex items-center gap-2.5 px-3.5 py-2.5 border-[1.5px] rounded-[10px] cursor-pointer transition-all text-[13px] ${checked ? 'border-[#C9A84C] bg-[#F0E4C2] text-[#1A1A2E] font-semibold' : 'border-[#E8E0D0] bg-[#FAF7F2] text-[#4A5568] font-medium hover:border-[#C9A84C] hover:bg-[#F0E4C2] hover:text-[#1A1A2E]'}`}>
                          <input className="hidden" type="checkbox" value={opt} checked={checked} onChange={() => handleCheckbox(opt, 'qualifications')} />
                          <div className={`w-[18px] h-[18px] border-2 rounded-[5px] flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-[#C9A84C] border-[#C9A84C]' : 'bg-white border-[#E8E0D0]'}`}>
                            <div className={`w-2.5 h-[7px] border-l-2 border-b-2 border-[#1A1A2E] -rotate-45 -translate-y-[1px] ${checked ? 'block' : 'hidden'}`} />
                          </div>
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Playing Exp. & Level</label>
                    <input className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" type="text" name="playingExperience" value={formData.playingExperience} onChange={handleChange} />
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Coaching Experience (Years)</label>
                    <input className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" type="number" name="coachingExperience" value={formData.coachingExperience} onChange={handleChange} min="0" />
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Coaching License Number</label>
                    <input className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Present Employment</label>
                    <input className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" type="text" name="employment" value={formData.employment} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details Section */}
            <div className="bg-white border border-[#E8E0D0] rounded-2xl mb-6 overflow-hidden shadow-[0_4px_24px_rgba(26,26,46,0.08)] animate-sectionIn" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-3 px-6 py-[18px] bg-[#1A1A2E] border-b border-white/10">
                <div className="w-[34px] h-[34px] bg-[#C9A84C]/15 rounded-lg flex items-center justify-center text-[16px] shrink-0">📍</div>
                <div className="font-serif-custom text-[16px] text-white flex-1">Location Details</div>
                <div className="text-[11px] font-semibold tracking-[1px] text-white/30 uppercase">03</div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">District</label>
                    <select className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" name="district" value={formData.district} onChange={handleChange}>
                      <option value="">Select District</option>
                      {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    <label className="text-[12px] font-semibold tracking-[0.8px] uppercase text-[#4A5568] flex items-center gap-1">Zone</label>
                    <select className="px-3.5 py-[11px] border-[1.5px] border-[#E8E0D0] rounded-[10px] bg-[#FAF7F2] font-sans-custom text-[14px] text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 w-full" name="zone" value={formData.zone} onChange={handleChange}>
                      <option value="">Select Zone</option>
                      {zoneOptions.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="bg-white border border-[#E8E0D0] rounded-2xl mb-6 overflow-hidden shadow-[0_4px_24px_rgba(26,26,46,0.08)] animate-sectionIn" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 px-6 py-[18px] bg-[#1A1A2E] border-b border-white/10">
                <div className="w-[34px] h-[34px] bg-[#C9A84C]/15 rounded-lg flex items-center justify-center text-[16px] shrink-0">📷</div>
                <div className="font-serif-custom text-[16px] text-white flex-1">Profile Image</div>
                <div className="text-[11px] font-semibold tracking-[1px] text-white/30 uppercase">04</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-[14px] overflow-hidden shrink-0 border-2 border-[#E8E0D0] bg-[#FAF7F2] flex items-center justify-center">
                    {imagePreview
                      ? <img className="w-full h-full object-cover" src={imagePreview} alt="Preview" />
                      : <div className="text-[28px] opacity-30">🧑</div>
                    }
                  </div>
                  <div className="flex-1">
                    <input id="fileInput" className="hidden" type="file" onChange={handleFileChange} accept="image/*" />
                    <label htmlFor="fileInput" className="inline-flex items-center justify-center gap-2 px-[18px] py-2.5 bg-[#FAF7F2] border-[1.5px] border-dashed border-[#E8E0D0] rounded-[10px] cursor-pointer text-[13px] font-medium text-[#4A5568] transition-all w-full hover:border-[#C9A84C] hover:bg-[#F0E4C2] hover:text-[#1A1A2E]">
                      📁 Choose Photo
                    </label>
                    <div className="text-[11px] text-[#B0A898] mt-1.5 text-center">JPG, PNG, WEBP up to 5MB</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="bg-white border border-[#E8E0D0] rounded-2xl p-6 flex gap-3.5 items-center shadow-[0_4px_24px_rgba(26,26,46,0.08)] animate-sectionIn" style={{ animationDelay: '0.25s' }}>
              <button type="button" className="flex items-center justify-center gap-2 px-6 py-[13px] rounded-[10px] font-sans-custom text-[14px] font-semibold transition-all bg-[#FAF7F2] text-[#4A5568] border-[1.5px] border-[#E8E0D0] min-w-[120px] hover:bg-[#E8E0D0] hover:text-[#1A1A2E]" onClick={() => navigate('/')} disabled={loading}>
                ← Cancel
              </button>
              <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-6 py-[13px] rounded-[10px] border-none cursor-pointer font-sans-custom text-[14px] font-semibold transition-all bg-[#1A1A2E] text-white hover:bg-[#C9A84C] hover:text-[#1A1A2E] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(201,168,76,0.3)] disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                {loading ? 'Saving...' : (isEdit ? '💾 Save Changes' : '✅ Register Coach')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}