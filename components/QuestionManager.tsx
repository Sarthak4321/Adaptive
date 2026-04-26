'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Plus,
   Trash2,
   Database,
   ChevronRight,
   ShieldCheck,
   Edit2,
   X,
   CheckCircle2,
   AlertCircle,
   Loader2,
   PlusCircle,
   MoreVertical,
   MinusCircle,
   Sparkles,
   Wand2,
   Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Skeleton } from './ui/skeleton';

interface Question {
   id: string;
   text: string;
   options: string[];
   correctAnswer: string;
   difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function QuestionManager() {
   const [questions, setQuestions] = useState<Question[]>([]);
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);

   // Mobile UI View State
   const [activeTab, setActiveTab] = useState<'manage' | 'create'>('manage');

   const [formData, setFormData] = useState<{
      text: string;
      options: string[];
      correctAnswer: string;
      difficulty: 'EASY' | 'MEDIUM' | 'HARD';
   }>({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      difficulty: 'MEDIUM'
   });

   // AI Generation State
   const [showAIPanel, setShowAIPanel] = useState(false);
   const [aiTopic, setAiTopic] = useState('');
   const [aiCount, setAiCount] = useState(3);
   const [isGenerating, setIsGenerating] = useState(false);
   const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
   const [aiDifficulty, setAiDifficulty] = useState<'DYNAMIC' | 'EASY' | 'MEDIUM' | 'HARD'>('DYNAMIC');

   useEffect(() => {
      fetchQuestions();
   }, []);

   const fetchQuestions = async () => {
      setLoading(true);
      try {
         const res = await fetch('/api/questions');
         if (res.ok) {
            const data = await res.json();
            setQuestions(data);
         }
      } catch (error) {
         toast.error('Network failure while syncing repository');
      } finally {
         setLoading(false);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.options.includes(formData.correctAnswer)) {
         toast.error('Select a correct answer from your options');
         return;
      }

      setSubmitting(true);
      try {
         const url = editingId ? `/api/questions/${editingId}` : '/api/questions';
         const method = editingId ? 'PATCH' : 'POST';

         const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
         });

         if (res.ok) {
            toast.success(editingId ? 'Question updated' : 'Created successfully');
            setFormData({ text: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 'MEDIUM' });
            setEditingId(null);
            fetchQuestions();
            // Switch back to management view on mobile after success
            setActiveTab('manage');
         } else {
            const data = await res.json();
            throw new Error(data.error || 'Server error occurred');
         }
      } catch (error: any) {
         toast.error(error.message);
      } finally {
         setSubmitting(false);
      }
   };

   const handleDelete = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();

      toast((t) => (
         <div className="flex items-center gap-4">
            <div className="space-y-1">
               <p className="text-xs font-bold uppercase tracking-widest text-white">Delete Question?</p>
               <p className="text-[10px] text-zinc-400">This action is permanent.</p>
            </div>
            <div className="flex gap-2">
               <button
                  onClick={async () => {
                     toast.dismiss(t.id);
                     try {
                        const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
                        if (res.ok) {
                           toast.success('Question deleted');
                           fetchQuestions();
                        }
                     } catch (error) {
                        toast.error('Failed to delete');
                     }
                  }}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
               >
                  Delete
               </button>
               <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-lg text-[10px] font-black uppercase tracking-widest"
               >
                  No
               </button>
            </div>
         </div>
      ), {
         duration: 5000,
         style: {
            background: '#09090b',
            border: '1px solid rgba(255,0,0,0.2)',
         }
      });
   };

   const startEdit = (q: Question) => {
      setEditingId(q.id);
      setFormData({
         text: q.text,
         options: [...q.options],
         correctAnswer: q.correctAnswer,
         difficulty: q.difficulty
      });
      setActiveTab('create');
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const cancelEdit = () => {
      setEditingId(null);
      setFormData({ text: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 'MEDIUM' });
      setActiveTab('manage');
   };

   const handleAIGenerate = async () => {
      if (!aiTopic) {
         toast.error('Please provide a topic for the AI');
         return;
      }

      setIsGenerating(true);
      setGeneratedQuestions([]);
      try {
         const res = await fetch('/api/questions/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               topic: aiTopic,
               difficulty: aiDifficulty,
               count: aiCount
            })
         });

         if (res.ok) {
            const result = await res.json();
            if (result.length > 0) {
               setGeneratedQuestions(result);
               toast.success(`AI generated ${result.length} questions for ${aiTopic}`);
            }
         } else {
            const data = await res.json();
            throw new Error(data.error || 'AI generation failed');
         }
      } catch (error: any) {
         toast.error(error.message);
      } finally {
         setIsGenerating(false);
      }
   };

   const handleBulkSave = async () => {
      if (generatedQuestions.length === 0) return;

      setSubmitting(true);
      try {
         const res = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(generatedQuestions)
         });

         if (res.ok) {
            toast.success(`Successfully added ${generatedQuestions.length} nodes to bank`);
            setGeneratedQuestions([]);
            setShowAIPanel(false);
            setAiTopic('');
            fetchQuestions();
            setActiveTab('manage');
         } else {
            throw new Error('Failed to bulk save questions');
         }
      } catch (error: any) {
         toast.error(error.message);
      } finally {
         setSubmitting(false);
      }
   };

   const handleSelectGenerated = (q: any) => {
      setFormData({
         text: q.text,
         options: q.options,
         correctAnswer: q.correctAnswer,
         difficulty: q.difficulty as any
      });
      setGeneratedQuestions([]);
      setShowAIPanel(false);
      toast.success('Question loaded into studio');
   };

   return (
      <div className="space-y-6 sm:space-y-12 pb-24 sm:pb-32">

         {/* Mobile Tab Switcher - Premium Interaction */}
         <div className="lg:hidden flex p-1.5 rounded-2xl bg-zinc-900/5 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 mb-8">
            <button
               onClick={() => setActiveTab('manage')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manage'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500'
                  }`}
            >
               <Database size={14} />
               Manage
            </button>
            <button
               onClick={() => setActiveTab('create')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'create'
                  ? 'bg-[#BFFF00] text-black shadow-sm'
                  : 'text-zinc-500'
                  }`}
            >
               <Plus size={14} />
               {editingId ? 'Edit Node' : 'Construct'}
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

            {/* Question Studio (Form) */}
            <div className={`lg:col-span-5 ${activeTab === 'create' ? 'block' : 'hidden lg:block'}`}>
               <motion.div
                  initial={activeTab === 'create' ? { opacity: 0, x: 20 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden transition-colors ${'bg-white dark:bg-card border-zinc-200 dark:border-border/10'
                     }`}>
                  <div className="p-6 sm:p-8 border-b border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-white/[0.02]">
                     <div className="space-y-1">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
                           Question Studio
                           {editingId ? <Edit2 size={16} className="text-blue-500" /> : <PlusCircle size={16} className="text-[#BFFF00]" />}
                        </h2>
                        <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                           {editingId ? 'Update Question' : 'Create New Question'}
                        </p>
                     </div>
                     <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                           type="button"
                           onClick={() => setShowAIPanel(!showAIPanel)}
                           className={`flex-1 sm:flex-none p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${showAIPanel
                              ? 'bg-[#BFFF00] text-black border-[#BFFF00]'
                              : 'bg-white/5 border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-white'
                              }`}
                        >
                           <Sparkles size={14} className={showAIPanel ? 'animate-pulse' : ''} />
                           AI Assist
                        </button>
                        {editingId && (
                           <button onClick={cancelEdit} className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-white">
                              <X size={16} />
                           </button>
                        )}
                     </div>
                  </div>

                  {/* AI Assist Panel */}
                  <AnimatePresence>
                     {showAIPanel && (
                        <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-b border-white/5"
                        >
                           <div className="p-6 sm:p-8 space-y-6">
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 rounded-lg bg-[#BFFF00]/20 flex items-center justify-center text-[#BFFF00]">
                                    <Zap size={14} />
                                 </div>
                                 <div className="space-y-0.5">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground dark:text-white leading-none">AI Question Maker</h3>
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Powered by Gemini AI</p>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                 <div className="sm:col-span-1 space-y-2">
                                    <label className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Topic / Intent</label>
                                    <input
                                       type="text"
                                       value={aiTopic}
                                       onChange={e => setAiTopic(e.target.value)}
                                       placeholder="e.g. Calculus..."
                                       className="w-full rounded-xl border border-border/20 bg-background/50 dark:bg-black/40 px-4 sm:px-5 py-3 text-[11px] sm:text-xs focus:border-[#BFFF00] outline-none transition-all"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Complexity</label>
                                    <select
                                       value={aiDifficulty}
                                       onChange={e => setAiDifficulty(e.target.value as any)}
                                       className="w-full rounded-xl border border-border/20 bg-background/50 dark:bg-black/40 px-4 py-3 text-[10px] sm:text-xs font-bold focus:border-[#BFFF00] outline-none transition-all"
                                    >
                                       <option value="DYNAMIC">AI Decide</option>
                                       <option value="EASY">Force Easy</option>
                                       <option value="MEDIUM">Force Medium</option>
                                       <option value="HARD">Force Hard</option>
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Quantity</label>
                                    <div className="flex items-center gap-2">
                                       <input
                                          type="number"
                                          min="1"
                                          max="20"
                                          value={aiCount}
                                          onChange={e => setAiCount(parseInt(e.target.value) || 1)}
                                          className="w-full rounded-xl border border-border/20 bg-background/50 dark:bg-black/40 px-2 py-3 text-[11px] sm:text-xs text-center focus:border-[#BFFF00] outline-none transition-all"
                                       />
                                    </div>
                                 </div>
                              </div>

                              {generatedQuestions.length > 0 && (
                                 <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                    <div className="flex items-center justify-between px-1">
                                       <h4 className="text-[8px] font-black uppercase tracking-widest text-[#BFFF00]">Generated Preview</h4>
                                       <span className="text-[8px] font-bold text-zinc-500 uppercase">{generatedQuestions.length} Items</span>
                                    </div>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                       {generatedQuestions.map((q, idx) => (
                                          <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 group hover:border-[#BFFF00]/30 transition-all">
                                             <p className="text-[11px] font-bold leading-tight line-clamp-2">{q.text}</p>
                                             <div className="flex items-center justify-between gap-4">
                                                <div className="flex gap-1">
                                                   {q.options.map((_: any, i: number) => (
                                                      <div key={i} className="h-1 w-3 rounded-full bg-zinc-800" />
                                                   ))}
                                                </div>
                                                <button
                                                   type="button"
                                                   onClick={() => handleSelectGenerated(q)}
                                                   className="text-[8px] font-black uppercase tracking-widest text-[#BFFF00] opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                   Edit in Studio
                                                </button>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                 {generatedQuestions.length > 0 ? (
                                    <>
                                       <button
                                          type="button"
                                          onClick={handleBulkSave}
                                          disabled={submitting}
                                          className="flex-1 py-3 sm:py-3.5 rounded-xl bg-[#BFFF00] text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#BFFF00]/10"
                                       >
                                          {submitting ? <Loader2 size={14} className="animate-spin" /> : <>Save All {generatedQuestions.length} to Bank <ChevronRight size={14} /></>}
                                       </button>
                                       <button
                                          type="button"
                                          onClick={() => setGeneratedQuestions([])}
                                          className="py-3 sm:px-6 sm:py-3.5 rounded-xl bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all text-center"
                                       >
                                          Discard
                                       </button>
                                    </>
                                 ) : (
                                    <>
                                       <button
                                          type="button"
                                          onClick={handleAIGenerate}
                                          disabled={isGenerating}
                                          className="flex-1 py-3 sm:py-3.5 rounded-xl bg-white text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-[#BFFF00] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                       >
                                          {isGenerating ? (
                                             <Loader2 size={14} className="animate-spin" />
                                          ) : (
                                             <>
                                                <Wand2 size={14} />
                                                Generate Logic
                                             </>
                                          )}
                                       </button>
                                       <button
                                          type="button"
                                          onClick={() => setShowAIPanel(false)}
                                          className="py-3 sm:px-6 sm:py-3.5 rounded-xl bg-background/10 border border-border/20 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all text-center"
                                       >
                                          Cancel
                                       </button>
                                    </>
                                 )}
                              </div>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                     <div className="space-y-2 sm:space-y-3">
                        <label className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Question Description</label>
                        <textarea
                           required
                           className="w-full min-h-[100px] sm:min-h-[120px] rounded-xl sm:rounded-2xl border bg-transparent p-4 sm:p-6 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#BFFF00]/20 transition-all placeholder:text-zinc-600 dark:border-white/10 dark:text-white"
                           value={formData.text}
                           onChange={e => setFormData({ ...formData, text: e.target.value })}
                           placeholder="What is the concept you want to evaluate?"
                        />
                     </div>

                     <div className="space-y-3 sm:space-y-4">
                        <label className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Answer Choices</label>
                        <div className="space-y-3 sm:space-y-4">
                           {formData.options.map((opt, i) => (
                              <div key={i} className="flex items-center gap-2 sm:gap-3">
                                 <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-background border border-border/10 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-zinc-500 shrink-0">
                                    {String.fromCharCode(65 + i)}
                                 </div>
                                 <input
                                    required
                                    className="flex-1 rounded-lg sm:rounded-xl border border-border/10 bg-background/40 px-4 sm:px-5 py-3 sm:py-4 text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#BFFF00]/20 transition-all placeholder:text-zinc-500 dark:text-white"
                                    value={opt}
                                    onChange={e => {
                                       const newOpts = [...formData.options];
                                       newOpts[i] = e.target.value;
                                       setFormData({ ...formData, options: newOpts });
                                    }}
                                    placeholder={`Option ${i + 1}`}
                                 />
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1.5 sm:space-y-2">
                           <label className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Correct Answer</label>
                           <select
                              required
                              className="w-full rounded-xl border bg-background px-4 sm:px-5 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold text-white focus:outline-none border-border/20 shadow-sm"
                              value={formData.correctAnswer}
                              onChange={e => setFormData({ ...formData, correctAnswer: e.target.value })}
                           >
                              <option value="">Select Correct</option>
                              {formData.options.map((opt: string, i: number) => (
                                 opt && <option key={i} value={opt}>{opt}</option>
                              ))}
                           </select>
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                           <label className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Difficulty</label>
                           <select
                              className="w-full rounded-xl border bg-background px-4 sm:px-5 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold text-white focus:outline-none border-border/20 shadow-sm"
                              value={formData.difficulty}
                              onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                           >
                              <option value="EASY">Easy</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HARD">Hard</option>
                           </select>
                        </div>
                     </div>

                     <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-4 sm:py-5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 ${'bg-zinc-900 dark:bg-[#BFFF00] text-white dark:text-black hover:opacity-90'
                           }`}
                     >
                        {submitting ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                           <>
                              {editingId ? 'Save Changes' : 'Add to Bank'}
                              <ChevronRight size={16} />
                           </>
                        )}
                     </button>
                  </form>
               </motion.div>
            </div>

            {/* Repository List */}
            <div className={`lg:col-span-7 space-y-6 sm:space-y-8 ${activeTab === 'manage' ? 'block' : 'hidden lg:block'}`}>
               <motion.div
                  initial={activeTab === 'manage' ? { opacity: 0, x: -20 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 sm:space-y-8"
               >
                  <div className="flex items-center justify-between px-2">
                     <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600 dark:text-zinc-400" />
                        <h3 className="text-xs sm:text-sm font-bold tracking-tight">Your Questions ({questions.length})</h3>
                     </div>
                     {loading && <Loader2 className="h-4 w-4 animate-spin text-zinc-600 dark:text-zinc-400" />}
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                     <AnimatePresence mode="popLayout">
                        {loading ? (
                           Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-card space-y-4 animate-pulse mb-6">
                                 <div className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                 </div>
                                 <Skeleton className="h-6 w-3/4" />
                                 <div className="flex gap-4">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-20" />
                                 </div>
                              </div>
                           ))
                        ) : (
                           questions.map((q: Question, i: number) => (
                              <motion.div
                                 key={q.id}
                                 layout
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, scale: 0.95 }}
                                 className={`group p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all mb-6 ${editingId === q.id
                                    ? 'border-[#BFFF00] bg-[#BFFF00]/5 shadow-md shadow-[#BFFF00]/10'
                                    : 'bg-white dark:bg-card border-zinc-200 dark:border-border/10 hover:border-border/20 shadow-sm'
                                    }`}
                              >
                                 <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
                                    <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                                       <div className="flex items-center gap-2 sm:gap-3">
                                          <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ${q.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                                             q.difficulty === 'MEDIUM' ? 'bg-purple-100 text-purple-700' :
                                                'bg-red-100 text-red-700'
                                             }`}>
                                             {q.difficulty}
                                          </span>
                                          <div className="h-1 w-1 rounded-full bg-zinc-300" />
                                          <span className="text-[8px] sm:text-[10px] font-mono text-zinc-500 uppercase">{q.id.slice(0, 10)}</span>
                                       </div>

                                       <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white transition-all group-hover:text-[#BFFF00] leading-tight">{q.text}</h4>

                                       <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                                          {q.options.map((opt: string, idx: number) => (
                                             <div key={idx} className="flex items-center gap-2">
                                                <div className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${opt === q.correctAnswer ? 'bg-[#C1FB00]' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                                                <span className={`text-[8px] sm:text-[10px] font-medium uppercase tracking-widest ${opt === q.correctAnswer ? 'text-zinc-900 dark:text-white font-bold' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                                   {opt}
                                                </span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>

                                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                       <button
                                          onClick={() => startEdit(q)}
                                          className="flex-1 sm:flex-none p-2.5 sm:p-3 rounded-xl bg-zinc-50 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-[#BFFF00] transition-all border border-zinc-100 dark:border-white/10 shadow-sm flex items-center justify-center"
                                       >
                                          <Edit2 size={16} />
                                       </button>
                                       <button
                                          onClick={(e) => handleDelete(q.id, e)}
                                          className="flex-1 sm:flex-none p-2.5 sm:p-3 rounded-xl bg-zinc-50 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-all border border-zinc-100 dark:border-white/10 shadow-sm flex items-center justify-center"
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                    </div>
                                 </div>
                              </motion.div>
                           ))
                        )}
                     </AnimatePresence>

                     {questions.length === 0 && !loading && (
                        <div className="py-24 sm:py-32 text-center space-y-4 opacity-40">
                           <Database className="mx-auto h-10 w-10 sm:h-12 sm:w-12" />
                           <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">No questions in scope</p>
                        </div>
                     )}
                  </div>
               </motion.div>
            </div>
         </div>
      </div>
   );
}
