'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, User, Loader2, MessageCircle } from 'lucide-react';
import { useSocket } from '@/lib/useSocket';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId: string;
  receiverName: string;
  currentUserId: string;
}

export default function ChatDialog({ isOpen, onClose, receiverId, receiverName, currentUserId }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket(currentUserId);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, receiverId]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (message: Message) => {
        if (message.senderId === receiverId || message.receiverId === receiverId) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
    return () => {
      socket?.off('receive-message');
    };
  }, [socket, receiverId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?userId=${receiverId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, content: input.trim() })
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
        
        // Emit via socket for real-time delivery
        socket?.emit('send-message', newMessage);
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col h-[600px]"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between bg-zinc-50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#BFFF00] flex items-center justify-center text-black font-black">
              {receiverName.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">{receiverName}</h3>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Secure Channel
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-white/5 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white dark:bg-transparent">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-zinc-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
               <MessageCircle size={40} className="text-zinc-200 dark:text-white/10" />
               <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No previous transmission history</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                    isMe 
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black rounded-tr-none shadow-lg' 
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white rounded-tl-none border border-zinc-200 dark:border-white/10'
                  }`}>
                    {msg.content}
                    <div className={`text-[8px] mt-2 opacity-40 font-bold uppercase ${isMe ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02]">
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-white/10 text-sm focus:outline-none focus:border-[#BFFF00] transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || sending}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-all disabled:opacity-20"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
