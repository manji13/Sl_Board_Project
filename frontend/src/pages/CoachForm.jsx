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

const districtOptions = ["Galle", "Matara", "Hambanthota"];
const zoneOptions = ["Galle Zone 1", "Galle Zone 2", "Galle Zone 3"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream: #FAF7F2;
    --dark: #1A1A2E;
    --accent: #C9A84C;
    --accent-light: #F0E4C2;
    --green: #2D6A4F;
    --green-light: #D8F3DC;
    --red: #C1121F;
    --red-light: #FFE5E7;
    --slate: #4A5568;
    --border: #E8E0D0;
    --white: #FFFFFF;
    --shadow: 0 4px 24px rgba(26,26,46,0.08);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    background: var(--cream);
  }

  .cf-page {
    width: 100%;
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    background-image: radial-gradient(circle at 10% 20%, rgba(201,168,76,0.06) 0%, transparent 50%),
                      radial-gradient(circle at 90% 80%, rgba(45,106,79,0.06) 0%, transparent 50%);
  }

  .cf-topbar {
    background: var(--dark);
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    width: 100%;
    border-bottom: 2px solid var(--accent);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .cf-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cf-brand-icon {
    width: 36px;
    height: 36px;
    background: var(--accent);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .cf-brand-name {
    font-family: 'Playfair Display', serif;
    color: var(--white);
    font-size: 18px;
    letter-spacing: 0.5px;
  }

  .cf-brand-name span { color: var(--accent); }

  .cf-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(255,255,255,0.5);
  }

  .cf-breadcrumb-sep { color: rgba(255,255,255,0.2); }
  .cf-breadcrumb-active { color: var(--accent); font-weight: 500; }

  .cf-container {
    max-width: 960px;
    width: 100%;
    margin: 0 auto;
    padding: 40px 32px 80px;
  }

  .cf-page-header {
    margin-bottom: 36px;
  }

  .cf-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 8px;
  }

  .cf-title {
    font-family: 'Playfair Display', serif;
    font-size: 34px;
    color: var(--dark);
    line-height: 1.15;
  }

  .cf-subtitle {
    font-size: 14px;
    color: var(--slate);
    margin-top: 6px;
  }

  /* Section Cards */
  .cf-section {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 16px;
    margin-bottom: 24px;
    overflow: hidden;
    box-shadow: var(--shadow);
    animation: sectionIn 0.35s ease both;
  }

  @keyframes sectionIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .cf-section:nth-child(1) { animation-delay: 0.05s; }
  .cf-section:nth-child(2) { animation-delay: 0.1s; }
  .cf-section:nth-child(3) { animation-delay: 0.15s; }
  .cf-section:nth-child(4) { animation-delay: 0.2s; }

  .cf-section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 24px;
    background: var(--dark);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .cf-section-icon {
    width: 34px;
    height: 34px;
    background: rgba(201,168,76,0.15);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .cf-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    color: var(--white);
    flex: 1;
  }

  .cf-section-num {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
  }

  .cf-section-body {
    padding: 26px 24px;
  }

  .cf-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .cf-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }

  .cf-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .cf-field.full { grid-column: 1 / -1; }

  .cf-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--slate);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cf-required {
    color: var(--red);
    font-size: 14px;
    line-height: 1;
  }

  .cf-input, .cf-select {
    padding: 11px 14px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--dark);
    outline: none;
    transition: all 0.2s;
    width: 100%;
  }

  .cf-input:focus, .cf-select:focus {
    border-color: var(--accent);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
  }

  .cf-input::placeholder { color: #B0A898; }

  .cf-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234A5568' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }

  /* Checkbox groups */
  .cf-checkbox-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 4px;
  }

  .cf-checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s;
    background: var(--cream);
    font-size: 13px;
    font-weight: 500;
    color: var(--slate);
  }

  .cf-checkbox-label:hover {
    border-color: var(--accent);
    background: var(--accent-light);
    color: var(--dark);
  }

  .cf-checkbox-label.checked {
    border-color: var(--accent);
    background: var(--accent-light);
    color: var(--dark);
    font-weight: 600;
  }

  .cf-checkbox-input {
    display: none;
  }

  .cf-checkbox-box {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
    background: var(--white);
  }

  .cf-checkbox-label.checked .cf-checkbox-box {
    background: var(--accent);
    border-color: var(--accent);
  }

  .cf-checkbox-check {
    width: 10px;
    height: 7px;
    border-left: 2px solid var(--dark);
    border-bottom: 2px solid var(--dark);
    transform: rotate(-45deg) translateY(-1px);
    display: none;
  }

  .cf-checkbox-label.checked .cf-checkbox-check {
    display: block;
  }

  /* Image upload */
  .cf-upload-area {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .cf-avatar-preview {
    width: 80px;
    height: 80px;
    border-radius: 14px;
    overflow: hidden;
    flex-shrink: 0;
    border: 2px solid var(--border);
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cf-avatar-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cf-avatar-placeholder-icon {
    font-size: 28px;
    opacity: 0.3;
  }

  .cf-upload-right { flex: 1; }

  .cf-upload-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: var(--cream);
    border: 1.5px dashed var(--border);
    border-radius: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--slate);
    transition: all 0.2s;
    width: 100%;
    justify-content: center;
  }

  .cf-upload-label:hover {
    border-color: var(--accent);
    background: var(--accent-light);
    color: var(--dark);
  }

  .cf-upload-hint {
    font-size: 11px;
    color: #B0A898;
    margin-top: 6px;
    text-align: center;
  }

  input[type="file"].cf-file-input {
    display: none;
  }

  /* Footer */
  .cf-footer {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    gap: 14px;
    align-items: center;
    box-shadow: var(--shadow);
    animation: sectionIn 0.35s 0.25s ease both;
  }

  .cf-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 24px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .cf-btn.primary {
    background: var(--dark);
    color: var(--white);
    flex: 1;
  }

  .cf-btn.primary:hover {
    background: var(--accent);
    color: var(--dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(201,168,76,0.3);
  }

  .cf-btn.secondary {
    background: var(--cream);
    color: var(--slate);
    border: 1.5px solid var(--border);
    min-width: 120px;
  }

  .cf-btn.secondary:hover {
    background: var(--border);
    color: var(--dark);
  }

  .cf-error-msg {
    background: var(--red-light);
    border: 1px solid #FFB3B8;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    color: var(--red);
    font-weight: 500;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 640px) {
    .cf-grid-2, .cf-grid-3 { grid-template-columns: 1fr; }
    .cf-checkbox-group { grid-template-columns: 1fr; }
    .cf-topbar { padding: 0 20px; }
    .cf-container { padding: 24px 16px 60px; }
  }
`;

export default function CoachForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '', phone: '', age: '', gender: '', employment: '',
    designation: [], district: '', zone: '', qualifications: [],
    playingExperience: '', coachingExperience: '', licenseNumber: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/coaches/${id}`)
        .then(res => {
          setFormData({
            ...res.data,
            designation: Array.isArray(res.data.designation) ? res.data.designation : [res.data.designation].filter(Boolean),
            qualifications: Array.isArray(res.data.qualifications) ? res.data.qualifications : [res.data.qualifications].filter(Boolean),
          });
          if (res.data.image) setImagePreview(`http://localhost:5000/uploads/${res.data.image}`);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheckbox = (value, field) => {
    let arr = [...formData[field]];
    arr = arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value];
    setFormData({ ...formData, [field]: arr });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.designation.length === 0 || formData.qualifications.length === 0) {
      setError('Please select at least one Designation and one Qualification.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'designation' || key === 'qualifications') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    if (imageFile) data.append('image', imageFile);

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/coaches/${id}`, data);
      } else {
        await axios.post('http://localhost:5000/api/coaches', data);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to save coach data. Please try again.');
    }
  };

  const isEdit = Boolean(id);

  return (
    <>
      <style>{styles}</style>
      <div className="cf-page">

        {/* Top Bar */}
        <div className="cf-topbar">
          <div className="cf-brand">
            <div className="cf-brand-icon">🏏</div>
            <span className="cf-brand-name">Southern Cricket <span>Authority</span></span>
          </div>
          <div className="cf-breadcrumb">
            <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }} onClick={() => navigate('/')}>Coaches</span>
            <span className="cf-breadcrumb-sep">›</span>
            <span className="cf-breadcrumb-active">{isEdit ? 'Edit Profile' : 'Register New'}</span>
          </div>
        </div>

        <div className="cf-container">

          {/* Page Header */}
          <div className="cf-page-header">
            <div className="cf-eyebrow">{isEdit ? 'Update Record' : 'New Registration'}</div>
            <div className="cf-title">{isEdit ? 'Edit Coach Profile' : 'Register New Coach'}</div>
            <div className="cf-subtitle">
              {isEdit ? 'Modify the details below and save your changes.' : 'Fill in the details below to add a new coach to the registry.'}
            </div>
          </div>

          {error && (
            <div className="cf-error-msg">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Section 1: Personal Info */}
            <div className="cf-section">
              <div className="cf-section-header">
                <div className="cf-section-icon">👤</div>
                <div className="cf-section-title">Personal Information</div>
                <div className="cf-section-num">01</div>
              </div>
              <div className="cf-section-body">
                <div className="cf-grid-2">
                  <div className="cf-field">
                    <label className="cf-label">Full Name <span className="cf-required">*</span></label>
                    <input className="cf-input" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="E.g. Mahela Jayawardene" />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label">Phone Number <span className="cf-required">*</span></label>
                    <input className="cf-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="07X XXX XXXX" />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label">Age</label>
                    <input className="cf-input" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Years" min="16" max="90" />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label">Gender</label>
                    <select className="cf-select" name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Role & Qualifications */}
            <div className="cf-section">
              <div className="cf-section-header">
                <div className="cf-section-icon">🎓</div>
                <div className="cf-section-title">Role & Qualifications</div>
                <div className="cf-section-num">02</div>
              </div>
              <div className="cf-section-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div className="cf-field full">
                  <label className="cf-label">Designation (Position) <span className="cf-required">*</span></label>
                  <div className="cf-checkbox-group">
                    {designationOptions.map(opt => {
                      const checked = formData.designation.includes(opt);
                      return (
                        <label key={opt} className={`cf-checkbox-label${checked ? ' checked' : ''}`}>
                          <input className="cf-checkbox-input" type="checkbox" value={opt} checked={checked} onChange={() => handleCheckbox(opt, 'designation')} />
                          <div className="cf-checkbox-box">
                            <div className="cf-checkbox-check" />
                          </div>
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="cf-field full">
                  <label className="cf-label">Coaching Qualifications <span className="cf-required">*</span></label>
                  <div className="cf-checkbox-group" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {qualificationOptions.map(opt => {
                      const checked = formData.qualifications.includes(opt);
                      return (
                        <label key={opt} className={`cf-checkbox-label${checked ? ' checked' : ''}`}>
                          <input className="cf-checkbox-input" type="checkbox" value={opt} checked={checked} onChange={() => handleCheckbox(opt, 'qualifications')} />
                          <div className="cf-checkbox-box">
                            <div className="cf-checkbox-check" />
                          </div>
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="cf-grid-2">
                  <div className="cf-field">
                    <label className="cf-label">Playing Exp. & Level</label>
                    <input className="cf-input" type="text" name="playingExperience" value={formData.playingExperience} onChange={handleChange} placeholder="E.g. First Class, Club" />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label">Coaching Experience (Years)</label>
                    <input className="cf-input" type="number" name="coachingExperience" value={formData.coachingExperience} onChange={handleChange} placeholder="0" min="0" />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label">Coaching License Number</label>
                    <input className="cf-input" type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="License ID" />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label">Present Employment</label>
                    <input className="cf-input" type="text" name="employment" value={formData.employment} onChange={handleChange} placeholder="School or Academy Name" />
                  </div>
                </div>

              </div>
            </div>

            {/* Section 3: Location */}
            <div className="cf-section">
              <div className="cf-section-header">
                <div className="cf-section-icon">📍</div>
                <div className="cf-section-title">Location Details</div>
                <div className="cf-section-num">03</div>
              </div>
              <div className="cf-section-body">
                <div className="cf-grid-2">
                  <div className="cf-field">
                    <label className="cf-label">District</label>
                    <select className="cf-select" name="district" value={formData.district} onChange={handleChange}>
                      <option value="">Select District</option>
                      {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="cf-field">
                    <label className="cf-label">Zone</label>
                    <select className="cf-select" name="zone" value={formData.zone} onChange={handleChange}>
                      <option value="">Select Zone</option>
                      {zoneOptions.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Profile Image */}
            <div className="cf-section">
              <div className="cf-section-header">
                <div className="cf-section-icon">📷</div>
                <div className="cf-section-title">Profile Image</div>
                <div className="cf-section-num">04</div>
              </div>
              <div className="cf-section-body">
                <div className="cf-upload-area">
                  <div className="cf-avatar-preview">
                    {imagePreview
                      ? <img src={imagePreview} alt="Preview" />
                      : <div className="cf-avatar-placeholder-icon">🧑</div>
                    }
                  </div>
                  <div className="cf-upload-right">
                    <input id="fileInput" className="cf-file-input" type="file" onChange={handleFileChange} accept="image/*" />
                    <label htmlFor="fileInput" className="cf-upload-label">
                      📁 Choose Photo
                    </label>
                    <div className="cf-upload-hint">JPG, PNG, WEBP up to 5MB</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="cf-footer">
              <button type="button" className="cf-btn secondary" onClick={() => navigate('/')}>
                ← Cancel
              </button>
              <button type="submit" className="cf-btn primary">
                {isEdit ? '💾 Save Changes' : '✅ Register Coach'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}