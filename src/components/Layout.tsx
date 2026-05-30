import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Target } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  if (profile?.targetExam !== 'NEET-UG') {
    navItems.push({ label: 'Full Mock Tests', icon: Target, path: '/full-mocks' });
  } else {
    navItems.push({ label: 'Full Mock Tests', icon: Target, path: '/full-mocks' });
  }

  return (
    <div className="w-full h-screen bg-[#0A0A0B] text-slate-200 font-sans flex overflow-hidden">
      <aside className="w-72 bg-[#111114] border-r border-white/5 flex flex-col p-6 overflow-y-auto shrink-0">
        <div className="mb-10 px-2">
          <h1 className="text-2xl font-serif italic text-white tracking-tight">Exam<span className="text-indigo-400">Tracker</span></h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">Competitive Advantage Tool</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors border",
                  isActive
                    ? "bg-white/5 text-indigo-400 border-white/10"
                    : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="p-4 bg-[#1A1A1D] rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-200 font-bold border border-indigo-500/30">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-white">{profile?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 truncate">ID: {profile?.targetExam}-{profile?.targetYear}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 ml-2 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
