'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  Users, 
  Database, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  ChevronRight, 
  Plus, 
  LayoutDashboard,
  BarChart3,
  History,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function InstructorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/instructor/stats');
        const json = await res.json();
        setData(json);
      } catch (err) {
        toast.error('Failed to load dashboard statistics');
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Questions', value: data?.stats?.totalQuestions ?? '0', icon: <Database size={20} />, color: 'blue' },
    { label: 'Active Students', value: data?.stats?.totalStudents ?? '0', icon: <Users size={20} />, color: 'emerald' },
    { label: 'Class Accuracy', value: (data?.stats?.avgAccuracy ?? '0') + '%', icon: <TrendingUp size={20} />, color: 'lime' },
  ];

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      
      {/* Hero Welcome - Mobile Optimized */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-zinc-200 dark:border-white/5">
         <div className="space-y-3 sm:space-y-4 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none">
               Main <br className="hidden lg:block" />
               <span className="text-zinc-500">Dashboard.</span>
            </h1>
            <p className="text-zinc-500 font-medium text-sm sm:text-base md:text-lg max-w-sm">
               Manage your questions and see how your students are doing.
            </p>
         </div>

         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
            <Link href="/instructor/questions" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white dark:bg-[#BFFF00] dark:text-black dark:border-none text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3">
               Add Question
               <Plus size={16} />
            </Link>
            <Link href="/instructor/analytics" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 dark:bg-white/5 dark:border-white/10 dark:text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/10 transition-all flex items-center justify-center">
               Deep Intel
            </Link>
         </div>
      </section>

      {/* Main Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
         {stats.map((stat, i) => (
            <motion.div 
               key={i} 
               whileHover={{ y: -4 }}
               className={`p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-card border border-border/5 shadow-sm ${
                  i === 2 ? 'col-span-2 lg:col-span-1' : ''
               }`}
            >
               <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-6">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl bg-zinc-50 dark:bg-white/5 flex items-center justify-center text-zinc-400 shrink-0">
                     {stat.icon}
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                     <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                     <p className="text-xl sm:text-4xl font-black leading-none">{stat.value}</p>
                  </div>
               </div>
            </motion.div>
         ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
         <section className="lg:col-span-8 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
               <Link href="/instructor/questions" className="group">
                  <div className="h-full p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-card border border-border/5 hover:border-[#BFFF00] transition-all shadow-sm space-y-8 sm:space-y-12">
                     <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-[#BFFF00] transition-colors">
                        <Database size={24} />
                     </div>
                     <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">Manage Questions</h3>
                        <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed">
                           Add, edit, or remove questions from your bank. Use AI to help you write them faster.
                        </p>
                     </div>
                     <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        Manage Questions <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                  </div>
               </Link>

               <Link href="/instructor/students" className="group">
                  <div className="h-full p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-card border border-border/5 hover:border-blue-500 transition-all shadow-sm space-y-8 sm:space-y-12">
                     <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-blue-400 transition-colors">
                        <Users size={24} />
                     </div>
                     <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">Manage Students</h3>
                        <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed">
                           See a list of all students, their scores, and who might need extra help.
                        </p>
                     </div>
                     <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        Manage Students <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                  </div>
               </Link>
            </div>

            {/* Recent Activity Stream - Mobile Optimized */}
            <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-card border border-border/5 shadow-sm space-y-6 sm:space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                     <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <History size={18} />
                     </div>
                     <h3 className="text-lg sm:text-xl font-bold tracking-tight">Recent Activity</h3>
                  </div>
               </div>

               <div className="space-y-3 sm:space-y-4">
                  {data?.latestActivity?.length > 0 ? data.latestActivity.map((act: any, i: number) => (
                     <div key={i} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 flex items-center justify-between group hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-3 sm:gap-6">
                           <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-black text-[8px] sm:text-[10px] text-zinc-500 group-hover:text-[#BFFF00] transition-colors uppercase">
                              {act.name.charAt(0)}
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-xs sm:text-sm font-bold truncate max-w-[120px] sm:max-w-none">{act.name}</p>
                              <p className="text-[8px] sm:text-[10px] text-zinc-500 font-medium uppercase tracking-widest">{act.action}</p>
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                           <p className={`text-[10px] sm:text-xs font-black uppercase ${act.score === 'Correct' ? 'text-[#BFFF00]' : 'text-red-500'}`}>{act.score}</p>
                           <p className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase">{act.time}</p>
                        </div>
                     </div>
                  )) : (
                     <p className="text-center py-8 sm:py-10 text-zinc-500 font-medium text-sm">No recent activity yet.</p>
                  )}
               </div>
            </div>
         </section>

         {/* Sidebar Stats - Mobile Optimized */}
         <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            <Link href="/instructor/analytics" className="block group">
               <div className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black text-white dark:bg-white/5 border border-white/10 space-y-6 sm:space-y-8 hover:border-[#BFFF00]/50 transition-all shadow-2xl">
                  <div className="flex items-center justify-between">
                     <BarChart3 size={20} className="text-[#BFFF00]" />
                     <ArrowUpRight size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                     <h4 className="text-lg sm:text-xl font-black uppercase tracking-tight">Overall Stats</h4>
                     <p className="text-[9px] sm:text-[10px] font-medium text-zinc-400 leading-relaxed uppercase tracking-widest">
                        See how everything is running.
                     </p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                     <div className="text-center">
                        <p className="text-[7px] sm:text-[8px] font-bold text-zinc-500 uppercase">Load</p>
                        <p className="text-[10px] sm:text-xs font-black">98.2%</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[7px] sm:text-[8px] font-bold text-zinc-500 uppercase">Latency</p>
                        <p className="text-[10px] sm:text-xs font-black">12ms</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[7px] sm:text-[8px] font-bold text-zinc-500 uppercase">Uptime</p>
                        <p className="text-[10px] sm:text-xs font-black">99.9%</p>
                     </div>
                  </div>
               </div>
            </Link>

            <div className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-card border border-border/5 shadow-sm space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                   <History size={16} className="text-zinc-400" />
                   <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">System Feed</h4>
                </div>
                <div className="space-y-3 sm:space-y-4">
                   {[
                      { text: 'Engine calibrated successfully', time: '12m ago' },
                      { text: 'New node deployed to repository', time: '45m ago' },
                      { text: 'System backup complete', time: '2h ago' },
                   ].map((item, i) => (
                      <div key={i} className="flex gap-3 sm:gap-4 items-start">
                         <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#BFFF00] shrink-0" />
                         <div className="space-y-0.5">
                            <p className="text-[11px] sm:text-xs font-medium leading-none">{item.text}</p>
                            <p className="text-[8px] sm:text-[9px] text-zinc-500 font-bold uppercase">{item.time}</p>
                         </div>
                      </div>
                   ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
