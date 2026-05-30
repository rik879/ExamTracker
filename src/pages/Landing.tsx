import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export function Landing() {
  const { user, profile, loading, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      navigate('/dashboard');
    } else if (user && !profile) {
      navigate('/onboarding');
    }
  }, [user, profile, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] text-slate-400 font-sans">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0B] px-4 font-sans text-slate-200">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-serif italic text-white tracking-tight">Exam<span className="text-indigo-400">Tracker</span></h1>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Competitive Advantage Tool
          </p>
          <p className="mt-6 text-sm text-slate-400">
            Securely log your mock test results, track performance across subjects, and prepare effectively for JEE & NEET.
          </p>
        </div>
        <button
          onClick={signIn}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors border border-indigo-500/30"
        >
          <LogIn className="w-5 h-5" />
          <span>Sign In with Google</span>
        </button>
      </div>
    </div>
  );
}
