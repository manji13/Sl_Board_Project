import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

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
    --shadow-hover: 0 8px 40px rgba(26,26,46,0.14);
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
  }

  .cl-page {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    background-image: radial-gradient(circle at 10% 20%, rgba(201,168,76,0.06) 0%, transparent 50%),
                      radial-gradient(circle at 90% 80%, rgba(45,106,79,0.06) 0%, transparent 50%);
    display: flex;
    flex-direction: column;
  }

  .cl-topbar {
    background: var(--dark);
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    border-bottom: 3px solid var(--accent);
    flex-shrink: 0;
  }

  .cl-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cl-brand-icon {
    width: 42px;
    height: 42px;
    background: var(--accent);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  .cl-brand-name {
    font-family: 'Playfair Display', serif;
    color: var(--white);
    font-size: 20px;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .cl-brand-name span {
    color: var(--accent);
    font-weight: 700;
  }

  .cl-topbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.1);
    padding: 6px 16px;
    border-radius: 30px;
  }

  .cl-topbar-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4CAF50;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.1); }
  }

  .cl-container {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 30px 24px;
    flex: 1;
  }

  .cl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .cl-title-block {
    display: flex;
    flex-direction: column;
  }

  .cl-eyebrow {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 8px;
  }

  .cl-title {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    color: var(--dark);
    line-height: 1.1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
  }

  .cl-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--dark);
    color: var(--accent);
    font-size: 14px;
    font-weight: 600;
    padding: 6px 16px;
    border-radius: 30px;
    font-family: 'DM Sans', sans-serif;
  }

  .cl-actions {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .cl-search-wrap {
    position: relative;
    min-width: 320px;
  }

  .cl-search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--slate);
    font-size: 16px;
    pointer-events: none;
  }

  .cl-search {
    width: 100%;
    padding: 14px 20px 14px 48px;
    border: 2px solid var(--border);
    border-radius: 12px;
    background: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--dark);
    outline: none;
    transition: all 0.2s;
  }

  .cl-search:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(201,168,76,0.15);
  }

  .cl-search::placeholder { 
    color: #94A3B8; 
    font-size: 14px;
  }

  .cl-clear-search {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #94A3B8;
    font-size: 18px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  }

  .cl-clear-search:hover {
    background: #F1F5F9;
    color: var(--dark);
  }

  .cl-add-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    background: var(--dark);
    color: var(--white);
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid var(--dark);
    white-space: nowrap;
  }

  .cl-add-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(201,168,76,0.3);
  }

  .cl-add-btn-icon {
    width: 22px;
    height: 22px;
    background: rgba(255,255,255,0.15);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    transition: background 0.2s;
  }

  .cl-add-btn:hover .cl-add-btn-icon {
    background: rgba(26,26,46,0.15);
  }

  .cl-table-card {
    background: var(--white);
    border: 2px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    min-height: 500px;
    width: 100%;
  }

  .cl-table-header-row {
    display: grid;
    grid-template-columns: 70px 1.2fr 1.8fr 1fr 0.8fr 160px;
    padding: 18px 24px;
    background: var(--dark);
    gap: 15px;
    align-items: center;
    flex-shrink: 0;
  }

  .cl-th {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
  }

  .cl-th.center { 
    text-align: center; 
  }

  .cl-table-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 400px;
  }

  .cl-row {
    display: grid;
    grid-template-columns: 70px 1.2fr 1.8fr 1fr 0.8fr 160px;
    padding: 16px 24px;
    gap: 15px;
    align-items: center;
    border-bottom: 2px solid var(--border);
    transition: background 0.15s;
    cursor: default;
    animation: rowIn 0.3s ease both;
    background: var(--white);
  }

  @keyframes rowIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .cl-row:last-child { 
    border-bottom: none; 
  }

  .cl-row:hover { 
    background: #FDFBF7; 
  }

  .cl-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--border);
  }

  .cl-avatar-placeholder {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--dark) 0%, #2D3561 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    font-weight: 700;
    font-size: 20px;
    font-family: 'Playfair Display', serif;
    flex-shrink: 0;
    border: 3px solid var(--border);
  }

  .cl-coach-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cl-coach-name {
    font-weight: 700;
    font-size: 16px;
    color: var(--dark);
  }

  .cl-coach-phone {
    font-size: 13px;
    color: var(--slate);
  }

  .cl-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cl-badge {
    padding: 4px 12px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .cl-badge.blue {
    background: #EFF6FF;
    color: #1D4ED8;
    border: 1px solid #BFDBFE;
  }

  .cl-badge.gold {
    background: var(--accent-light);
    color: #92640A;
    border: 1px solid #E4C97C;
  }

  .cl-district {
    font-size: 15px;
    color: var(--slate);
    font-weight: 500;
  }

  .cl-exp {
    font-size: 14px;
    color: var(--slate);
  }

  .cl-exp strong {
    color: var(--dark);
    font-weight: 700;
    font-size: 16px;
  }

  .cl-row-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .cl-action-btn {
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .cl-action-btn.view { 
    background: #F1F5F9; 
    color: var(--slate); 
  }
  .cl-action-btn.view:hover { 
    background: #E2E8F0; 
    transform: scale(1.05); 
  }

  .cl-action-btn.edit { 
    background: var(--accent-light); 
    color: #92640A; 
  }
  .cl-action-btn.edit:hover { 
    background: #E8D49A; 
    transform: scale(1.05); 
  }

  .cl-action-btn.delete { 
    background: var(--red-light); 
    color: var(--red); 
  }
  .cl-action-btn.delete:hover { 
    background: #FFC9CC; 
    transform: scale(1.05); 
  }

  .cl-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 400px;
    text-align: center;
    background: var(--white);
    padding: 40px 20px;
  }

  .cl-empty-icon {
    font-size: 80px;
    margin-bottom: 24px;
    opacity: 0.5;
  }

  .cl-empty-text {
    font-size: 20px;
    font-weight: 600;
    color: var(--slate);
    margin-bottom: 8px;
  }

  .cl-empty-subtext {
    font-size: 15px;
    color: #94A3B8;
  }

  .cl-loading {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 16px;
  }

  .cl-loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .cl-error {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 16px;
  }

  .cl-error-icon {
    font-size: 60px;
  }

  .cl-error-text {
    font-size: 18px;
    color: var(--red);
  }

  .cl-retry-btn {
    padding: 12px 24px;
    background: var(--accent);
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cl-retry-btn:hover {
    background: var(--accent-light);
    transform: translateY(-2px);
  }

  .cl-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,26,46,0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
    padding: 20px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .cl-modal {
    background: var(--white);
    border-radius: 24px;
    width: 700px;
    max-width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 30px 70px rgba(0,0,0,0.3);
    animation: slideUp 0.25s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .cl-modal-top {
    background: var(--dark);
    padding: 30px 30px;
    border-radius: 24px 24px 0 0;
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
  }

  .cl-modal-avatar {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    object-fit: cover;
    border: 4px solid var(--accent);
  }

  .cl-modal-avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    background: linear-gradient(135deg, #2D3561, #1A1A2E);
    border: 4px solid var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: var(--accent);
    flex-shrink: 0;
  }

  .cl-modal-name {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: var(--white);
    margin-bottom: 8px;
  }

  .cl-modal-desig {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cl-modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
    background: rgba(255,255,255,0.1);
    border: none;
    border-radius: 10px;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .cl-modal-close:hover { 
    background: rgba(255,255,255,0.2); 
    color: #fff; 
    transform: scale(1.05);
  }

  .cl-modal-body {
    padding: 30px;
  }

  .cl-modal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .cl-detail-item {
    background: var(--cream);
    border: 2px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
  }

  .cl-detail-item.full { 
    grid-column: 1 / -1; 
  }

  .cl-detail-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 6px;
  }

  .cl-detail-value {
    font-size: 16px;
    color: var(--dark);
    font-weight: 500;
  }

  .cl-modal-footer {
    padding: 20px 30px;
    border-top: 2px solid var(--border);
    display: flex;
    gap: 15px;
  }

  .cl-modal-btn {
    flex: 1;
    padding: 14px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.15s;
  }

  .cl-modal-btn.primary {
    background: var(--dark);
    color: var(--white);
  }

  .cl-modal-btn.primary:hover {
    background: var(--accent);
    color: var(--dark);
    transform: translateY(-2px);
  }

  .cl-modal-btn.secondary {
    background: var(--cream);
    color: var(--slate);
    border: 2px solid var(--border);
  }

  .cl-modal-btn.secondary:hover {
    background: var(--border);
    transform: translateY(-2px);
  }

  @media (max-width: 1000px) {
    .cl-table-header-row,
    .cl-row {
      grid-template-columns: 60px 1.2fr 1.5fr 1fr 0.8fr 140px;
      padding: 16px 20px;
      gap: 12px;
    }

    .cl-avatar, .cl-avatar-placeholder {
      width: 48px;
      height: 48px;
    }
  }

  @media (max-width: 800px) {
    .cl-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .cl-actions {
      width: 100%;
      flex-direction: column;
    }

    .cl-search-wrap {
      width: 100%;
      min-width: auto;
    }

    .cl-add-btn {
      width: 100%;
      justify-content: center;
    }

    .cl-table-header-row,
    .cl-row {
      grid-template-columns: 50px 1fr 1fr 100px;
      padding: 16px;
    }

    .cl-th:nth-child(4),
    .cl-th:nth-child(5),
    .cl-row > *:nth-child(4),
    .cl-row > *:nth-child(5) { 
      display: none; 
    }
  }
`;

export default function CoachList() {
  const [coaches, setCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewCoach, setViewCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { 
    fetchCoaches(); 
  }, []);

  const fetchCoaches = () => {
    setLoading(true);
    setError(null);
    axios.get('http://localhost:5000/api/coaches')
      .then(res => {
        setCoaches(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching coaches:', err);
        setError('Failed to load coaches. Please try again.');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this coach profile permanently?')) {
      axios.delete(`http://localhost:5000/api/coaches/${id}`)
        .then(() => {
          fetchCoaches();
        })
        .catch(err => {
          console.error('Error deleting coach:', err);
          alert('Failed to delete coach. Please try again.');
        });
    }
  };

  const getDesig = (coach) => {
    if (!coach || !coach.designation) return [];
    return Array.isArray(coach.designation) 
      ? coach.designation.filter(Boolean)
      : [coach.designation].filter(Boolean);
  };

  const getQuals = (coach) => {
    if (!coach || !coach.qualifications) return [];
    return Array.isArray(coach.qualifications)
      ? coach.qualifications.filter(Boolean)
      : [coach.qualifications].filter(Boolean);
  };

  const filteredCoaches = coaches.filter(coach => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase().trim();
    
    if (coach.name && coach.name.toLowerCase().includes(term)) return true;
    if (coach.district && coach.district.toLowerCase().includes(term)) return true;
    if (coach.phone && coach.phone.toLowerCase().includes(term)) return true;
    if (coach.zone && coach.zone.toLowerCase().includes(term)) return true;
    if (coach.employment && coach.employment.toLowerCase().includes(term)) return true;
    if (coach.licenseNumber && coach.licenseNumber.toLowerCase().includes(term)) return true;
    
    const designations = getDesig(coach);
    if (designations.some(d => d && d.toLowerCase().includes(term))) return true;
    
    const qualifications = getQuals(coach);
    if (qualifications.some(q => q && q.toLowerCase().includes(term))) return true;
    
    return false;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="cl-loading">
          <div className="cl-loading-spinner"></div>
          <div className="cl-empty-text">Loading coaches...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="cl-error">
          <div className="cl-error-icon">❌</div>
          <div className="cl-error-text">{error}</div>
          <button className="cl-retry-btn" onClick={fetchCoaches}>
            Try Again
          </button>
        </div>
      );
    }

    if (filteredCoaches.length === 0) {
      return (
        <div className="cl-empty">
          <div className="cl-empty-icon">🏏</div>
          {searchTerm ? (
            <>
              <div className="cl-empty-text">No coaches found matching "{searchTerm}"</div>
              <div className="cl-empty-subtext">Try adjusting your search terms</div>
            </>
          ) : (
            <>
              <div className="cl-empty-text">No coaches registered yet</div>
              <div className="cl-empty-subtext">Click "Add New Coach" to get started</div>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="cl-table-body">
        {filteredCoaches.map((coach, idx) => (
          <div className="cl-row" key={coach._id || idx} style={{ animationDelay: `${idx * 0.04}s` }}>
            <div>
              {coach.image ? (
                <img 
                  className="cl-avatar" 
                  src={`http://localhost:5000/uploads/${coach.image}`} 
                  alt={coach.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<div class="cl-avatar-placeholder">${coach.name?.charAt(0).toUpperCase() || '?'}</div>`;
                  }}
                />
              ) : (
                <div className="cl-avatar-placeholder">{coach.name?.charAt(0).toUpperCase() || '?'}</div>
              )}
            </div>
            <div className="cl-coach-info">
              <div className="cl-coach-name">{coach.name || '—'}</div>
              <div className="cl-coach-phone">{coach.phone || '—'}</div>
            </div>
            <div className="cl-badges">
              {getDesig(coach).map((d, i) => (
                <span key={i} className="cl-badge blue">{d}</span>
              ))}
              {getDesig(coach).length === 0 && <span className="cl-badge">—</span>}
            </div>
            <div className="cl-district">{coach.district || '—'}</div>
            <div className="cl-exp">
              {coach.coachingExperience ? (
                <><strong>{coach.coachingExperience}</strong> yrs</>
              ) : '—'}
            </div>
            <div className="cl-row-actions">
              <button className="cl-action-btn view" title="View Details" onClick={() => setViewCoach(coach)}>👁</button>
              <button className="cl-action-btn edit" title="Edit Coach" onClick={() => navigate(`/edit/${coach._id}`)}>✏️</button>
              <button className="cl-action-btn delete" title="Delete Coach" onClick={() => handleDelete(coach._id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cl-page">
        <div className="cl-topbar">
          <div className="cl-brand">
            <div className="cl-brand-icon">🏏</div>
            <span className="cl-brand-name">Southern Cricket <span>Authority</span></span>
          </div>
          <div className="cl-topbar-right">
            <div className="cl-topbar-dot" />
            System Online
          </div>
        </div>

        <div className="cl-container">
          <div className="cl-header">
            <div className="cl-title-block">
              <div className="cl-eyebrow">COACH REGISTRY</div>
              <div className="cl-title">
                Registered Coaches
                <span className="cl-count-badge">
                  🏆 {filteredCoaches.length} {filteredCoaches.length === 1 ? 'Coach' : 'Coaches'}
                </span>
              </div>
            </div>
            <div className="cl-actions">
              <div className="cl-search-wrap">
                <span className="cl-search-icon">🔍</span>
                <input
                  className="cl-search"
                  type="text"
                  placeholder="Search by name, district, designation..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  spellCheck="false"
                />
                {searchTerm && (
                  <button className="cl-clear-search" onClick={clearSearch}>
                    ✕
                  </button>
                )}
              </div>
              <button className="cl-add-btn" onClick={() => navigate('/add')}>
                <div className="cl-add-btn-icon">＋</div>
                Add New Coach
              </button>
            </div>
          </div>

          <div className="cl-table-card">
            <div className="cl-table-header-row">
              <div className="cl-th"></div>
              <div className="cl-th">Coach</div>
              <div className="cl-th">Designations</div>
              <div className="cl-th">District</div>
              <div className="cl-th">Exp.</div>
              <div className="cl-th center">Actions</div>
            </div>
            
            {renderContent()}
          </div>
        </div>

        {viewCoach && (
          <div className="cl-modal-overlay" onClick={(e) => e.target === e.currentTarget && setViewCoach(null)}>
            <div className="cl-modal">
              <div className="cl-modal-top">
                {viewCoach.image ? (
                  <img 
                    className="cl-modal-avatar" 
                    src={`http://localhost:5000/uploads/${viewCoach.image}`} 
                    alt={viewCoach.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<div class="cl-modal-avatar-placeholder">${viewCoach.name?.charAt(0).toUpperCase()}</div>`;
                    }}
                  />
                ) : (
                  <div className="cl-modal-avatar-placeholder">{viewCoach.name?.charAt(0).toUpperCase()}</div>
                )}
                <div>
                  <div className="cl-modal-name">{viewCoach.name}</div>
                  <div className="cl-modal-desig">
                    {getDesig(viewCoach).map((d, i) => (
                      <span key={i} className="cl-badge gold">{d}</span>
                    ))}
                  </div>
                </div>
                <button className="cl-modal-close" onClick={() => setViewCoach(null)}>✕</button>
              </div>

              <div className="cl-modal-body">
                <div className="cl-modal-grid">
                  <div className="cl-detail-item">
                    <div className="cl-detail-label">📞 Phone Number</div>
                    <div className="cl-detail-value">{viewCoach.phone || '—'}</div>
                  </div>
                  <div className="cl-detail-item">
                    <div className="cl-detail-label">👤 Age & Gender</div>
                    <div className="cl-detail-value">
                      {viewCoach.age || '—'} yrs · {viewCoach.gender || '—'}
                    </div>
                  </div>
                  <div className="cl-detail-item">
                    <div className="cl-detail-label">🏫 Employment</div>
                    <div className="cl-detail-value">{viewCoach.employment || '—'}</div>
                  </div>
                  <div className="cl-detail-item">
                    <div className="cl-detail-label">📍 Location</div>
                    <div className="cl-detail-value">
                      {viewCoach.district || '—'} · {viewCoach.zone || '—'}
                    </div>
                  </div>
                  <div className="cl-detail-item">
                    <div className="cl-detail-label">🏏 Playing Experience</div>
                    <div className="cl-detail-value">{viewCoach.playingExperience || '—'}</div>
                  </div>
                  <div className="cl-detail-item">
                    <div className="cl-detail-label">⏱️ Coaching Experience</div>
                    <div className="cl-detail-value">
                      {viewCoach.coachingExperience ? `${viewCoach.coachingExperience} Years` : '—'}
                    </div>
                  </div>
                  <div className="cl-detail-item">
                    <div className="cl-detail-label">🪪 License Number</div>
                    <div className="cl-detail-value">{viewCoach.licenseNumber || '—'}</div>
                  </div>

                  <div className="cl-detail-item full">
                    <div className="cl-detail-label">🎓 Coaching Qualifications</div>
                    <div className="cl-badges" style={{ marginTop: 6 }}>
                      {getQuals(viewCoach).map((q, i) => (
                        <span key={i} className="cl-badge gold">{q}</span>
                      ))}
                      {getQuals(viewCoach).length === 0 && <span className="cl-badge">—</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="cl-modal-footer">
                <button className="cl-modal-btn secondary" onClick={() => setViewCoach(null)}>Close</button>
                <button className="cl-modal-btn primary" onClick={() => { 
                  setViewCoach(null); 
                  navigate(`/edit/${viewCoach._id}`);
                }}>Edit Profile</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}