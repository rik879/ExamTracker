import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ExamType } from '../types';

export function Onboarding() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.displayName || '');
  const [exam, setExam] = useState<ExamType>('JEE');
  const [year, setYear] = useState(new Date().getFullYear() + 1);

  useEffect(() => {
    if (profile) {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      targetExam: exam,
      targetYear: year
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] px-4 font-sans text-slate-200">
      <div className="bg-[#111114] p-8 rounded-2xl border border-white/5 max-w-md w-full shadow-2xl">
        <h2 className="text-xl font-serif italic text-white mb-6">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wide">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wide">Target Examination</label>
            <select
              value={exam}
              onChange={e => setExam(e.target.value as ExamType)}
              className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            >
              <option value="JEE">JEE (Mains)</option>
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="NEET-UG">NEET-UG</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wide">Target Year</label>
            <input
              type="number"
              required
              min={2024}
              max={2030}
              value={year}
              onChange={e => setYear(parseInt(e.target.value))}
              className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors mt-8 border border-indigo-500/30"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
