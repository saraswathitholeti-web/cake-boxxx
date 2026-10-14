'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  action?: {
    type: string;
    orderNumber?: string;
  };
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Hello! I am your **Cake Box Assistant** from our Brodipet bakery. 🍰✨\n\nHow can I help you today? You can track an order, ask about cakes, check delivery areas in Guntur, or ask for today’s offers!',
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Thanks for reaching out! Let me know if you need anything else.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: data.action,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Sorry, I had trouble connecting to the Brodipet kitchen server. Please try again or call +91 863 223 4567.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'Where is my order? (CB-8821)',
    'Are celebration cakes eggless?',
    'What are today’s promo coupons?',
    'Opening hours & Brodipet location',
    'Recommend popular cakes',
  ];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-[#4A2E18] to-[#6A4426] hover:from-[#2A170F] hover:to-[#4A2E18] text-white px-4 py-3 rounded-full shadow-2xl shadow-[#4A2E18]/40 hover:scale-105 transition-all group border border-amber-200/30"
          aria-label="Open Cake Box Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#4A2E18]"></span>
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">Cake Box Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-96 h-[520px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-amber-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4A2E18] to-[#2A170F] text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100/10 border border-amber-200/30 flex items-center justify-center text-amber-200">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  Cake Box Assistant
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                </div>
                <div className="text-[10px] text-amber-200/70">
                  Online • Brodipet Kitchen Support
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-amber-200/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FAF5EE]/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-[#4A2E18] flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#4A2E18] text-white rounded-tr-xs'
                      : 'bg-white text-gray-800 border border-amber-100 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                  {msg.action?.type === 'view_order' && msg.action.orderNumber && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100">
                      <Link
                        href={`/track?order=${msg.action.orderNumber}`}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E85A71] text-white rounded-lg font-bold text-[11px] shadow-xs hover:bg-[#D0455C] transition-colors"
                      >
                        Track {msg.action.orderNumber} Live <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-amber-200/70' : 'text-gray-400'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[#E85A71] text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-gray-400 text-xs pl-8">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-200"></span>
                <span className="text-[10px] ml-1">Checking with kitchen...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="p-2 border-t border-gray-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100/80 text-[10px] font-semibold text-[#4A2E18] border border-amber-200/60 transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about menu, order status, timings..."
              className="flex-1 text-xs px-3.5 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full bg-[#4A2E18] hover:bg-[#2A170F] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
