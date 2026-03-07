import React, { useState, useRef, useEffect } from 'react';
import { getBusinessAdvice } from '../services/geminiService';
import { Bot, Send, Sparkles } from 'lucide-react';
import { AdviceMessage } from '../types';
import FormattedMessage from './FormattedMessage';

const Advisor: React.FC = () => {
  const [messages, setMessages] = useState<AdviceMessage[]>([
    { 
        role: 'model', 
        text: 'Hi, I am NEO, your intelligent business partner. \n\nI can help with **investment strategies**, **insurance options**, or general **business growth**. \n\nWhat\'s on your mind?', 
        timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: AdviceMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Context is broad for the advisor
    const { text, sources } = await getBusinessAdvice(input, 'investment, insurance, strategy, growth');
    
    const modelMsg: AdviceMessage = { 
        role: 'model', 
        text: text, 
        timestamp: new Date(),
        sources: sources
    };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const suggestions = [
      "Best insurance for a small bakery?",
      "Low-risk investment options for $1000",
      "How to scale my freelance gig?",
      "Explain compound interest"
  ];

  return (
    <div className="p-6 h-[calc(100vh-2rem)] flex flex-col animate-fade-in relative">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Bot className="text-white" size={28} />
        </div>
        <div>
           <h2 className="text-3xl font-bold text-white">NEO Advisor</h2>
           <p className="text-slate-400">Your virtual consultant for strategy & investment.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden flex flex-col relative z-10">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                    <div className="mr-3 mt-1 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg">
                             <Sparkles size={16} className="text-white" />
                        </div>
                    </div>
                )}
                <FormattedMessage text={msg.text} sources={msg.sources} role={msg.role} />
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
               <div className="mr-3 mt-1 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                         <Bot size={16} className="text-slate-400" />
                    </div>
               </div>
               <div className="bg-slate-800 rounded-2xl p-4 rounded-bl-none border border-slate-700 flex gap-2 items-center text-indigo-400">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </span>
                  <span className="text-sm text-slate-400 ml-2">Searching & thinking...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (only if few messages) */}
        {messages.length < 3 && (
            <div className="px-6 py-2 overflow-x-auto flex gap-3 no-scrollbar border-t border-slate-800/50 bg-slate-900/30">
                {suggestions.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => setInput(s)}
                        className="whitespace-nowrap px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        {s}
                    </button>
                ))}
            </div>
        )}

        {/* Input */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 backdrop-blur-md">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for investment advice, risk management, or strategy..."
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advisor;