export enum View {
  DASHBOARD = 'DASHBOARD',
  FINANCE = 'FINANCE',
  SOCIAL = 'SOCIAL',
  COMPLIANCE = 'COMPLIANCE',
  COMMUNITY = 'COMMUNITY',
  ADVISOR = 'ADVISOR',
  PROFILE = 'PROFILE'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  items: { description: string; quantity: number; price: number }[];
  syncedTo?: {
    type: 'payment' | 'payable';
    id: string;
  };
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
}

export interface Payable {
  id: string;
  invoiceId: string;
  amount: number;
  dueDate: string;
  vendor: string;
  status: 'pending' | 'paid';
}

export interface SocialPost {
  id: string;
  content: string;
  platform: 'twitter' | 'instagram' | 'linkedin';
  status: 'scheduled' | 'posted' | 'draft';
  scheduledFor?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  income?: number;
  expense?: number;
}

export interface Source {
  title: string;
  uri: string;
}

export interface AdviceMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: Source[];
}

export interface UserProfile {
  name: string;
  email: string;
  businessName: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  location?: string;
}