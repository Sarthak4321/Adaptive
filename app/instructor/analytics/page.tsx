'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
   TrendingUp,
   TrendingDown,
   Target,
   Search,
   Filter,
   ArrowUpRight,
   User,
   Clock,
   ChevronRight,
   Flame,
   Award,
   CircleDashed,
   Activity,
   BarChart3,
   PieChart,
   History,
   Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function InstructorAnalyticsPage() {
   const [data, setData] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [range, setRange] = useState('7d');

   useEffect(() => {
      async function fetchAnalytics() {
         setLoading(true);
         try {
            const res = await fetch(`/api/instructor/analytics?range=${range}`);
            const json = await res.json();
            setData(json);
         } catch (err) {
            toast.error('Failed to load analytics data');
            console.error('Analytics load error:', err);
         } finally {
            setLoading(false);
         }
      }
      fetchAnalytics();
   }, [range]);

   // Difficulty Data calculation moved inside return or handled for loading
   const difficultyData = [
      { label: 'EASY', height: `${data?.difficultyBreakdown?.easy?.pct ?? 0}%`, color: '#10B981', val: `${data?.difficultyBreakdown?.easy?.pct ?? 0}%`, count: data?.difficultyBreakdown?.easy?.count ?? 0 },
      { label: 'MEDIUM', height: `${data?.difficultyBreakdown?.medium?.pct ?? 0}%`, color: '#F59E0B', val: `${data?.difficultyBreakdown?.medium?.pct ?? 0}%`, count: data?.difficultyBreakdown?.medium?.count ?? 0 },
      { label: 'HARD', height: `${data?.difficultyBreakdown?.hard?.pct ?? 0}%`, color: '#EF4444', val: `${data?.difficultyBreakdown?.hard?.pct ?? 0}%`, count: data?.difficultyBreakdown?.hard?.count ?? 0 },
   ];

   const downloadReport = () => {
      if (!data) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
         toast.error('Please allow popups to generate the report');
         return;
      }

      const reportHtml = `
      <html>
        <head>
          <title>Institutional Performance Report - ${new Date().toLocaleDateString()}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; color: #000; padding: 60px; line-height: 1.6; background: #fff; }
            .header { border-bottom: 3px solid #000; padding-bottom: 30px; margin-bottom: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 28px; font-weight: 900; letter-spacing: -1.5px; margin-bottom: 10px; }
            .title { font-size: 56px; font-weight: 900; text-transform: uppercase; letter-spacing: -3px; margin: 0; line-height: 0.85; }
            .meta { font-size: 11px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
            
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 60px; }
            .stat-card { border: 1px solid #eee; padding: 25px; border-radius: 16px; background: #fafafa; }
            .stat-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
            .stat-value { font-size: 42px; font-weight: 900; letter-spacing: -1px; }
            
            .section-title { font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; border-bottom: 2px solid #f0f0f0; padding-bottom: 12px; margin-bottom: 30px; margin-top: 50px; color: #333; }
            
            .chart-row { display: flex; align-items: flex-end; gap: 15px; height: 240px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; margin-bottom: 40px; padding-top: 30px; }
            .chart-bar { flex: 1; background: #000; border-radius: 6px 6px 0 0; position: relative; transition: height 1s ease; }
            .chart-bar-label { position: absolute; bottom: -30px; left: 0; width: 100%; text-align: center; font-size: 11px; font-weight: 700; color: #666; }
            .chart-bar-value { position: absolute; top: -25px; left: 0; width: 100%; text-align: center; font-size: 11px; font-weight: 900; }
            
            .footer { margin-top: 100px; font-size: 11px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 30px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
            @page { margin: 0; }
            @media print { 
              body { padding: 40px; }
              .chart-bar { -webkit-print-color-adjust: exact; background-color: #000 !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">ADAPTIVE.</div>
              <h1 class="title">INSTITUTIONAL<br/>STATS.</h1>
            </div>
            <div style="text-align: right">
              <div class="meta">Report ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              <div class="meta">Sequence: PRD-${new Date().getTime().toString().slice(-6)}</div>
              <div class="meta">Generated: ${new Date().toLocaleString()}</div>
            </div>
          </div>

          <div class="section-title">Core Performance Metrics</div>
          <div class="grid">
            <div class="stat-card">
              <div class="stat-label">Global Questions</div>
              <div class="stat-value">${data.totalQuestions}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Student Engagement</div>
              <div class="stat-value">${data.totalAttempts}</div>
            </div>
            <div class="stat-card" style="background: #000; color: #fff;">
              <div class="stat-label" style="color: #666">Avg. Accuracy</div>
              <div class="stat-value" style="color: #BFFF00">${data.overallAccuracy}%</div>
            </div>
          </div>

          <div class="section-title">Cognitive Complexity Distribution</div>
          <div class="grid">
             <div class="stat-card" style="border-left: 6px solid #10B981">
                <div class="stat-label">Elementary Level</div>
                <div class="stat-value">${data.difficultyBreakdown.easy.pct}%</div>
             </div>
             <div class="stat-card" style="border-left: 6px solid #F59E0B">
                <div class="stat-label">Intermediate Level</div>
                <div class="stat-value">${data.difficultyBreakdown.medium.pct}%</div>
             </div>
             <div class="stat-card" style="border-left: 6px solid #EF4444">
                <div class="stat-label">Advanced Level</div>
                <div class="stat-value">${data.difficultyBreakdown.hard.pct}%</div>
             </div>
          </div>

          <div class="section-title">Institutional Accuracy Drift (7D)</div>
          <div class="chart-row">
            ${data.dailyAccuracy.map((val: number, i: number) => `
              <div class="chart-bar" style="height: ${val}%">
                <div class="chart-bar-value">${val}%</div>
                <div class="chart-bar-label">D${i + 1}</div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            Confidential Institutional Analysis &bull; Generated by Adaptive Engine v1.0 &bull; &copy; ${new Date().getFullYear()}
          </div>

          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

      printWindow.document.write(reportHtml);
      printWindow.document.close();

      toast.success('Professional report generated successfully');
   };

   return (
      <div className="space-y-8 sm:space-y-16 pb-20">
         {/* Header Section - Mobile Optimized */}
         <section className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 sm:gap-10 pt-6 sm:pt-0">
            <div className="space-y-4 w-full lg:w-auto text-center lg:text-left">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mx-auto lg:mx-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3B82F6]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Live Statistics</span>
               </div>
               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none text-zinc-900 dark:text-white">
                  School <span className="text-zinc-500">Stats.</span>
               </h1>
               <p className="text-zinc-500 font-medium text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
                  Real-time analysis of question difficulty and class performance across the cognitive spectrum.
               </p>
            </div>

            <div className="flex w-full lg:w-auto">
               <button
                  onClick={downloadReport}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#BFFF00] text-black text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(191,255,0,0.3)] transition-all"
               >
                  Download Report
                  <ChevronRight size={14} />
               </button>
            </div>
         </section>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            <section className="lg:col-span-8 space-y-8 sm:space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* Accuracy History */}
                  <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-white dark:bg-card border border-zinc-200 dark:border-border/10 space-y-6 sm:space-y-8 shadow-xl">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <h3 className="text-[9px] sm:text-xs font-black text-zinc-500 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Accuracy Drift</h3>
                           <div className="flex items-center gap-2">
                              <button
                                 onClick={() => setRange('7d')}
                                 className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${range === '7d' ? 'bg-[#BFFF00] text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                              >7D</button>
                              <button
                                 onClick={() => setRange('30d')}
                                 className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${range === '30d' ? 'bg-[#BFFF00] text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                              >30D</button>
                           </div>
                        </div>
                        <TrendingUp className="h-4 w-4 text-zinc-300" />
                     </div>
                     <div className="h-40 sm:h-48 flex items-end justify-between gap-0.5 sm:gap-1">
                        {loading ? (
                           Array.from({ length: range === '7d' ? 7 : 30 }).map((_, i) => (
                              <Skeleton key={i} className="flex-1 h-full rounded-t-lg" />
                           ))
                        ) : (
                           data?.dailyAccuracy?.map((val: number, i: number) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full">
                                 <div className="relative w-full h-full flex flex-col justify-end">
                                    <motion.div
                                       initial={{ height: 0 }}
                                       animate={{ height: `${Math.max(val, 2)}%` }}
                                       className={`w-full bg-[#BFFF00] ${range === '30d' ? 'rounded-t-[1px]' : 'rounded-t-md sm:rounded-t-lg'} transition-all border-t-2 border-white/20 relative shadow-[0_0_15px_rgba(191,255,0,0.3)]`}
                                    >
                                       <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-zinc-900 text-[8px] font-black text-[#BFFF00] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#BFFF00]/20 z-50">
                                          {val}%
                                       </div>
                                    </motion.div>
                                 </div>
                                 {range === '7d' && <span className="text-[7px] sm:text-[8px] font-bold text-zinc-400">D{i + 1}</span>}
                              </div>
                           ))
                        )}
                     </div>
                  </div>

                  {/* Difficulty Levels */}
                  <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-white dark:bg-card border border-zinc-200 dark:border-border/10 space-y-6 sm:space-y-8 shadow-xl">
                     <div className="flex items-center justify-between">
                        <h3 className="text-[9px] sm:text-xs font-black text-zinc-500 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Difficulty Split</h3>
                        <BarChart3 className="h-4 w-4 text-zinc-300" />
                     </div>
                     <div className="flex items-end justify-between h-40 sm:h-48 gap-1.5 sm:gap-2">
                        {loading ? (
                           Array.from({ length: 3 }).map((_, i) => (
                              <Skeleton key={i} className="flex-1 h-full rounded-t-2xl" />
                           ))
                        ) : (
                           difficultyData.map((bar, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-3 sm:gap-4 group h-full">
                                 <div className="relative w-full h-full flex flex-col justify-end">
                                    <motion.div
                                       initial={{ height: 0 }}
                                       animate={{ height: bar.height }}
                                       className="w-full rounded-t-lg sm:rounded-t-xl transition-all border-t-2 border-white/10"
                                       style={{ backgroundColor: bar.color }}
                                    />
                                    <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 px-2 py-1.5 rounded bg-zinc-900 text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 z-50 text-center">
                                       <div>{bar.val}</div>
                                       <div className="text-[6px] text-zinc-500 uppercase">{bar.count} Qs</div>
                                    </div>
                                 </div>
                                 <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-zinc-500">{bar.label}</p>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               </div>
            </section>

            <section className="lg:col-span-4 space-y-8">
               <div className="rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-zinc-200 dark:border-white/5 p-8 sm:p-10 space-y-5 sm:space-y-6 shadow-xl">
                  <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-[#BFFF00]" />
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#BFFF00]/50">Engine Status</p>
                  <h4 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Active Learning.</h4>
                  <p className="text-[9px] sm:text-[10px] font-medium text-zinc-500 leading-relaxed uppercase tracking-widest">
                     System is currently processing real-time student interaction data. Accuracy trends are stable.
                  </p>
               </div>

            </section>
         </div>
      </div>
   );
}
