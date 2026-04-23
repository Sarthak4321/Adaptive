'use client';

import QuestionManager from "@/components/QuestionManager";
import { motion } from 'framer-motion';
import { Target, BrainCircuit, Activity } from 'lucide-react';

export default function InstructorQuestionsPage() {
   return (
      <div className="space-y-16">

         {/* Header / Hero Section - Mobile Optimized */}
         <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-10">
            <div className="space-y-3 sm:space-y-4 w-full lg:w-auto text-center lg:text-left">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-950 border border-white/10 mx-auto lg:mx-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#BFFF00] animate-pulse" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-[#BFFF00]">Active Logic Engine</span>
               </div>
               <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none"
               >
                  The <span className="text-zinc-600">Command</span><br className="hidden sm:block" />
                  Console.
               </motion.h1>
               <p className="text-zinc-500 font-medium text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
                  Define the adaptive flow of knowledge. Construct neural nodes and calibrate their complexity vectors for optimal student progression.
               </p>
            </div>

            <div className="flex justify-center sm:grid-cols-2 gap-4 w-full lg:w-auto">
               <div className="p-5 sm:p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-1 sm:space-y-2 flex flex-col items-center lg:items-start">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-[#BFFF00]" />
                  <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-600">Total Nodes</p>
                  <p className="text-xl sm:text-2xl font-black text-white">128</p>
               </div>
               <div className="p-5 sm:p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-1 sm:space-y-2 flex flex-col items-center lg:items-start">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-600">Sync Status</p>
                  <p className="text-xl sm:text-2xl font-black text-white">Live</p>
               </div>
            </div>
         </section>

         {/* Main Manager Component */}
         <QuestionManager />

      </div>
   );
}
