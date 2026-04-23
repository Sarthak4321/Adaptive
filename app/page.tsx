'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Target,
  Zap,
  BrainCircuit,
  Award,
  Menu,
  X
} from 'lucide-react';
import CustomCursor from '@/components/CustomCursor';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'linear' | 'adaptive'>('adaptive');
  return (
    <div className="min-h-screen bg-[#0A0514] text-white selection:bg-[#BFFF00] selection:text-black overflow-x-hidden relative">
      <CustomCursor />

      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#BFFF00]/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />

        {/* SVG Grid Overlay */}
        <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-black/50 backdrop-blur-3xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:py-6">
          <div className="flex items-center gap-3">
            <span className="text-xl md:text-2xl font-bold tracking-tight uppercase">Adaptive.</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 lg:flex">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-[#BFFF00] transition-colors">Sign In</Link>
            <Link href="/register" className="group flex items-center gap-3 rounded-2xl bg-white px-7 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-[#BFFF00] active:scale-95 shadow-xl">
              Join Now
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <motion.div
          initial={false}
          animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          className="lg:hidden overflow-hidden bg-black/90 border-b border-white/5 px-6"
        >
          <div className="flex flex-col gap-6 py-10">
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-zinc-400">Sign In</Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between rounded-2xl bg-[#BFFF00] px-6 py-5 text-sm font-black uppercase tracking-widest text-black">
              Join Now
              <ChevronRight size={18} />
            </Link>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex flex-col justify-center pt-28 pb-20 overflow-hidden">
        {/* Hero Ambient Glows */}
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-[#BFFF00]/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 w-full relative z-10">
          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border-white/10 px-6 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#BFFF00] shadow-inner backdrop-blur-md">
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold leading-[1.0] tracking-tighter uppercase sm:text-6xl md:text-[6rem]">
                Practice at <br />
                <span className="text-[#BFFF00] drop-shadow-[0_0_30px_rgba(191,255,0,0.3)]">your pace.</span>
              </h1>
              <p className="mx-auto max-w-xl text-base md:text-lg text-zinc-500 font-medium leading-relaxed px-4">
                A platform that balances difficulty in real-time, ensuring you’re always challenged but never overwhelmed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 sm:pt-10 w-full sm:w-auto px-6"
            >
              <Link href="/register" className="h-14 sm:h-16 w-full sm:px-12 rounded-2xl bg-white text-black text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] hover:bg-[#BFFF00] transition-all flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 group">
                Start Practicing
                <ChevronRight className="h-4 w-4 ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Value Proposition & How it Works */}
      <section id="methodology" className="py-32 relative bg-[#08040C] overflow-hidden">
        {/* Deep Ambient Background Glows */}
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-[#BFFF00]/5 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid gap-20 lg:grid-cols-12 items-start">

            {/* Left Side: Copy & Process Timeline */}
            <div className="lg:col-span-7 space-y-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-3 rounded-full border border-[#BFFF00]/20 bg-[#BFFF00]/5 px-4 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BFFF00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BFFF00]"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BFFF00]">Core Methodology</span>
                </div>

                <h3 className="text-3xl font-bold uppercase tracking-tighter leading-[0.9] sm:text-5xl md:text-7xl">
                  The right <br />
                  <span className="text-white">challenge,</span> <br />
                  <span className="text-[#BFFF00] drop-shadow-[0_0_20px_rgba(191,255,0,0.2)]">Every Time.</span>
                </h3>
                <p className="text-zinc-500 font-medium leading-relaxed text-lg md:text-xl max-w-xl">
                  Traditional learning systems are static and predictable. We analyze your cognitive patterns in real-time to curate a practice path that matches your evolving proficiency.
                </p>
              </motion.div>

              {/* Guaranteed Centered Process Timeline */}
              <div className="relative space-y-16 sm:space-y-20">
                {/* Unified Timeline Spine Container */}
                <div className="absolute left-0 top-4 bottom-4 w-14 sm:w-20 flex justify-center pointer-events-none">
                  <div className="w-[1px] h-full bg-gradient-to-b from-[#BFFF00]/50 via-white/10 to-transparent" />
                </div>

                {[
                  { step: "01", title: "Baseline Mapping", text: "Questions are anchored to a precision complexity scale from 1 to 10." },
                  { step: "02", title: "Fluid Interaction", text: "A distraction-free environment optimized for high-density focus." },
                  { step: "03", title: "Neural Recalibration", text: "The queue instantly shifts difficulty based on performance weightage." }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="relative flex items-start gap-6 sm:gap-10 group cursor-default"
                  >
                    {/* Centered Node Container */}
                    <div className="relative z-10 w-14 sm:w-20 flex-shrink-0 flex justify-center pt-1.5">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="h-[32px] w-[32px] sm:h-[40px] sm:w-[40px] rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl flex items-center justify-center shadow-2xl group-hover:border-[#BFFF00]/30 group-hover:bg-[#BFFF00]/5 transition-all duration-500"
                      >
                        <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#BFFF00] shadow-[0_0_15px_#BFFF00]" />
                      </motion.div>
                    </div>

                    <div className="space-y-3 pb-8">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.step} — Internal Flow</p>
                      <h4 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight group-hover:text-[#BFFF00] transition-colors duration-500">{item.title}</h4>
                      <p className="text-sm sm:text-base text-zinc-500 leading-relaxed max-w-lg font-medium">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side: Comparison Bento Card - High Focus */}
            <div className="lg:col-span-5 lg:pt-20">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="sticky top-32"
              >
                {/* Mobile Tabs Toggle */}
                <div className="flex lg:hidden mb-6 p-1.5 rounded-2xl bg-white/5 border border-white/10 relative z-10 backdrop-blur-xl">
                  <button
                    onClick={() => setActiveTab('linear')}
                    className={`relative flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 z-10 ${activeTab === 'linear' ? 'text-white' : 'text-zinc-500'}`}
                  >
                    {activeTab === 'linear' && (
                      <motion.div layoutId="tab-bg" className="absolute inset-0 bg-zinc-800 rounded-xl -z-10 shadow-xl" />
                    )}
                    Linear
                  </button>
                  <button
                    onClick={() => setActiveTab('adaptive')}
                    className={`relative flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 z-10 ${activeTab === 'adaptive' ? 'text-black' : 'text-zinc-500'}`}
                  >
                    {activeTab === 'adaptive' && (
                      <motion.div layoutId="tab-bg" className="absolute inset-0 bg-[#BFFF00] rounded-xl -z-10 shadow-[0_0_20px_rgba(191,255,0,0.4)]" />
                    )}
                    Adaptive
                  </button>
                </div>

                <div className="group relative rounded-[2.5rem] sm:rounded-[3rem] border border-white/5 bg-white/[0.01] p-2 sm:p-3 backdrop-blur-3xl hover:border-[#BFFF00]/10 transition-all duration-700 overflow-hidden">
                  {/* Dynamic Aura Background Glow */}
                  <motion.div
                    animate={{
                      backgroundColor: activeTab === 'adaptive' ? 'rgba(191,255,0,0.08)' : 'rgba(255,255,255,0.03)',
                      scale: activeTab === 'adaptive' ? 1.2 : 1
                    }}
                    className="absolute inset-0 blur-[100px] pointer-events-none transition-colors duration-1000"
                  />

                  <div className="relative rounded-[2.3rem] sm:rounded-[2.8rem] bg-[#0A0514]/80 p-8 sm:p-12 shadow-2xl min-h-[450px] flex flex-col justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      {(activeTab === 'linear' || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && activeTab === 'linear' ? (
                        <motion.div
                          key="linear"
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.98 }}
                          transition={{ duration: 0.4, ease: "circOut" }}
                          className="space-y-10"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">Linear Practice</h4>
                          </div>
                          <div className="space-y-6">
                            {[
                              "Static, sequential question paths",
                              "Fixed difficulty regardless of mastery",
                              "Delayed proficiency insights"
                            ].map((line, idx) => (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                key={line}
                                className="flex gap-4 items-center"
                              >
                                <div className="h-[1px] w-4 bg-zinc-800" />
                                <p className="text-sm text-zinc-500 italic font-medium">{line}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="adaptive"
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.98 }}
                          transition={{ duration: 0.4, ease: "circOut" }}
                          className="space-y-10 relative"
                        >
                          <div className="hidden lg:block absolute -left-12 -right-12 top-[-40px] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                          <div className="flex items-center gap-4">
                            <motion.div
                              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="h-2 w-2 rounded-full bg-[#BFFF00] shadow-[0_0_15px_#BFFF00]"
                            />
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#BFFF00]">Adaptive Platform</h4>
                          </div>

                          <div className="space-y-6">
                            {[
                              "Non-linear, mastery-driven paths",
                              "Real-time difficulty recalibration",
                              "Instant clarity on skill resolution"
                            ].map((line, idx) => (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                key={line}
                                className="flex gap-5 items-center group/item"
                              >
                                <motion.div
                                  whileInView={{ width: ['0px', '20px'] }}
                                  className="h-[1px] bg-[#BFFF00]/30 group-hover/item:bg-[#BFFF00] transition-colors"
                                />
                                <p className="text-sm text-zinc-200 font-black uppercase tracking-tight">{line}</p>
                              </motion.div>
                            ))}
                          </div>

                          {/* Interactive Visual Element */}
                          <div className="mt-12 rounded-[1.5rem] sm:rounded-[2rem] bg-white/[0.03] p-6 sm:p-8 border border-white/5 flex items-end gap-2 sm:gap-3 h-28 sm:h-32 relative overflow-hidden group/chart">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#BFFF00]/5 to-transparent opacity-0 group-hover/chart:opacity-100 transition-opacity duration-700" />
                            {[30, 50, 40, 85, 70, 100].map((h, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                whileInView={{ height: `${h}%` }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: "circOut" }}
                                className={`flex-1 rounded-t-lg sm:rounded-t-xl relative z-10 transition-all duration-500 ${i === 5 ? 'bg-[#BFFF00] shadow-[0_0_30px_#BFFF00]' : 'bg-zinc-800 group-hover/chart:bg-zinc-700'}`}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-40 relative bg-[#050208]">
        {/* Ambient Spot Glow */}
        <div className="absolute top-1/2 right-[-5%] w-[400px] h-[400px] bg-[#BFFF00]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="mb-24 text-center space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-[#BFFF00]">Core Features</h2>
            <p className="text-2xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl">
              Focus on what <br /><span className="text-white/20">matters most.</span>
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Target />, title: "Difficulty Mapping", desc: "Every question is anchored to a specific skill level, providing a consistent scale for progress." },
              { icon: <Zap />, title: "Real-time Recalibration", desc: "No manual adjustments needed. The queue updates instantly as you work through a session." },
              { icon: <BrainCircuit />, title: "Instructor Insights", desc: "Dashboards that show where students are currently plateauing, allowing for targeted intervention." },
              { icon: <Award />, title: "Session Snapshots", desc: "Detailed reports highlighting time-to-answer and accuracy trends." }
            ].map((feature, i) => (
              <div key={i} className="group p-8 sm:p-10 rounded-3xl border border-white/5 bg-[#0A0514] hover:border-[#BFFF00]/20 hover:bg-[#0F0A1A] transition-all">
                <div className="mb-6 sm:mb-8 h-12 w-12 rounded-xl bg-[#BFFF00]/10 text-[#BFFF00] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(191,255,0,0.1)]">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-lg font-bold uppercase tracking-wider">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users Section Heading */}
      <section id="students" className="pt-32 pb-10 bg-[#030105] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-purple-500">Dual Perspectives</h2>
            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              One ecosystem. <br />
              <span className="text-white/20">Two experiences.</span>
            </h3>
          </div>
        </div>
      </section>

      {/* Target Users Cards */}
      <section className="pb-32 bg-[#030105]">
        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#BFFF00]/[0.01] blur-[150px] pointer-events-none" />

          <div className="grid gap-8 md:gap-12 md:grid-cols-2 relative z-10">
            <div id="instructors" className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] bg-[#0A0514] border border-white/5 hover:border-purple-500/20 transition-colors space-y-6">
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">For Students</h4>
              <p className="text-zinc-500 text-base sm:text-lg leading-relaxed">Reach mastery faster by focusing on the material that actually needs your attention. Practice stays at the right level—not too easy, not too hard.</p>
            </div>
            <div className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] bg-[#0A0514] border border-white/5 hover:border-[#BFFF00]/20 transition-colors space-y-6">
              <div className="h-12 w-12 rounded-full bg-[#BFFF00]/10 flex items-center justify-center text-[#BFFF00]">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">For Instructors</h4>
              <p className="text-zinc-500 text-base sm:text-lg leading-relaxed">Manage vast question banks with ease and understand class performance without manual grading. Identify plateaus before they become problems.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="py-32 sm:py-40 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#BFFF00]/5 blur-[120px]" />
        <div className="mx-auto max-w-3xl px-6 space-y-10 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
            Ready to <br className="sm:hidden" />
            <span className="text-[#BFFF00]">refine your practice?</span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto px-4">
            Join the institutions using adaptive learning to improve student outcomes.
          </p>
          <div className="pt-6">
            <Link href="/register" className="inline-flex h-16 w-full sm:w-auto px-12 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-[#BFFF00] transition-all items-center justify-center shadow-2xl hover:scale-105 active:scale-95">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#0A0514] pt-24 pb-12 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-10">
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="space-y-6">
              <span className="text-xl font-bold tracking-tight uppercase">Adaptive.</span>
              <p className="text-zinc-500 text-xs leading-loose max-w-xs">
                Refining learning through precise difficulty adaptation and performance analytics.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BFFF00]">Ecosystem</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Practice Dashboard', href: '/student' },
                  { name: 'Question Engine', href: '/instructor' },
                  { name: 'Class Analytics', href: '/instructor/analytics' }
                ].map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BFFF00]">Resources</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Methodology', href: '/methodology' },
                  { name: 'Documentation', href: '/docs' },
                  { name: 'Security Center', href: '/security' }
                ].map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BFFF00]">Company</h4>
              <ul className="space-y-4">
                {[
                  { name: 'About', href: '/about' },
                  { name: 'Terms of Service', href: '/terms' },
                  { name: 'Privacy Policy', href: '/privacy' }
                ].map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase">
              Adaptive. © 2026
            </p>
            <div className="flex gap-8">
              <span className="text-[8px] font-bold uppercase text-zinc-700">Production v1.0.4</span>
              <span className="text-[8px] font-bold uppercase text-[#BFFF00]">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
