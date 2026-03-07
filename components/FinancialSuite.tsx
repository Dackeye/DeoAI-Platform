
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Transaction, ChartDataPoint, Invoice } from '../types';
import { 
  ArrowUpRight, ArrowDownRight, BrainCircuit, 
  FileText, Plus, Upload, RefreshCw, CheckCircle, CreditCard,
  Trash2, CheckSquare, Square, Filter, DollarSign, MoreHorizontal,
  Edit2, Link as LinkIcon, AlertCircle, Loader2
} from 'lucide-react';
import { analyzeFinancials, parseReceiptWithValidation } from '../services/geminiService';
import { Payment, Payable } from '../types';

const mockTransactions: Transaction[] = [
  { id: '1', date: '2023-10-25', description: 'Client Payment - Web Design', amount: 1200, type: 'income', category: 'Service' },
  { id: '2', date: '2023-10-26', description: 'Software Subscription', amount: 45, type: 'expense', category: 'Operations' },
  { id: '3', date: '2023-10-27', description: 'Office Supplies', amount: 120, type: 'expense', category: 'Operations' },
  { id: '4', date: '2023-10-28', description: 'Product Sale #2241', amount: 350, type: 'income', category: 'Sales' },
  { id: '5', date: '2023-10-29', description: 'Social Media Ads', amount: 150, type: 'expense', category: 'Marketing' },
];

const mockChartData: ChartDataPoint[] = [
  { name: 'Mon', income: 400, expense: 240, value: 0 },
  { name: 'Tue', income: 300, expense: 139, value: 0 },
  { name: 'Wed', income: 200, expense: 980, value: 0 },
  { name: 'Thu', income: 278, expense: 390, value: 0 },
  { name: 'Fri', income: 189, expense: 480, value: 0 },
  { name: 'Sat', income: 2390, expense: 380, value: 0 },
  { name: 'Sun', income: 3490, expense: 430, value: 0 },
];

const initialInvoices: Invoice[] = [
  { id: 'INV-001', clientName: 'TechStart Inc.', amount: 2500, dueDate: '2023-11-15', status: 'pending', items: [] },
  { id: 'INV-002', clientName: 'Green Café', amount: 450, dueDate: '2023-10-30', status: 'paid', items: [] },
  { id: 'INV-003', clientName: 'Alpha Designs', amount: 1200, dueDate: '2023-11-01', status: 'overdue', items: [] },
];

const FinancialSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices'>('overview');
  const [insight, setInsight] = useState<string>('Analyzing your financial health...');
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payables, setPayables] = useState<Payable[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  
  // Selection & Filtering
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  
  // New Invoice Form State
  const [newInvClient, setNewInvClient] = useState('');
  const [newInvAmount, setNewInvAmount] = useState('');
  const [newInvDate, setNewInvDate] = useState('');
  const [newInvStatus, setNewInvStatus] = useState<'paid' | 'pending' | 'overdue'>('pending');

  useEffect(() => {
    const fetchAnalysis = async () => {
        const summary = "Total Income: $5000, Total Expense: $2200. High marketing spend on Wednesday.";
        const result = await analyzeFinancials(summary);
        setInsight(result);
    };
    fetchAnalysis();
  }, []);

  // --- Handlers ---

  const handleOpaySync = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
        const newInvoice: Invoice = {
            id: `INV-OPY-${Math.floor(Math.random() * 1000)}`,
            clientName: 'Opay Transfer - Unknown',
            amount: 750,
            dueDate: new Date().toISOString().split('T')[0],
            status: 'paid',
            items: []
        };
        setInvoices([newInvoice, ...invoices]);
        setIsSyncing(false);
        alert("Synced 1 new transaction from Opay Business");
    }, 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setIsUploading(true);
        
        try {
            // Convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const mimeType = file.type;
                
                const result = await parseReceiptWithValidation(base64, mimeType);
                
                if (result.isFinancialStatement && result.data) {
                    const newInvoice: Invoice = {
                        id: `INV-UPL-${Math.floor(Math.random() * 1000)}`,
                        clientName: result.data.clientName || 'Parsed Client',
                        amount: result.data.amount || 0,
                        dueDate: result.data.date || new Date().toISOString().split('T')[0],
                        status: 'pending',
                        items: result.data.items || []
                    };
                    setInvoices(prev => [newInvoice, ...prev]);
                    alert("Invoice uploaded and parsed successfully!");
                } else {
                    alert("The uploaded file does not appear to be a valid financial statement or receipt. Please upload a clear image of an invoice or receipt.");
                }
                setIsUploading(false);
            };
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error processing file.");
            setIsUploading(false);
        }
    }
  };

  const handleAddManual = () => {
    if(!newInvClient || !newInvAmount) return;
    
    if (editingInvoiceId) {
        // Update existing
        const updated = invoices.map(inv => 
            inv.id === editingInvoiceId 
            ? { 
                ...inv, 
                clientName: newInvClient, 
                amount: parseFloat(newInvAmount), 
                dueDate: newInvDate || inv.dueDate,
                status: newInvStatus
              } 
            : inv
        );
        setInvoices(updated);
        setEditingInvoiceId(null);
    } else {
        // Create new
        const inv: Invoice = {
            id: `INV-MAN-${Date.now()}`,
            clientName: newInvClient,
            amount: parseFloat(newInvAmount),
            dueDate: newInvDate || new Date().toISOString().split('T')[0],
            status: newInvStatus,
            items: []
        };
        setInvoices([inv, ...invoices]);
    }
    
    setShowAddInvoice(false);
    setNewInvClient('');
    setNewInvAmount('');
    setNewInvDate('');
    setNewInvStatus('pending');
  };

  const handleEditInvoice = (inv: Invoice) => {
    setEditingInvoiceId(inv.id);
    setNewInvClient(inv.clientName);
    setNewInvAmount(inv.amount.toString());
    setNewInvDate(inv.dueDate);
    setNewInvStatus(inv.status);
    setShowAddInvoice(true);
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
        setInvoices(invoices.filter(inv => inv.id !== id));
        if (selectedIds.has(id)) {
            const newSelected = new Set(selectedIds);
            newSelected.delete(id);
            setSelectedIds(newSelected);
        }
    }
  };

  const handleSyncToFinancial = (inv: Invoice) => {
    if (inv.syncedTo) {
        alert("This invoice is already synced.");
        return;
    }

    const isIncome = inv.status === 'paid' || inv.clientName.toLowerCase().includes('client') || inv.amount > 1000;
    
    if (isIncome) {
        // Sync to Payment
        const payment: Payment = {
            id: `PAY-${Date.now()}`,
            invoiceId: inv.id,
            amount: inv.amount,
            date: new Date().toISOString().split('T')[0],
            method: 'Bank Transfer',
            reference: `REF-${inv.id}`
        };
        setPayments([...payments, payment]);
        setInvoices(invoices.map(i => i.id === inv.id ? { ...i, syncedTo: { type: 'payment', id: payment.id } } : i));
        alert(`Synced to Payment: ${payment.id}`);
    } else {
        // Sync to Payable
        const payable: Payable = {
            id: `PYB-${Date.now()}`,
            invoiceId: inv.id,
            amount: inv.amount,
            dueDate: inv.dueDate,
            vendor: inv.clientName,
            status: inv.status === 'paid' ? 'paid' : 'pending'
        };
        setPayables([...payables, payable]);
        setInvoices(invoices.map(i => i.id === inv.id ? { ...i, syncedTo: { type: 'payable', id: payable.id } } : i));
        alert(`Synced to Payable: ${payable.id}`);
    }
  };

  // --- Selection Logic ---

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredInvoices.length && filteredInvoices.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInvoices.map(i => i.id)));
    }
  };

  const handleBatchStatusChange = (status: 'paid' | 'pending' | 'overdue') => {
    const updatedInvoices = invoices.map(inv => 
      selectedIds.has(inv.id) ? { ...inv, status } : inv
    );
    setInvoices(updatedInvoices);
    setSelectedIds(new Set()); // Clear selection
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedIds.size} invoices?`)) {
        const updatedInvoices = invoices.filter(inv => !selectedIds.has(inv.id));
        setInvoices(updatedInvoices);
        setSelectedIds(new Set());
    }
  };

  // --- Derived State ---
  
  const filteredInvoices = invoices.filter(inv => 
    statusFilter === 'all' ? true : inv.status === statusFilter
  );

  const allSelected = filteredInvoices.length > 0 && selectedIds.size === filteredInvoices.length;

  return (
    <div className="p-6 space-y-6 animate-fade-in text-slate-100 mb-20 md:mb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Financial Suite</h2>
          <p className="text-slate-400">Manage your money, invoices, and analytics.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('invoices')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'invoices' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                Invoices & Billing
            </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
             {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <div className="flex justify-between items-start">
                    <div>
                    <p className="text-slate-400 text-sm">Total Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">$12,450.00</h3>
                    </div>
                    <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <ArrowUpRight className="text-emerald-400" size={20} />
                    </div>
                </div>
                <p className="text-emerald-400 text-sm mt-4 flex items-center gap-1">
                    +12.5% <span className="text-slate-500">vs last month</span>
                </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <div className="flex justify-between items-start">
                    <div>
                    <p className="text-slate-400 text-sm">Total Expenses</p>
                    <h3 className="text-2xl font-bold mt-1">$4,230.00</h3>
                    </div>
                    <div className="bg-rose-500/20 p-2 rounded-lg">
                    <ArrowDownRight className="text-rose-400" size={20} />
                    </div>
                </div>
                <p className="text-rose-400 text-sm mt-4 flex items-center gap-1">
                    +2.1% <span className="text-slate-500">vs last month</span>
                </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BrainCircuit size={64} className="text-indigo-400"/>
                    </div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                    <p className="text-indigo-400 text-sm font-semibold flex items-center gap-2">
                        <BrainCircuit size={14} /> NEO Insight
                    </p>
                    <div className="mt-2 text-sm text-slate-300 leading-relaxed">
                        {insight}
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h3 className="font-semibold mb-6">Income vs Expense</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                        />
                        <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h3 className="font-semibold mb-6">Profit Trend</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData}>
                        <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        />
                        <Area type="monotone" dataKey="income" stroke="#2dd4bf" fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </div>

             {/* Recent Transactions Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="font-semibold">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {mockTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">{t.date}</td>
                                    <td className="px-6 py-4 text-slate-200 font-medium">{t.description}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-medium ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-6 animate-fade-in">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                 {/* Main Controls */}
                 <div className="flex gap-3">
                    <button 
                        onClick={() => setShowAddInvoice(!showAddInvoice)}
                        className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 text-sm font-medium"
                    >
                        <Plus size={18} /> New Invoice
                    </button>
                    
                    <label className={`p-3 bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-sm font-medium ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isUploading ? <Loader2 size={18} className="animate-spin text-indigo-400" /> : <Upload size={18} className="text-indigo-400" />}
                        <span>{isUploading ? 'Parsing...' : 'Import'}</span>
                        <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" disabled={isUploading} />
                    </label>

                     <button 
                        onClick={handleOpaySync}
                        disabled={isSyncing}
                        className="p-3 bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-emerald-400 rounded-lg flex items-center justify-center gap-2 transition-all text-sm font-medium"
                    >
                        <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                        {isSyncing ? 'Syncing...' : 'Opay Sync'}
                    </button>
                 </div>

                 {/* Filters */}
                 <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
                    <Filter size={14} className="ml-2 text-slate-500" />
                    {['all', 'pending', 'paid', 'overdue'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter as any)}
                            className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${
                                statusFilter === filter 
                                ? 'bg-slate-800 text-white' 
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Manual Entry Form */}
            {showAddInvoice && (
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl animate-fade-in ring-1 ring-indigo-500/50">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        {editingInvoiceId ? <Edit2 size={18} className="text-indigo-400" /> : <Plus size={18} className="text-indigo-400" />}
                        {editingInvoiceId ? 'Edit Invoice' : 'Create Invoice'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input 
                            type="text" 
                            placeholder="Client Name" 
                            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={newInvClient}
                            onChange={e => setNewInvClient(e.target.value)}
                        />
                        <input 
                            type="number" 
                            placeholder="Amount ($)" 
                            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={newInvAmount}
                            onChange={e => setNewInvAmount(e.target.value)}
                        />
                        <input 
                            type="date" 
                            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={newInvDate}
                            onChange={e => setNewInvDate(e.target.value)}
                        />
                         <select
                            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={newInvStatus}
                            onChange={(e) => setNewInvStatus(e.target.value as any)}
                         >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                         </select>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => { setShowAddInvoice(false); setEditingInvoiceId(null); }} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                        <button onClick={handleAddManual} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            {editingInvoiceId ? 'Update Invoice' : 'Create Invoice'}
                        </button>
                    </div>
                </div>
            )}

            {/* Batch Selection Action Bar */}
            {selectedIds.size > 0 && (
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-xl flex items-center justify-between animate-fade-in">
                    <span className="text-indigo-200 text-sm font-medium ml-2">
                        {selectedIds.size} selected
                    </span>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => handleBatchStatusChange('paid')}
                            className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600/30 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                            <CheckCircle size={14} /> Record Payment
                        </button>
                         <button 
                            onClick={() => handleBatchStatusChange('overdue')}
                            className="px-3 py-1.5 bg-rose-600/20 text-rose-400 border border-rose-600/30 hover:bg-rose-600/30 rounded-lg text-xs font-medium"
                        >
                            Mark Overdue
                        </button>
                        <div className="w-px h-6 bg-indigo-500/20 mx-1"></div>
                        <button 
                            onClick={handleDeleteSelected}
                            className="px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-900/20 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Invoice List Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-950/50">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-white transition-colors">
                        {allSelected ? <CheckSquare size={20} className="text-indigo-500" /> : <Square size={20} />}
                    </button>
                    <div className="grid grid-cols-12 w-full text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-4">Client & Details</div>
                        <div className="col-span-3 text-right">Amount</div>
                        <div className="col-span-3 text-center">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                </div>
                
                {filteredInvoices.length > 0 ? (
                    <div className="divide-y divide-slate-800">
                        {filteredInvoices.map((inv) => (
                            <div key={inv.id} className={`p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors group ${selectedIds.has(inv.id) ? 'bg-indigo-900/10' : ''}`}>
                                <button onClick={() => toggleSelection(inv.id)} className="text-slate-400 hover:text-white transition-colors">
                                    {selectedIds.has(inv.id) ? <CheckSquare size={20} className="text-indigo-500" /> : <Square size={20} />}
                                </button>
                                
                                <div className="grid grid-cols-12 w-full items-center">
                                    <div className="col-span-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded-lg text-indigo-400 hidden sm:block">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-slate-200">{inv.clientName}</h4>
                                                    {inv.syncedTo && (
                                                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                            <LinkIcon size={10} /> Synced
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 text-xs text-slate-400 mt-0.5">
                                                    <span>#{inv.id.split('-').pop()}</span>
                                                    <span>•</span>
                                                    <span>Due {inv.dueDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3 text-right">
                                         <p className="font-bold text-white">${inv.amount.toLocaleString()}</p>
                                    </div>

                                    <div className="col-span-3 flex justify-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${
                                            inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                            inv.status === 'overdue' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </div>

                                     <div className="col-span-2 flex justify-end gap-2">
                                        {inv.status !== 'paid' && (
                                            <button 
                                                title="Mark as Paid"
                                                onClick={() => {
                                                    toggleSelection(inv.id);
                                                    handleBatchStatusChange('paid');
                                                }}
                                                className="p-1.5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded transition-colors"
                                            >
                                                <DollarSign size={16} />
                                            </button>
                                        )}
                                        <button 
                                            title="Sync to Financials"
                                            onClick={() => handleSyncToFinancial(inv)}
                                            className={`p-1.5 rounded transition-colors ${inv.syncedTo ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'}`}
                                        >
                                            <LinkIcon size={16} />
                                        </button>
                                        <button 
                                            title="Edit"
                                            onClick={() => handleEditInvoice(inv)}
                                            className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            title="Delete"
                                            onClick={() => handleDeleteInvoice(inv.id)}
                                            className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center text-slate-500">
                        {statusFilter !== 'all' ? `No ${statusFilter} invoices found.` : 'No invoices found. Create one or sync with Opay.'}
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default FinancialSuite;
