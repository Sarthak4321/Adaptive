'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Database,
  BarChart3,
  Users,
  LogOut,
  LayoutDashboard,
  Zap,
  ChevronRight,
  Sun,
  Moon,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';
import CustomCursor from '@/components/CustomCursor';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: just redirect
      window.location.href = '/login';
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/instructor', icon: <LayoutDashboard size={18} /> },
    { name: 'Questions', path: '/instructor/questions', icon: <Database size={18} /> },
    { name: 'Analytics', path: '/instructor/analytics', icon: <BarChart3 size={18} /> },
    { name: 'Students', path: '/instructor/students', icon: <Users size={18} /> },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-[#BFFF00] selection:text-black ${theme} ${theme === 'dark' ? 'bg-[#030303] text-zinc-100' : 'bg-[#F9FAFB] text-zinc-900'}`}>
      <CustomCursor />

      {/* Immersive Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] transition-colors duration-700 ${theme === 'dark' ? 'bg-purple-900/40' : 'bg-purple-100'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] transition-colors duration-700 ${theme === 'dark' ? 'bg-[#BFFF00]/20' : 'bg-[#BFFF00]/30'}`} />
      </div>

      {/* Mobile Menu Overlay - AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed left-0 top-0 z-[70] h-screen w-[280px] border-r flex flex-col lg:hidden ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5 shadow-2xl' : 'bg-white border-zinc-200 shadow-2xl'}`}
            >
              <div className="p-8 pb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-white text-black' : 'bg-zinc-900 text-[#BFFF00]'}`}>
                    <Zap className="h-4 w-4 fill-current" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">Adaptive.</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg ${theme === 'dark' ? 'hover:bg-white/5 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-500'}`}
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium transition-all ${isActive ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-zinc-900 text-white') : (theme === 'dark' ? 'text-zinc-500 hover:bg-white/5' : 'text-zinc-500 hover:bg-zinc-100')}`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-6 mt-auto border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-red-500 transition-all"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 border-r hidden lg:flex flex-col transition-all duration-300 ${theme === 'dark' ? 'bg-[#0A0A0A]/80 border-white/5 backdrop-blur-xl' : 'bg-white border-zinc-200'}`}>
        <div className="p-8 pb-10 flex items-center gap-3">
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center shadow-lg transition-colors ${theme === 'dark' ? 'bg-white text-black' : 'bg-zinc-900 text-[#BFFF00]'
            }`}>
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">Adaptive.</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? (theme === 'dark' ? 'bg-white/10 text-white shadow-sm' : 'bg-zinc-900 text-white shadow-md') : (theme === 'dark' ? 'text-zinc-500 hover:text-white hover:bg-white/5' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100')}`}
              >
                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto space-y-2">
          <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Support node</p>
            <p className="text-xs font-medium leading-relaxed mb-3">Enterprise priority active for your session.</p>
            <button className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-[#BFFF00] text-black hover:opacity-90' : 'bg-black text-[#BFFF00] hover:opacity-90'}`}>
              Quick Help
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content Container */}
      <div className="lg:pl-64 min-h-screen relative z-10">

        {/* Superior Header Navigation */}
        <header className={`sticky top-0 z-40 h-16 sm:h-20 px-4 sm:px-8 md:px-12 flex items-center justify-between transition-all duration-300 ${scrolled
            ? (theme === 'dark' ? 'bg-[#030303]/80 backdrop-blur-md border-b border-white/5' : 'bg-[#F9FAFB]/80 backdrop-blur-md border-b border-zinc-200 shadow-sm')
            : ''
          }`}>
          {/* Mobile Header Elements */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`h-10 w-10 flex items-center justify-center rounded-xl ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-zinc-100 text-zinc-900'
                }`}
            >
              <Menu size={20} />
            </button>
            <span className="text-lg font-bold tracking-tight">Adaptive.</span>
          </div>

          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              placeholder="Search repository, students or nodes..."
              className={`w-full pl-12 pr-4 py-2.5 rounded-xl border transition-all text-sm focus:outline-none ${theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-[#BFFF00]/50'
                  : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-[#BFFF00]'
                }`}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border transition-all text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
                }`}
            >
              {theme === 'dark' ? <Sun size={14} className="text-[#BFFF00]" /> : <Moon size={14} />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Lights On' : 'Lights Off'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content View */}
        <main className="p-4 sm:p-8 md:p-12 lg:p-14 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
          <motion.div
            key={pathname + theme}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
