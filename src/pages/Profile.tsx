import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ExamType } from '../types';

export function Profile() {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [exam, setExam] = useState<ExamType>(profile?.targetExam || 'JEE');
  const [year, setYear] = useState(profile?.targetYear || new Date().getFullYear());

  if (!profile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      targetExam: exam,
      targetYear: year
    });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0B]">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0">
        <div>
          <h2 className="text-xl font-serif italic text-white">Student Profile</h2>
        </div>
      </header>
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-2xl">
          <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden shadow-sm">
            {isEditing ? (
              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wide">Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wide">Target Examination</label>
                  <select value={exam} onChange={e => setExam(e.target.value as ExamType)} className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50">
                    <option value="JEE">JEE (Mains)</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="NEET-UG">NEET-UG</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wide">Target Year</label>
                  <input type="number" required min={2024} max={2030} value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="pt-4 flex space-x-3">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-400 font-medium rounded-lg hover:bg-white/5 border border-transparent">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 border border-indigo-500/30">Save Changes</button>
                </div>
              </form>
            ) : (
              <div className="p-6">
                <dl className="divide-y divide-white/5">
                  <div className="py-4 flex justify-between items-center">
                    <dt className="text-[10px] uppercase tracking-wide text-slate-500">Name</dt>
                    <dd className="text-sm text-white font-medium">{profile.name}</dd>
                  </div>
                  <div className="py-4 flex justify-between items-center">
                    <dt className="text-[10px] uppercase tracking-wide text-slate-500">Target Exam</dt>
                    <dd className="text-sm text-white font-medium">{profile.targetExam}</dd>
                  </div>
                  <div className="py-4 flex justify-between items-center">
                    <dt className="text-[10px] uppercase tracking-wide text-slate-500">Target Year</dt>
                    <dd className="text-sm text-white font-medium">{profile.targetYear}</dd>
                  </div>
                </dl>
                <div className="mt-8">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
