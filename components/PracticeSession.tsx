'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Timer, Loader2, ArrowRight, ShieldCheck, BookOpen, AlertCircle, Clock, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

interface Question {
   id: string;
   text: string;
   options: string[];
   difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function PracticeSession() {
   const router = useRouter();
   const [question, setQuestion] = useState<Question | null>(null);
   const [selectedAnswer, setSelectedAnswer] = useState<string>('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [result, setResult] = useState<{ isCorrect: boolean } | null>(null);
   const [timer, setTimer] = useState(0);
   const [loading, setLoading] = useState(true);

   const timerInterval = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      fetchNextQuestion();
      return () => stopTimer();
   }, []);

   const startTimer = () => {
      setTimer(0);
      if (timerInterval.current) clearInterval(timerInterval.current);
      timerInterval.current = setInterval(() => {
         setTimer(prev => prev + 1);
      }, 1000);
   };

   const stopTimer = () => {
      if (timerInterval.current) {
         clearInterval(timerInterval.current);
      }
   };

   const fetchNextQuestion = async () => {
      setLoading(true);
      setResult(null);
      setSelectedAnswer('');
      try {
         const res = await fetch('/api/practice/next');
         if (res.ok) {
            const data = await res.json();
            setQuestion(data);
            startTimer();
         } else {
            toast.error('Session complete or no more questions available');
         }
      } catch (error) {
         toast.error('Connection failure');
      } finally {
         setLoading(false);
      }
   };

   const handleSubmit = async () => {
      if (!selectedAnswer || !question) return;

      setIsSubmitting(true);
      stopTimer();

      try {
         const res = await fetch('/api/attempts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               questionId: question.id,
               userAnswer: selectedAnswer,
               timeTaken: timer
            })
         });

         if (res.ok) {
            const attempt = await res.json();
            setResult({ isCorrect: attempt.isCorrect });
         }
      } catch (error) {
         toast.error('Verification failed');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleExit = () => {
      toast((t) => (
         <div className="flex flex-col gap-4 p-2">
            <p className="text-sm font-bold text-white">Exit session? Progress on this question will be lost.</p>
            <div className="flex gap-2">
               <button
                  onClick={() => {
                     toast.dismiss(t.id);
                     router.push('/student');
                  }}
                  className="px-4 py-2 bg-red-500 text-white text-xs font-black uppercase rounded-lg hover:bg-red-600 transition-all"
               >
                  Confirm Exit
               </button>
               <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-4 py-2 bg-zinc-800 text-white text-xs font-black uppercase rounded-lg hover:bg-zinc-700 transition-all"
               >
                  Stay
               </button>
            </div>
         </div>
      ), {
         duration: 5000,
         style: { background: '#09090b', border: '1px solid rgba(255,255,255,0.1)' }
      });
   };

   if (loading) {
      return (
         <div className="max-w-4xl mx-auto w-full px-2 sm:px-4">
            <div className="mb-4 sm:mb-12 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <div className="space-y-2">
                     <Skeleton className="h-3 w-20" />
                     <Skeleton className="h-4 w-32" />
                  </div>
               </div>
               <Skeleton className="h-12 w-32 rounded-2xl" />
            </div>
            <div className="bg-white rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 p-8 sm:p-16 space-y-12">
               <div className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-2/3" />
               </div>
               <div className="grid grid-cols-1 gap-5">
                  <Skeleton className="h-16 sm:h-24 w-full rounded-[2rem]" />
                  <Skeleton className="h-16 sm:h-24 w-full rounded-[2rem]" />
                  <Skeleton className="h-16 sm:h-24 w-full rounded-[2rem]" />
                  <Skeleton className="h-16 sm:h-24 w-full rounded-[2rem]" />
               </div>
            </div>
         </div>
      );
   }

   if (!question) return null;

   return (
      <div className="max-w-4xl mx-auto w-full px-2 sm:px-4">
         {/* Session Header / Info Bar */}
         <div className="mb-4 sm:mb-12 flex items-center justify-between bg-white/50 backdrop-blur-md p-3 sm:p-0 rounded-2xl sm:bg-transparent sm:backdrop-blur-none border border-slate-100 sm:border-none shadow-sm sm:shadow-none">
            <div className="flex items-center gap-2 sm:gap-4">
               <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white shadow-sm border border-slate-100 hidden sm:block">
                  <BookOpen className="text-blue-600" size={18} />
               </div>
               <div>
                  <h4 className="text-[7px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] sm:tracking-widest">Active Assessment</h4>
                  <p className="text-[10px] sm:text-sm font-black text-slate-800 tracking-tight leading-none sm:leading-normal">Node • {question.id.slice(-6).toUpperCase()}</p>
               </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-8">
               <div className="flex flex-col items-end">
                  <span className="text-[7px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5 sm:mb-1">Time</span>
                  <div className="flex items-center gap-1 sm:gap-2 text-slate-800 font-mono text-sm sm:text-xl font-black">
                     <Clock size={12} className="text-blue-500" />
                     {timer}s
                  </div>
               </div>
               <div className="h-6 w-px bg-slate-200 hidden sm:block" />
               <button
                  onClick={handleExit}
                  className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm group"
                  title="Exit Session"
               >
                  <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
               </button>
            </div>
         </div>

         {/* Main Question Card */}
         <div className="bg-white rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-5 sm:p-10 md:p-16 space-y-6 sm:space-y-16">

               {/* Question Text */}
               <div className="space-y-2 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                     <div className="h-0.5 w-4 sm:w-8 bg-blue-600 rounded-full" />
                     <span className="text-[8px] sm:text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Question Input</span>
                  </div>
                  <h2 className="text-lg sm:text-3xl md:text-5xl font-bold text-slate-900 leading-[1.4] sm:leading-[1.3] tracking-tight">
                     {question.text}
                  </h2>
               </div>

               {/* Options List */}
               <div className="grid grid-cols-1 gap-2.5 sm:gap-5">
                  {question.options.map((option, index) => {
                     const isSelected = selectedAnswer === option;
                     const isCorrect = result?.isCorrect && isSelected;

                     return (
                        <button
                           key={index}
                           onClick={() => !result && setSelectedAnswer(option)}
                           disabled={!!result || isSubmitting}
                           className={`w-full group flex items-center p-3.5 sm:p-7 rounded-xl sm:rounded-[2rem] border-2 transition-all duration-300 text-left ${isSelected
                                 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 -translate-y-0.5'
                                 : 'bg-white border-slate-50 text-slate-600 hover:border-blue-50 hover:bg-slate-50/30'
                              } ${result && isSelected
                                 ? (result.isCorrect ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-100' : 'bg-red-500 border-red-500 text-white shadow-red-100')
                                 : ''
                              }`}
                        >
                           <div className={`h-7 w-7 sm:h-11 sm:w-11 rounded-md sm:rounded-2xl flex items-center justify-center text-[10px] sm:text-sm font-black mr-3 sm:mr-6 transition-all ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-500 group-hover:text-white'
                              }`}>
                              {String.fromCharCode(65 + index)}
                           </div>
                           <span className="text-sm sm:text-lg font-bold flex-1">{option}</span>
                           {isSelected && !result && (
                              <div className="h-1 w-1 rounded-full bg-white animate-pulse" />
                           )}
                           {result && isSelected && (
                              result.isCorrect ? <ShieldCheck size={18} className="sm:w-6 sm:h-6" /> : <AlertCircle size={18} className="sm:w-6 sm:h-6" />
                           )}
                        </button>
                     );
                  })}
               </div>
            </div>

            {/* Bottom Action Section */}
            <div className="px-5 sm:px-10 md:px-16 py-5 sm:py-10 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-8">
               <p className="hidden xs:block text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center md:text-left">
                  Secure Neural Channel
                  <span className="mx-2 opacity-20">|</span>
                  {isSubmitting ? 'Processing...' : 'Awaiting'}
               </p>

               {!result ? (
                  <button
                     onClick={handleSubmit}
                     disabled={!selectedAnswer || isSubmitting}
                     className="w-full md:w-auto px-8 sm:px-14 py-3.5 sm:py-5 rounded-lg sm:rounded-2xl bg-slate-900 text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:shadow-xl active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3"
                  >
                     {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : 'Verify Answer'}
                     {!isSubmitting && <ArrowRight size={14} />}
                  </button>
               ) : (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-center gap-3 sm:gap-5">
                        <div className={`h-9 w-9 sm:h-14 sm:w-14 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-md ${result.isCorrect ? 'bg-emerald-500 text-white shadow-emerald-500/10' : 'bg-red-500 text-white shadow-red-500/10'}`}>
                           {result.isCorrect ? <CheckCircle2 size={20} className="sm:w-7 sm:h-7" /> : <XCircle size={20} className="sm:w-7 sm:h-7" />}
                        </div>
                        <div className="text-left">
                           <p className={`text-sm sm:text-lg font-black uppercase tracking-tight ${result.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                              {result.isCorrect ? 'Calibrated' : 'Disrupted'}
                           </p>
                           <p className="text-[7px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                              {result.isCorrect ? 'Mastery updated.' : 'Input rejected.'}
                           </p>
                        </div>
                     </div>
                     <button
                        onClick={fetchNextQuestion}
                        className="w-full md:w-auto px-8 sm:px-12 py-3.5 sm:py-5 rounded-lg sm:rounded-2xl bg-white border border-slate-200 text-slate-900 text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                     >
                        Continue
                        <ArrowRight size={14} />
                     </button>
                  </div>
               )}
            </div>
         </div>

         <div className="mt-8 sm:mt-20 flex flex-col items-center gap-3 sm:gap-6 opacity-20">
            <div className="h-px w-12 sm:w-20 bg-slate-400" />
            <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 text-center">Adaptive Matrix v2.4</span>
         </div>
      </div>
   );
}


// Compatibility helper
function AlertCircleIcon({ size }: { size: number }) {
   return <AlertCircle size={size} />;
}
