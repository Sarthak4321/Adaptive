'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
   Trophy,
   Target,
   Clock,
   ArrowRight,
   Activity,
   LogOut,
   ChevronRight
} from 'lucide-react';
import CustomCursor from '@/components/CustomCursor';

interface Stats {
   totalAttempts: number;
   correctAttempts: number;
   accuracy: number;
   avgTime: number;
   recentAttempts: any[];
}

export default function StudentDashboard() {
   const [stats, setStats] = useState<Stats | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetch('/api/student/stats')
         .then(res => res.json())
         .then(data => {
            setStats(data);
            setLoading(false);
         });
   }, []);

   const handleLogout = async () => {
      try {
         await fetch('/api/auth/logout', { method: 'POST' });
         window.location.href = '/login';
      } catch (error) {
         console.error('Logout error:', error);
         window.location.href = '/login';
      }
   };

   if (loading) {
      return (
         <div className="flex min-h-screen items-center justify-center bg-[#0A0514]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#BFFF00] border-t-transparent shadow-[0_0_15px_#BFFF00]" />
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#0A0514] text-white selection:bg-[#BFFF00] selection:text-black overflow-x-hidden relative">
         <CustomCursor />

         {/* Persistent Background Effects */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#BFFF00]/5 blur-[120px]" />
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/5 blur-[120px]" />
         </div>

         <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
               <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl font-bold tracking-tight uppercase">Adaptive.</span>
                  <span className="text-[8px] sm:text-[10px] bg-[#BFFF00]/10 text-[#BFFF00] px-1.5 sm:px-2 py-0.5 rounded border border-[#BFFF00]/20 font-bold uppercase tracking-widest">Student Node</span>
               </div>
               <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
               >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Exit</span>
               </button>
            </div>
         </nav>

         <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 pb-20 relative z-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 mb-12 sm:mb-16">
               <div className="space-y-3 sm:space-y-4">
                  <motion.h1
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase leading-tight"
                  >
                     The Dashboard.
                  </motion.h1>
                  <p className="text-zinc-500 font-medium text-base sm:text-lg">Measure proficiency. Accelerate mastery.</p>
               </div>

               <Link
                  href="/student/practice"
                  className="group flex h-12 sm:h-14 w-full sm:w-auto items-center justify-center gap-4 rounded-xl sm:rounded-2xl bg-white px-6 sm:px-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#BFFF00] active:scale-95 shadow-2xl"
               >
                  Enter Practice Pod
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               </Link>
            </div>

            {/* Stats Bento Grid */}
            <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-3">
               {[
                  { label: "Attempts", val: stats?.totalAttempts || 0, unit: "Quests", icon: <Target className="h-4 w-4 sm:h-5 sm:w-5" /> },
                  { label: "Accuracy", val: stats?.accuracy || 0, unit: "%", icon: <Trophy className="h-4 w-4 sm:h-5 sm:w-5" /> },
                  { label: "Velocity", val: stats?.avgTime || 0, unit: "Sec", icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5" /> }
               ].map((stat, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className={`group relative rounded-2xl sm:rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-8 backdrop-blur-xl hover:bg-white/[0.04] transition-all ${
                        i === 2 ? 'col-span-2 lg:col-span-1' : ''
                     }`}
                  >
                     <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-6">
                        <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-zinc-500 group-hover:text-[#BFFF00] transition-colors">
                           {stat.icon}
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                           <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</p>
                           <div className="flex items-baseline gap-1.5 sm:gap-2">
                              <span className="text-2xl sm:text-5xl font-bold text-white tracking-tighter">{stat.val}</span>
                              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-zinc-600 group-hover:text-[#BFFF00] transition-colors">{stat.unit}</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>


            {/* Activity Log */}
            <div className="mt-12 sm:mt-16 rounded-3xl border border-white/5 bg-[#0A0514] overflow-hidden shadow-2xl relative">
               <div className="absolute inset-0 bg-[#BFFF00]/[0.01] pointer-events-none" />
               <div className="border-b border-white/5 bg-white/[0.02] px-6 sm:px-10 py-6 sm:py-8 flex items-center justify-between">
                  <div className="space-y-1">
                     <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight">Recent Sessions</h3>
                     <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Performance History Node</p>
                  </div>
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-800" />
               </div>

               {/* Table for Desktop */}
               <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
                           <th className="px-10 py-6">ID Pulse</th>
                           <th className="px-10 py-6 text-center">Status</th>
                           <th className="px-10 py-6">Velocity</th>
                           <th className="px-10 py-6 text-right">Timestamp</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5 text-xs">
                        {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
                           stats.recentAttempts.map((attempt, i) => (
                              <tr key={attempt.id} className="group hover:bg-white/[0.02] transition-colors">
                                 <td className="px-10 py-6 font-mono text-[10px] text-zinc-600">
                                    {attempt.id.slice(0, 8)}
                                 </td>
                                 <td className="px-10 py-6">
                                    <div className="flex items-center justify-center gap-3">
                                       <div className={`h-1.5 w-1.5 rounded-full ${attempt.isCorrect ? 'bg-[#BFFF00] shadow-[0_0_10px_#BFFF00]' : 'bg-red-500'}`} />
                                       <span className={`font-bold uppercase tracking-widest text-[10px] ${attempt.isCorrect ? 'text-white' : 'text-zinc-600'}`}>
                                          {attempt.isCorrect ? 'Valid' : 'Failed'}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-6 text-zinc-400 font-bold uppercase tracking-widest">{attempt.timeTaken}s</td>
                                 <td className="px-10 py-6 text-right text-zinc-600 font-bold">
                                    {new Date(attempt.createdAt).toLocaleDateString()}
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan={4} className="px-10 py-20 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-white/[0.01]">
                                 Historical data empty. Initiate first session.
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>

               {/* Mobile List View */}
               <div className="sm:hidden divide-y divide-white/5">
                  {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
                     stats.recentAttempts.map((attempt) => (
                        <div key={attempt.id} className="p-6 space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-tighter">#{attempt.id.slice(0, 8)}</span>
                              <span className="text-[10px] text-zinc-600 font-bold">{new Date(attempt.createdAt).toLocaleDateString()}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <div className={`h-1.5 w-1.5 rounded-full ${attempt.isCorrect ? 'bg-[#BFFF00] shadow-[0_0_10px_#BFFF00]' : 'bg-red-500'}`} />
                                 <span className={`font-bold uppercase tracking-widest text-[10px] ${attempt.isCorrect ? 'text-white' : 'text-zinc-600'}`}>
                                    {attempt.isCorrect ? 'Valid Calibration' : 'Calibration Failed'}
                                 </span>
                              </div>
                              <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">{attempt.timeTaken}s</span>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="px-6 py-12 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-white/[0.01]">
                        Historical data empty.
                     </div>
                  )}
               </div>
            </div>
         </main>
      </div>
   );
}

