import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface InfoPageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function InfoPageLayout({ title, subtitle, children }: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#030105] text-white selection:bg-[#BFFF00] selection:text-black font-sans">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#BFFF00]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/10 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
            <ChevronLeft size={16} />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight uppercase">Adaptive.</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-20">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.9]">
              {title}
            </h1>
            <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          </div>

          <div className="prose prose-invert prose-zinc max-w-none prose-headings:uppercase prose-headings:tracking-tight prose-p:text-zinc-400 prose-p:leading-loose">
            {children}
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          <span>Adaptive. © 2026</span>
          <div className="flex gap-8">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
