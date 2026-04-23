'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowUpRight, 
  MoreHorizontal, 
  Mail, 
  Award, 
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  X,
  BarChart2,
  Calendar,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Star,
  Activity as ActivityIcon,
  ChevronDown,
  Download,
  ShieldCheck,
  Loader2,
  Target
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  accuracy: number;
  totalAttempts: number;
  avgTime: number;
  status: 'Mastery' | 'Stable' | 'At Risk';
  lastActive: string;
  history: number[]; 
  skills: { name: string; level: number }[];
  notes?: string;
}

export default function StudentManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'performance' | 'activity' | 'notes'>('performance');

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/instructor/students');
        const json = await res.json();
        setStudents(json);
      } catch (err) {
        toast.error('Failed to load students roster');
        console.error('Students load error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 pb-24">
      {/* Premium Header - Mobile Optimized */}
      <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-10 pt-6 sm:pt-0">
        <div className="space-y-4 sm:space-y-6 w-full lg:w-auto text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 rounded-full bg-[#BFFF00]/10 border border-[#BFFF00]/20 text-[#BFFF00] mx-auto lg:mx-0"
          >
            <div className="h-2 w-2 rounded-full bg-[#BFFF00] animate-pulse shadow-[0_0_10px_#BFFF00]" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">Student Command Center</span>
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none text-zinc-900 dark:text-white">
              Manage <span className="text-zinc-500">Students.</span>
            </h1>
            <p className="text-zinc-500 font-medium text-sm sm:text-lg md:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Real-time insights into your classroom performance. Track mastery levels, manage roster, and deploy targeted help.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search by name, ID or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-card border border-zinc-200 dark:border-border/10 text-xs sm:text-sm font-bold focus:border-[#BFFF00] outline-none text-zinc-900 dark:text-white shadow-sm"
            />
          </div>
          <button className="p-4 sm:p-5 rounded-2xl sm:rounded-[1.5rem] bg-white dark:bg-card border border-zinc-200 dark:border-border/10 text-zinc-500 shadow-sm">
            <Filter size={18} className="sm:size-6" />
          </button>
        </div>
      </section>

      {/* Stats Summary - Compact Mobile Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
        {[
          { label: 'Class Total', value: students.length.toString(), icon: <Users size={18} />, color: 'blue', desc: 'Enrolled' },
          { label: 'Need Help', value: students.filter(s => s.status === 'At Risk').length.toString(), icon: <AlertCircle size={18} />, color: 'red', desc: 'Warning' },
          { label: 'Avg Accuracy', value: (students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.accuracy, 0) / students.length) : 0) + '%', icon: <TrendingUp size={18} />, color: 'lime', desc: 'Class Avg' },
          { label: 'Activity', value: 'High', icon: <ActivityIcon size={18} />, color: 'purple', desc: 'Daily' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -4 }}
            className="p-4 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] bg-white dark:bg-card border border-zinc-200 dark:border-border/10 space-y-3 sm:space-y-6 shadow-lg sm:shadow-xl relative group overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all">
                {stat.icon}
             </div>
             <div className="h-8 w-8 sm:h-14 sm:w-14 rounded-lg sm:rounded-2xl bg-zinc-50 dark:bg-background flex items-center justify-center text-zinc-400 group-hover:text-[#BFFF00] transition-colors">
                {stat.icon}
             </div>
             <div className="space-y-0 sm:space-y-1">
                <p className="text-[8px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-zinc-500">{stat.label}</p>
                <p className="text-xl sm:text-4xl font-black text-zinc-900 dark:text-white leading-tight">{stat.value}</p>
                <p className="text-[7px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">{stat.desc}</p>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Students Table Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
           <div className="flex items-center gap-3 sm:gap-4">
              <BookOpen size={16} className="text-zinc-400" />
              <h3 className="text-[10px] sm:text-sm font-black text-zinc-500 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Student Ledger</h3>
           </div>
           <button className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
              <Download size={14} />
              Export CSV
           </button>
        </div>

        <div className="rounded-[2rem] sm:rounded-[3.5rem] bg-white dark:bg-card border border-zinc-200 dark:border-border/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02]">
                  <th className="px-6 sm:px-10 py-6 sm:py-8 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Profile</th>
                  <th className="px-6 sm:px-10 py-6 sm:py-8 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Stability</th>
                  <th className="px-6 sm:px-10 py-6 sm:py-8 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Current Score</th>
                  <th className="px-6 sm:px-10 py-6 sm:py-8 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Workload</th>
                  <th className="px-6 sm:px-10 py-6 sm:py-8 text-right text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="group hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedStudent(student);
                      setActiveTab('performance');
                    }}
                  >
                    <td className="px-6 sm:px-10 py-6 sm:py-8">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="h-10 w-10 sm:h-16 sm:w-16 rounded-xl sm:rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center font-black text-sm sm:text-xl text-zinc-400 group-hover:text-[#BFFF00] transition-all uppercase">
                          {student.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#BFFF00] transition-colors">{student.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium">{student.email}</p>
                            <div className="h-1 w-1 rounded-full bg-zinc-300" />
                            <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">ID: {student.id.slice(-6)}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-10 py-6 sm:py-8">
                      <div className={`inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${
                        student.status === 'Mastery' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]' :
                        student.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
                        'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                      }`}>
                        <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                          student.status === 'Mastery' ? 'bg-purple-400 animate-pulse' :
                          student.status === 'Stable' ? 'bg-emerald-400' :
                          'bg-red-400 animate-bounce'
                        }`} />
                        {student.status}
                      </div>
                    </td>
                    <td className="px-6 sm:px-10 py-6 sm:py-8">
                      <div className="space-y-2 sm:space-y-3 w-32 sm:w-40">
                        <div className="flex justify-between items-end">
                          <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">{student.accuracy}%</span>
                          <span className="text-[8px] sm:text-[9px] font-bold text-zinc-400 uppercase">Avg</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${student.accuracy}%` }}
                            className="h-full bg-gradient-to-r from-[#BFFF00]/40 to-[#BFFF00]" 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-10 py-6 sm:py-8">
                       <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-xs sm:text-sm font-mono font-bold text-zinc-900 dark:text-white">{student.totalAttempts} Quests</p>
                          <p className="text-[9px] sm:text-[10px] text-zinc-500 font-medium uppercase tracking-widest">{student.avgTime}s avg</p>
                       </div>
                    </td>
                    <td className="px-6 sm:px-10 py-6 sm:py-8 text-right">
                       <button className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-zinc-100 dark:bg-background flex items-center justify-center text-zinc-400 group-hover:text-[#BFFF00] transition-all">
                          <ChevronRight size={20} className="sm:size-6" />
                       </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <p className="text-zinc-500 font-medium">No students found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-6 sm:p-10 border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-50/30 dark:bg-white/[0.01]">
             <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-zinc-500">Roster Overview | {filteredStudents.length} Students</p>
             <div className="flex gap-4 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl bg-zinc-100 dark:bg-background text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 disabled:opacity-30 border border-transparent" disabled>Prev</button>
                <button className="flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl bg-zinc-100 dark:bg-background text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 disabled:opacity-30 border border-transparent" disabled>Next</button>
             </div>
          </div>
        </div>
      </div>

      {/* Advanced Student Profile Modal - Fully Responsive */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-10 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-6xl h-full sm:h-[90vh] bg-white dark:bg-[#080808] rounded-none sm:rounded-[3rem] lg:rounded-[4rem] border-0 sm:border border-zinc-200 dark:border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            >
              {/* Modal Header Section - Mobile Optimized */}
              <div className="p-6 sm:p-12 pb-0 flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-10">
                <div className="flex items-center gap-6 sm:gap-10">
                  <div className="relative shrink-0">
                    <div className="h-16 w-16 sm:h-32 sm:w-32 rounded-2xl sm:rounded-[3rem] bg-gradient-to-br from-[#BFFF00] to-[#88B800] flex items-center justify-center text-black text-2xl sm:text-5xl font-black uppercase shadow-xl">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 h-6 w-6 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl bg-zinc-900 border-2 sm:border-4 border-white dark:border-[#080808] flex items-center justify-center text-[#BFFF00]">
                       <ShieldCheck size={12} className="sm:size-5" />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <h2 className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-tight">{selectedStudent.name}</h2>
                      <div className={`px-2.5 sm:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${
                        selectedStudent.status === 'Mastery' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                        selectedStudent.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {selectedStudent.status}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Mail size={12} />
                        <span className="text-[11px] sm:text-sm font-medium truncate max-w-[150px] sm:max-w-none">{selectedStudent.email}</span>
                      </div>
                      <div className="hidden sm:block h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                      <p className="text-[#BFFF00] font-black uppercase text-[9px] sm:text-[11px] tracking-widest">ACTIVE MEMBER</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="absolute sm:static top-6 right-6 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-zinc-50 dark:bg-white/5 text-zinc-400 transition-all border border-zinc-100 dark:border-white/10"
                >
                  <X size={20} className="sm:size-7" />
                </button>
              </div>

              {/* Navigation Tabs - Mobile Optimized */}
              <div className="px-6 sm:px-12 pt-6 sm:pt-10 flex gap-4 sm:gap-8 border-b border-zinc-100 dark:border-white/5 overflow-x-auto no-scrollbar">
                 {[
                   { id: 'performance', label: 'Analytics', icon: <BarChart2 size={14} /> },
                   { id: 'activity', label: 'Logs', icon: <ActivityIcon size={14} /> },
                   { id: 'notes', label: 'Notes', icon: <MessageSquare size={14} /> },
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`pb-4 sm:pb-6 text-[9px] sm:text-xs font-black uppercase tracking-widest sm:tracking-[0.3em] flex items-center gap-2 sm:gap-3 transition-all relative shrink-0 ${
                       activeTab === tab.id ? 'text-[#BFFF00]' : 'text-zinc-400'
                     }`}
                   >
                     {tab.icon}
                     {tab.label}
                     {activeTab === tab.id && (
                       <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#BFFF00] rounded-t-full" />
                     )}
                   </button>
                 ))}
              </div>

              {/* Tab Content Area */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar">
                 <AnimatePresence mode="wait">
                    {activeTab === 'performance' && (
                      <motion.div 
                        key="perf"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8 sm:space-y-12"
                      >
                         {/* Stats Grid - Responsive */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                            {[
                              { label: 'Global Rank', value: 'Top 2%', desc: 'Performance Peak', icon: <Star size={16} className="text-[#BFFF00]" /> },
                              { label: 'Solve Velocity', value: `${selectedStudent.avgTime}s`, desc: 'Average per node', icon: <Clock size={16} className="text-purple-500" /> },
                              { label: 'Precision', value: `${selectedStudent.accuracy}%`, desc: 'Accuracy rate', icon: <Target size={16} className="text-blue-500" /> },
                            ].map((stat, i) => (
                              <div key={i} className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 space-y-4 sm:space-y-6">
                                <div className="flex items-center gap-3 text-zinc-500">
                                  {stat.icon}
                                  <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <div className="space-y-0.5 sm:space-y-1">
                                  <p className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
                                  <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase">{stat.desc}</p>
                                </div>
                              </div>
                            ))}
                         </div>

                         {/* Skill Map & History */}
                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
                            <div className="lg:col-span-7 p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 space-y-8 sm:space-y-10">
                               <div className="space-y-1">
                                  <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Accuracy Drift</h3>
                                  <p className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Weekly Performance Capture</p>
                               </div>
                               <div className="h-48 sm:h-64 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-4">
                                  {selectedStudent.history.map((val, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3 sm:gap-4 group">
                                      <div className="relative w-full flex-1 flex flex-col justify-end">
                                        <motion.div 
                                          initial={{ height: 0 }}
                                          animate={{ height: `${val}%` }}
                                          className="w-full bg-gradient-to-t from-[#BFFF00]/5 to-[#BFFF00] rounded-t-xl sm:rounded-t-2xl transition-all"
                                        />
                                      </div>
                                      <span className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase">W{i+1}</span>
                                    </div>
                                  ))}
                               </div>
                            </div>

                            <div className="lg:col-span-5 p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 space-y-8 sm:space-y-10">
                               <div className="space-y-1">
                                  <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Skill Matrix</h3>
                                  <p className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Proficiency Breakdown</p>
                               </div>
                               <div className="space-y-6 sm:space-y-8">
                                  {selectedStudent.skills.map((skill, i) => (
                                    <div key={i} className="space-y-2 sm:space-y-3">
                                       <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-black uppercase tracking-widest">
                                          <span className="text-zinc-600 dark:text-zinc-400">{skill.name}</span>
                                          <span className="text-zinc-900 dark:text-white">{skill.level}%</span>
                                       </div>
                                       <div className="h-1.5 sm:h-2 w-full bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden">
                                          <motion.div 
                                             initial={{ width: 0 }}
                                             animate={{ width: `${skill.level}%` }}
                                             className="h-full bg-[#BFFF00]"
                                          />
                                       </div>
                                    </div>
                                  ))}
                               </div>
                               <button className="w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-[#BFFF00]/10 border border-[#BFFF00]/20 text-[#BFFF00] text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                  Update Curriculum
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    )}

                    {activeTab === 'activity' && (
                      <motion.div 
                        key="active"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4 sm:space-y-6"
                      >
                         <div className="space-y-4">
                            {[
                              { action: 'Completed "Data Structures" quiz', score: '92%', time: '2 hours ago', type: 'success' },
                              { action: 'Started "System Design" course', score: '--', time: '5 hours ago', type: 'info' },
                              { action: 'Failed "Advanced Logic" challenge', score: '30%', time: '1 day ago', type: 'warning' },
                              { action: 'Mastered "Array Methods"', score: '100%', time: '2 days ago', type: 'success' },
                            ].map((log, i) => (
                              <div key={i} className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 flex items-center justify-between transition-all">
                                 <div className="flex items-center gap-4 sm:gap-6">
                                    <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center ${
                                       log.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                       log.type === 'warning' ? 'bg-red-500/10 text-red-500' :
                                       'bg-blue-500/10 text-blue-500'
                                    }`}>
                                       <ActivityIcon size={16} />
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-white leading-tight">{log.action}</p>
                                       <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{log.time}</p>
                                    </div>
                                 </div>
                                 <div className="text-right shrink-0 ml-4">
                                    <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">{log.score}</p>
                                    <p className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase">Score</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </motion.div>
                    )}

                    {activeTab === 'notes' && (
                      <motion.div 
                        key="notes"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 sm:space-y-8"
                      >
                         <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 space-y-6 sm:space-y-8">
                            <div className="space-y-2">
                               <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Instructor Notes</h3>
                               <p className="text-[11px] sm:text-sm text-zinc-500 font-medium leading-relaxed">
                                  Private tracks for individual student growth and blockers.
                               </p>
                            </div>
                            <textarea 
                               placeholder="Start typing your notes here..."
                               defaultValue={selectedStudent.notes}
                               className="w-full min-h-[200px] sm:min-h-[300px] rounded-2xl sm:rounded-[2rem] bg-white dark:bg-black p-6 sm:p-10 text-sm sm:text-lg leading-relaxed focus:outline-none border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white"
                            />
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Last modified: Yesterday, 4:12 PM</p>
                               <button className="w-full sm:w-auto px-10 py-4 rounded-xl sm:rounded-2xl bg-[#BFFF00] text-black text-[10px] font-black uppercase tracking-widest transition-all">
                                  Save Note
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
              
              {/* Modal Footer Controls - Responsive Stack */}
              <div className="p-6 sm:p-10 px-6 sm:px-12 bg-zinc-50/50 dark:bg-white/[0.02] border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-0">
                 <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all">
                       <Mail size={14} className="sm:size-4" />
                       Message
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all">
                       <Download size={14} className="sm:size-4" />
                       Export
                    </button>
                 </div>
                 <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                       <p className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Status</p>
                       <p className="text-[10px] sm:text-xs font-black text-emerald-500 uppercase tracking-tighter">Verified Node</p>
                    </div>
                    <div className="h-8 sm:h-10 w-px bg-zinc-200 dark:bg-white/10" />
                    <button className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-red-500">
                       Block Access
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
