import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, setDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';
import { FullMockTest } from '../types';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';

export function FullMockPage() {
  const { profile, user } = useAuth();
  const [logs, setLogs] = useState<FullMockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [total, setTotal] = useState('');
  const [attempted, setAttempted] = useState('');
  const [correct, setCorrect] = useState('');
  const [hasNegative, setHasNegative] = useState(true);
  const [dateStr, setDateStr] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, `users/${user.uid}/fullMockTests`),
        orderBy('testDate', 'asc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data() as FullMockTest);
      setLogs(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/fullMockTests`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const totalNum = Number(total);
    const attemptedNum = Number(attempted);
    const correctNum = Number(correct);
    const dateNum = new Date(dateStr).getTime();
    
    // Validate
    if (attemptedNum > totalNum) {
      alert("Attempted questions cannot exceed Total questions");
      return;
    }
    if (correctNum > attemptedNum) {
      alert("Correct answers cannot exceed Attempted questions");
      return;
    }
    
    const wrongNum = attemptedNum - correctNum;
    const score = hasNegative ? (correctNum * 4) - wrongNum : (correctNum * 4);
    const maxScore = totalNum * 4;
    const percentageNum = maxScore === 0 ? 0 : parseFloat(((score / maxScore) * 100).toFixed(2));
    
    const testId = Date.now().toString();
    const newLog: FullMockTest = {
      id: testId,
      userId: user.uid,
      totalQuestions: totalNum,
      attemptedQuestions: attemptedNum,
      correctAnswers: correctNum,
      wrongAnswers: wrongNum,
      hasNegativeMarking: hasNegative,
      score,
      percentage: percentageNum,
      testDate: dateNum,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    try {
      await setDoc(doc(db, `users/${user.uid}/fullMockTests`, testId), newLog);
      setLogs([...logs, newLog].sort((a,b) => a.testDate - b.testDate));
      setIsModalOpen(false);
      setTotal('');
      setAttempted('');
      setCorrect('');
      setHasNegative(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/fullMockTests/${testId}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/fullMockTests`, id));
      setLogs(logs.filter(log => log.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/fullMockTests/${id}`);
    }
  };

  const chartData = logs.map(log => ({
    date: format(new Date(log.testDate), 'MMM dd'),
    percentage: log.percentage
  }));

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0B]">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0">
        <div>
          <h2 className="text-xl font-serif italic text-white">Full Mock Tests</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Overall Exam Readiness</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors border border-indigo-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Mock Test Log</span>
        </button>
      </header>

      <div className="flex-1 p-10 flex flex-col xl:flex-row gap-8 overflow-y-auto">
        <div className="flex-1 flex flex-col gap-8">
          {logs.length > 0 ? (
            <div className="bg-[#111114] p-6 rounded-2xl border border-white/5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Performance Graph</h3>
                <div className="flex gap-4 text-[10px] uppercase tracking-tighter text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>Percentage</span>
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis dataKey="percentage" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1A1D', borderRadius: '8px', border: '1px solid #ffffff10', color: '#f8fafc' }}
                      itemStyle={{ color: '#8b5cf6' }}
                    />
                    <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="bg-[#111114] p-12 text-center rounded-2xl border border-white/5 border-dashed">
              <p className="text-slate-500 text-sm">No full mock test logs yet. Add one to see your progress graph!</p>
            </div>
          )}
        </div>

        <div className="w-full xl:w-[400px] shrink-0">
          <div className="bg-[#111114] rounded-2xl border border-white/5 flex flex-col h-full max-h-[600px] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-[#1A1A1D]">
              <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Recent Entries</h3>
            </div>
            <ul className="divide-y divide-white/5 overflow-y-auto">
              {logs.map((log) => (
                <li key={log.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/5 transition-colors">
                  <div>
                    <div className="font-semibold text-white">{format(new Date(log.testDate), 'MMM do, yyyy')}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider flex space-x-3">
                      <span>Total: {log.totalQuestions || '-'}</span>
                      <span>Att: {log.attemptedQuestions || '-'}</span>
                      <span className="text-emerald-500">✔ {log.correctAnswers || '-'}</span>
                      <span className="text-emerald-500">Score: {log.score || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xl font-serif italic text-indigo-400">{log.percentage}%</div>
                    </div>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
              {logs.length === 0 && (
                <li className="p-6 text-center text-slate-500 text-sm">No recent entries.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111114] rounded-2xl border border-white/5 shadow-2xl max-w-md w-full p-8">
            <h2 className="text-xl font-serif italic text-white mb-6">Add Full Mock Test</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wide">Date</label>
                <input type="date" required value={dateStr} onChange={e => setDateStr(e.target.value)} className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50" style={{ colorScheme: 'dark' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wide">Total Questions</label>
                  <input type="number" required min="1" value={total} onChange={e => setTotal(e.target.value)} className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wide">Attempted</label>
                  <input type="number" required min="0" value={attempted} onChange={e => setAttempted(e.target.value)} className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wide">Correct Answers</label>
                <input type="number" required min="0" value={correct} onChange={e => setCorrect(e.target.value)} className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="negMarkingFull" checked={hasNegative} onChange={e => setHasNegative(e.target.checked)} className="rounded border-none bg-[#1A1A1D] checked:bg-indigo-500" />
                <label htmlFor="negMarkingFull" className="text-sm text-slate-300">Enable Negative Marking (-1 for wrong)</label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white font-medium hover:bg-white/5 rounded-lg border border-transparent transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors border border-indigo-500/30">Save Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
