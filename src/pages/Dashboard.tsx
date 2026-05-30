import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, Target, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export function Dashboard() {
  const { profile } = useAuth();

  if (!profile) return null;

  const getSubjects = () => {
    if (profile.targetExam === 'NEET-UG') {
      return ['Physics', 'Chemistry', 'Botany', 'Zoology'];
    }
    return ['Physics', 'Chemistry', 'Mathematics'];
  };

  const subjects = getSubjects();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0B]">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0">
        <div>
          <h2 className="text-xl font-serif italic text-white">Student Dashboard</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Target: {profile.targetExam} {profile.targetYear}</p>
        </div>
      </header>
      <div className="flex-1 p-10 flex flex-col gap-8 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-serif italic text-white tracking-tight">Welcome, {profile.name}</h1>
          <p className="mt-2 text-sm text-slate-400">Select a subject to track unit tests, or view full mock tests.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(sub => (
            <Link
              key={sub}
              to={`/dashboard/${sub.toLowerCase()}`}
              className="bg-[#111114] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col min-h-[140px] group"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-900/30 border border-indigo-500/20 rounded-lg text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200">{sub}</h3>
              </div>
              <div className="mt-auto flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                <span>View Trend</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}

          <Link
            to={`/full-mocks`}
            className="bg-indigo-900/10 p-6 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-colors flex flex-col min-h-[140px] group"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Full Mock Tests</h3>
            </div>
            <div className="mt-auto flex items-center justify-between text-xs text-indigo-300/70 uppercase tracking-widest group-hover:text-indigo-300 transition-colors">
              <span>Overall Performance</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
