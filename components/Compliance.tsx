import React, { useState, useRef, useEffect } from 'react';
import { getBusinessAdvice } from '../services/geminiService';
import { ShieldCheck, FileText, AlertTriangle, Send, Scale, Landmark, CreditCard, ArrowRight, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { AdviceMessage } from '../types';
import FormattedMessage from './FormattedMessage';

interface TaxRequirement {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  authority: string;
}

const Compliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'tax'>('assistant');
  const [messages, setMessages] = useState<AdviceMessage[]>([
    { role: 'model', text: 'Hello! I am your NEO Legal Assistant. \n\nAsk me about **taxes**, **registration**, or **compliance** in your region.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'instruct' | 'pay' | 'success'>('idle');
  const [selectedTax, setSelectedTax] = useState<TaxRequirement | null>(null);
  
  const [taxRequirements, setTaxRequirements] = useState<TaxRequirement[]>([
    {
      id: 'TAX-001',
      title: 'Annual Company Income Tax',
      description: 'Standard corporate tax based on net profit for the previous fiscal year.',
      amount: 1250.00,
      dueDate: '2024-06-30',
      status: 'pending',
      authority: 'Federal Inland Revenue Service (FIRS)'
    },
    {
      id: 'TAX-002',
      title: 'Value Added Tax (VAT) - Q1',
      description: 'Consumption tax on goods and services for the first quarter.',
      amount: 450.25,
      dueDate: '2024-04-21',
      status: 'pending',
      authority: 'Federal Inland Revenue Service (FIRS)'
    }
  ]);

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

    const { text, sources } = await getBusinessAdvice(input, 'compliance');
    
    const modelMsg: AdviceMessage = { 
        role: 'model', 
        text: text, 
        timestamp: new Date(),
        sources: sources
    };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const startPaymentFlow = (tax: TaxRequirement) => {
    setSelectedTax(tax);
    setPaymentStep('instruct');
  };

  const handleProcessPayment = () => {
    setPaymentStep('pay');
    setIsPaying(true);
    
    // Simulate middleware payment processing
    setTimeout(() => {
        setTaxRequirements(prev => prev.map(t => t.id === selectedTax?.id ? { ...t, status: 'paid' } : t));
        setIsPaying(false);
        setPaymentStep('success');
    }, 3000);
  };

  const resetPayment = () => {
    setPaymentStep('idle');
    setSelectedTax(null);
  };

  return (
    <div className="p-6 h-[calc(100vh-2rem)] flex flex-col animate-fade-in text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShieldCheck className="text-emerald-400" />
              Compliance & Legitimacy
           </h2>
           <p className="text-slate-400 mt-2">Navigate the complexities of business law and taxation safely.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('assistant')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'assistant' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Legal Assistant
                </button>
                <button 
                    onClick={() => setActiveTab('tax')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'tax' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Tax Portal
                </button>
            </div>
            
            <div className="hidden md:flex gap-3">
                <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-300">
                    <FileText size={16} className="text-indigo-400" />
                    <span>Documents: 12</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-amber-200/80 bg-amber-900/10 border-amber-900/30">
                    <AlertTriangle size={16} />
                    <span>Pending Renewals: 1</span>
                </div>
            </div>
        </div>
      </div>

      {activeTab === 'assistant' ? (
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="mr-3 mt-1 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                           <Scale size={16} />
                      </div>
                  </div>
                )}
                <FormattedMessage text={msg.text} sources={msg.sources} role={msg.role} />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="mr-3 mt-1 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400/50">
                           <Scale size={16} />
                      </div>
                 </div>
                 <div className="bg-slate-800 rounded-2xl p-4 rounded-bl-none border border-slate-700 flex gap-1 items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="E.g., How do I register for VAT in Nigeria?"
                className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-3 rounded-lg transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            {paymentStep === 'idle' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Landmark className="text-indigo-400" />
                            Outstanding Tax Obligations
                        </h3>
                        
                        {taxRequirements.map((tax) => (
                            <div key={tax.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-indigo-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-lg font-bold text-white">{tax.title}</h4>
                                        <p className="text-slate-400 text-sm mt-1">{tax.description}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        tax.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                        {tax.status}
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold">Amount Due</p>
                                            <p className="text-xl font-bold text-white">${tax.amount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold">Due Date</p>
                                            <p className="text-sm font-medium text-slate-300">{tax.dueDate}</p>
                                        </div>
                                    </div>
                                    
                                    {tax.status === 'pending' && (
                                        <button 
                                            onClick={() => startPaymentFlow(tax)}
                                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                                        >
                                            Pay Now <ArrowRight size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-xl">
                            <h3 className="font-bold text-indigo-300 flex items-center gap-2 mb-4">
                                <Info size={18} />
                                NEO Middleware Payment
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Pay your taxes directly through NEO. We act as a secure middleware, processing your payment and settling it directly with the tax authorities.
                            </p>
                            <ul className="mt-4 space-y-2">
                                <li className="flex items-center gap-2 text-xs text-slate-400">
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                    Direct settlement to government accounts
                                </li>
                                <li className="flex items-center gap-2 text-xs text-slate-400">
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                    Automatic receipt generation
                                </li>
                                <li className="flex items-center gap-2 text-xs text-slate-400">
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                    Compliance record synchronization
                                </li>
                            </ul>
                        </div>
                        
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                            <h3 className="font-bold text-white mb-4">Tax Authorities</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Landmark size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">FIRS Nigeria</p>
                                        <p className="text-xs text-slate-500">Federal Inland Revenue Service</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-50">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Landmark size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">LIRS Lagos</p>
                                        <p className="text-xs text-slate-500">Lagos State Internal Revenue</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {paymentStep !== 'idle' && (
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl animate-scale-in">
                        {paymentStep === 'instruct' && (
                            <div className="space-y-6">
                                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                                    <Info size={32} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white">Payment Instructions</h3>
                                    <p className="text-slate-400 mt-2">Before you proceed with the ${selectedTax?.amount} payment for {selectedTax?.title}:</p>
                                </div>
                                
                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                                        <p className="text-sm text-slate-300">Ensure your business TIN is correctly linked in your profile.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                                        <p className="text-sm text-slate-300">NEO will process this payment through our secure middleware partner.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                                        <p className="text-sm text-slate-300">The funds will be paid directly to the {selectedTax?.authority} account.</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button 
                                        onClick={resetPayment}
                                        className="flex-1 py-3 border border-slate-700 hover:bg-slate-800 rounded-xl font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleProcessPayment}
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        Proceed to Pay <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {paymentStep === 'pay' && (
                            <div className="text-center space-y-6 py-10">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                                        <CreditCard size={32} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Processing Payment</h3>
                                    <p className="text-slate-400 mt-2">Communicating with {selectedTax?.authority} middleware...</p>
                                </div>
                                <div className="text-xs text-slate-500 font-mono">
                                    TXID: {Math.random().toString(36).substring(7).toUpperCase()}
                                </div>
                            </div>
                        )}

                        {paymentStep === 'success' && (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                                    <CheckCircle2 size={40} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Payment Successful</h3>
                                    <p className="text-slate-400 mt-2">Your tax obligation has been settled directly with the authority.</p>
                                </div>
                                
                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-left">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-500">Receipt No:</span>
                                        <span className="text-slate-200 font-mono">NEO-TAX-{Math.floor(Math.random() * 1000000)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Settled To:</span>
                                        <span className="text-slate-200">{selectedTax?.authority}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={resetPayment}
                                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                                >
                                    Back to Portal
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Compliance;