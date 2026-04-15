import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CoachList() {
  const [coaches, setCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewCoach, setViewCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Points to your Vercel hosting
  const API_URL = import.meta.env?.VITE_API_URL || 'https://sl-board-project.vercel.app';

  useEffect(() => { 
    fetchCoaches(); 
  }, []);

  const fetchCoaches = () => {
    setLoading(true);
    setError(null);
    axios.get(`${API_URL}/api/coaches?t=${new Date().getTime()}`)
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
      axios.delete(`${API_URL}/api/coaches/${id}`)
        .then(() => fetchCoaches())
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
    
    // ✅ Searches by Name OR NIC
    const matchName = coach.name && coach.name.toLowerCase().includes(term);
    const matchNic = coach.nic && coach.nic.toLowerCase().includes(term);
    
    return matchName || matchNic;
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-[50px] h-[50px] border-4 border-[#E8E0D0] border-t-[#C9A84C] rounded-full animate-spin"></div>
          <div className="text-[20px] font-semibold text-[#4A5568]">Loading coaches...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-[60px]">❌</div>
          <div className="text-[18px] text-[#C1121F]">{error}</div>
          <button 
            className="px-6 py-3 bg-[#C9A84C] rounded-[10px] text-[15px] font-semibold transition hover:bg-[#F0E4C2] hover:-translate-y-0.5" 
            onClick={fetchCoaches}
          >
            Try Again
          </button>
        </div>
      );
    }

    if (filteredCoaches.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center bg-white p-10">
          <div className="text-[80px] mb-6 opacity-50">🏏</div>
          {searchTerm ? (
            <>
              <div className="text-[20px] font-semibold text-[#4A5568] mb-2">No coaches found matching "{searchTerm}"</div>
              <div className="text-[15px] text-[#94A3B8]">Check the NIC or Name and try again</div>
            </>
          ) : (
            <>
              <div className="text-[20px] font-semibold text-[#4A5568] mb-2">No coaches registered yet</div>
              <div className="text-[15px] text-[#94A3B8]">Click "Add New Coach" to get started</div>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col min-h-[400px]">
        {filteredCoaches.map((coach, idx) => (
          <div 
            className="grid grid-cols-[50px_1fr_1fr_100px] md:grid-cols-[60px_1.2fr_1.5fr_1fr_0.8fr_140px] lg:grid-cols-[70px_1.2fr_1.8fr_1fr_0.8fr_160px] px-4 md:px-5 lg:px-6 py-4 gap-3 lg:gap-[15px] items-center border-b-2 border-[#E8E0D0] transition-colors cursor-default bg-white hover:bg-[#FDFBF7] last:border-b-0 animate-rowIn" 
            key={coach._id || idx} 
            style={{ animationDelay: `${idx * 0.04}s` }}
          >
            <div>
              {coach.image ? (
                <img 
                  className="w-[48px] h-[48px] lg:w-[52px] lg:h-[52px] rounded-full object-cover border-[3px] border-[#E8E0D0]" 
                  src={`${API_URL}/uploads/${coach.image}`} 
                  alt={coach.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<div class="w-[48px] h-[48px] lg:w-[52px] lg:h-[52px] rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#2D3561] flex items-center justify-center text-[#C9A84C] font-bold text-[20px] font-['Playfair_Display'] shrink-0 border-[3px] border-[#E8E0D0]">${coach.name?.charAt(0).toUpperCase() || '?'}</div>`;
                  }}
                />
              ) : (
                <div className="w-[48px] h-[48px] lg:w-[52px] lg:h-[52px] rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#2D3561] flex items-center justify-center text-[#C9A84C] font-bold text-[20px] font-['Playfair_Display'] shrink-0 border-[3px] border-[#E8E0D0]">
                  {coach.name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="font-bold text-[16px] text-[#1A1A2E]">{coach.name || '—'}</div>
              <div className="text-[13px] text-[#4A5568]">{coach.phone || '—'}</div>
            </div>
            
            <div className="flex flex-wrap gap-[6px]">
              {getDesig(coach).map((d, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-[12px] font-semibold tracking-[0.3px] bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">{d}</span>
              ))}
              {getDesig(coach).length === 0 && <span className="px-3 py-1 rounded-full text-[12px] font-semibold tracking-[0.3px] bg-gray-100 text-gray-500">—</span>}
            </div>
            
            <div className="hidden md:block text-[15px] text-[#4A5568] font-medium">{coach.district || '—'}</div>
            <div className="hidden md:block text-[14px] text-[#4A5568]">
              {coach.coachingExperience ? <><strong className="text-[#1A1A2E] font-bold text-[16px]">{coach.coachingExperience}</strong> yrs</> : '—'}
            </div>
            
            <div className="flex gap-2 justify-center">
              <button className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[16px] transition shrink-0 bg-[#F1F5F9] text-[#4A5568] hover:bg-[#E2E8F0] hover:scale-105" title="View Details" onClick={() => setViewCoach(coach)}>👁</button>
              <button className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[16px] transition shrink-0 bg-[#F0E4C2] text-[#92640A] hover:bg-[#E8D49A] hover:scale-105" title="Edit Coach" onClick={() => navigate(`/edit/${coach._id}`)}>✏️</button>
              <button className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[16px] transition shrink-0 bg-[#FFE5E7] text-[#C1121F] hover:bg-[#FFC9CC] hover:scale-105" title="Delete Coach" onClick={() => handleDelete(coach._id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes rowIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-rowIn { animation: rowIn 0.3s ease both; }
        .animate-slideUp { animation: slideUp 0.25s ease; }
        .animate-fadeIn { animation: fadeIn 0.2s ease; }
        .font-sans-custom { font-family: 'DM Sans', sans-serif; }
        .font-serif-custom { font-family: 'Playfair Display', serif; }
      `}</style>

      <div className="min-h-screen bg-[#FAF7F2] font-sans-custom flex flex-col" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(45,106,79,0.06) 0%, transparent 50%)' }}>
        
        <div className="bg-[#1A1A2E] px-6 lg:px-10 flex items-center justify-between h-[70px] border-b-[3px] border-[#C9A84C] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] bg-[#C9A84C] rounded-[10px] flex items-center justify-center text-[22px]">🏏</div>
            <span className="font-serif-custom text-white text-[20px] tracking-[0.5px] font-semibold">Southern Cricket <span className="text-[#C9A84C] font-bold">Authority</span></span>
          </div>
          <div className="flex items-center gap-[10px] text-[14px] text-white/70 bg-white/10 px-4 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
            System Online
          </div>
        </div>

        <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-6 py-[30px] flex-1">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-[30px] flex-wrap gap-5">
            <div className="flex flex-col">
              <div className="text-[12px] font-bold tracking-[3px] uppercase text-[#C9A84C] mb-2">COACH REGISTRY</div>
              <div className="font-serif-custom text-[42px] text-[#1A1A2E] leading-[1.1] flex items-center flex-wrap gap-[15px]">
                Registered Coaches
                <span className="inline-flex items-center gap-2 bg-[#1A1A2E] text-[#C9A84C] text-[14px] font-semibold px-4 py-1.5 rounded-full font-sans-custom">
                  🏆 {filteredCoaches.length} {filteredCoaches.length === 1 ? 'Coach' : 'Coaches'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-[15px] items-center w-full md:w-auto">
              <div className="relative w-full md:min-w-[320px]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A5568] text-[16px] pointer-events-none">🔍</span>
                <input
                  className="w-full py-[14px] pr-5 pl-12 border-2 border-[#E8E0D0] rounded-xl bg-white font-sans-custom text-[15px] text-[#1A1A2E] outline-none transition focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/15 placeholder:text-[#94A3B8] placeholder:text-[14px]"
                  type="text"
                  placeholder="Search by NIC and Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  spellCheck="false"
                />
                {searchTerm && (
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-[#94A3B8] text-[18px] w-6 h-6 flex items-center justify-center rounded-full transition hover:bg-[#F1F5F9] hover:text-[#1A1A2E]" onClick={() => setSearchTerm('')}>✕</button>
                )}
              </div>
              <button 
                className="group w-full md:w-auto flex justify-center md:justify-start items-center gap-[10px] px-7 py-[14px] bg-[#1A1A2E] text-white border-2 border-[#1A1A2E] rounded-xl font-sans-custom text-[15px] font-semibold transition hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:text-[#1A1A2E] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(201,168,76,0.3)] whitespace-nowrap" 
                onClick={() => navigate('/add')}
              >
                <div className="w-[22px] h-[22px] bg-white/15 rounded-md flex items-center justify-center text-[16px] font-semibold transition group-hover:bg-[#1A1A2E]/15">＋</div>
                Add New Coach
              </button>
            </div>
          </div>

          <div className="bg-white border-2 border-[#E8E0D0] rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(26,26,46,0.08)] flex flex-col min-h-[500px] w-full">
            <div className="grid grid-cols-[50px_1fr_1fr_100px] md:grid-cols-[60px_1.2fr_1.5fr_1fr_0.8fr_140px] lg:grid-cols-[70px_1.2fr_1.8fr_1fr_0.8fr_160px] px-4 md:px-5 lg:px-6 py-4 lg:py-[18px] bg-[#1A1A2E] gap-3 lg:gap-[15px] items-center shrink-0">
              <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-white/60"></div>
              <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-white/60">Coach</div>
              <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-white/60">Designations</div>
              <div className="hidden md:block text-[12px] font-bold tracking-[1.5px] uppercase text-white/60">District</div>
              <div className="hidden md:block text-[12px] font-bold tracking-[1.5px] uppercase text-white/60">Exp.</div>
              <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-white/60 text-center">Actions</div>
            </div>
            {renderContent()}
          </div>
        </div>

        {viewCoach && (
          <div className="fixed inset-0 bg-[#1A1A2E]/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-fadeIn" onClick={(e) => e.target === e.currentTarget && setViewCoach(null)}>
            <div className="bg-white rounded-[24px] w-[700px] max-w-full max-h-[90vh] overflow-y-auto shadow-[0_30px_70px_rgba(0,0,0,0.3)] animate-slideUp">
              
              <div className="bg-[#1A1A2E] p-[30px] rounded-t-[24px] flex items-center gap-5 relative">
                {viewCoach.image ? (
                  <img 
                    className="w-[80px] h-[80px] rounded-[16px] object-cover border-4 border-[#C9A84C]" 
                    src={`${API_URL}/uploads/${viewCoach.image}`} 
                    alt={viewCoach.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<div class="w-[80px] h-[80px] rounded-[16px] bg-gradient-to-br from-[#2D3561] to-[#1A1A2E] border-4 border-[#C9A84C] flex items-center justify-center font-serif text-[32px] text-[#C9A84C] shrink-0">${viewCoach.name?.charAt(0).toUpperCase()}</div>`;
                    }}
                  />
                ) : (
                  <div className="w-[80px] h-[80px] rounded-[16px] bg-gradient-to-br from-[#2D3561] to-[#1A1A2E] border-4 border-[#C9A84C] flex items-center justify-center font-serif-custom text-[32px] text-[#C9A84C] shrink-0">
                    {viewCoach.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-serif-custom text-[24px] text-white mb-2">{viewCoach.name}</div>
                  <div className="flex flex-wrap gap-[6px]">
                    {getDesig(viewCoach).map((d, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-[12px] font-semibold tracking-[0.3px] bg-[#F0E4C2] text-[#92640A] border border-[#E4C97C]">{d}</span>
                    ))}
                  </div>
                </div>
                <button className="absolute top-5 right-5 w-9 h-9 bg-white/10 rounded-[10px] text-white/70 flex items-center justify-center transition hover:bg-white/20 hover:text-white hover:scale-105" onClick={() => setViewCoach(null)}>✕</button>
              </div>

              <div className="p-[30px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-[#FAF7F2] border-2 border-[#E8E0D0] rounded-xl p-4">
                    <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#C9A84C] mb-1.5">📞 Phone Number</div>
                    <div className="text-[16px] text-[#1A1A2E] font-medium">{viewCoach.phone || '—'}</div>
                  </div>
                  <div className="bg-[#FAF7F2] border-2 border-[#E8E0D0] rounded-xl p-4">
                    <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#C9A84C] mb-1.5">👤 Age & Gender</div>
                    <div className="text-[16px] text-[#1A1A2E] font-medium">{viewCoach.age || '—'} yrs · {viewCoach.gender || '—'}</div>
                  </div>
                  <div className="bg-[#FAF7F2] border-2 border-[#E8E0D0] rounded-xl p-4">
                    <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#C9A84C] mb-1.5">🪪 NIC Number</div>
                    <div className="text-[16px] text-[#1A1A2E] font-medium">{viewCoach.nic || '—'}</div>
                  </div>
                  <div className="bg-[#FAF7F2] border-2 border-[#E8E0D0] rounded-xl p-4">
                    <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#C9A84C] mb-1.5">🏫 Employment</div>
                    <div className="text-[16px] text-[#1A1A2E] font-medium">{viewCoach.employment || '—'}</div>
                  </div>
                  <div className="bg-[#FAF7F2] border-2 border-[#E8E0D0] rounded-xl p-4">
                    <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#C9A84C] mb-1.5">📍 Location</div>
                    <div className="text-[16px] text-[#1A1A2E] font-medium">{viewCoach.district || '—'} · {viewCoach.zone || '—'}</div>
                  </div>
                  <div className="bg-[#FAF7F2] border-2 border-[#E8E0D0] rounded-xl p-4">
                    <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#C9A84C] mb-1.5">🏏 Playing Experience</div>
                    <div className="text-[16px] text-[#1A1A2E] font-medium">{viewCoach.playingExperience || '—'}</div>
                  </div>
                  <div className="bg-[#FAF7F2] border-2 border-[#E8E0D0] rounded-xl p-4">
                    <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#C9A84C] mb-1.5">⏱️ Coaching Experience</div>
                    <div className="text-[16px] text-[#1A1A2E] font-medium">{viewCoach.coachingExperience ? `${viewCoach.coachingExperience} Years` : '—'}</div>
                  </div>
                  <div className="bg-[#FAF7F2] border-2 border-[#E8E0D0] rounded-xl p-4">
                    <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#C9A84C] mb-1.5">🔖 License Number</div>
                    <div className="text-[16px] text-[#1A1A2E] font-medium">{viewCoach.licenseNumber || '—'}</div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 bg-[#FAF7F2] border-2 border-[#E8E0D0] rounded-xl p-4">
                    <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#C9A84C] mb-1.5">🎓 Coaching Qualifications</div>
                    <div className="flex flex-wrap gap-[6px] mt-1.5">
                      {getQuals(viewCoach).map((q, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-[12px] font-semibold tracking-[0.3px] bg-[#F0E4C2] text-[#92640A] border border-[#E4C97C]">{q}</span>
                      ))}
                      {getQuals(viewCoach).length === 0 && <span className="px-3 py-1 rounded-full text-[12px] font-semibold tracking-[0.3px] bg-gray-100 text-gray-500">—</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-[30px] py-5 border-t-2 border-[#E8E0D0] flex gap-[15px]">
                <button 
                  className="flex-1 py-[14px] rounded-xl font-sans-custom text-[15px] font-semibold transition bg-[#FAF7F2] text-[#4A5568] border-2 border-[#E8E0D0] hover:bg-[#E8E0D0] hover:-translate-y-0.5" 
                  onClick={() => setViewCoach(null)}
                >
                  Close
                </button>
                <button 
                  className="flex-1 py-[14px] rounded-xl font-sans-custom text-[15px] font-semibold transition bg-[#1A1A2E] text-white hover:bg-[#C9A84C] hover:text-[#1A1A2E] hover:-translate-y-0.5" 
                  onClick={() => { 
                    setViewCoach(null); 
                    navigate(`/edit/${viewCoach._id}`);
                  }}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  ); 
}