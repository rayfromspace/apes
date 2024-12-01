import type { User } from './user';
import type { Project } from './project';

export type InvestmentType = 'seed' | 'series_a' | 'series_b' | 'series_c' | 'other';
export type InvestmentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type InvestmentCurrency = 'USD' | 'EUR' | 'GBP';

export interface Investment {
  id: string;
  project_id: string;
  investor_id: string;
  amount: number;
  currency: InvestmentCurrency;
  type: InvestmentType;
  status: InvestmentStatus;
  equity_percentage?: number;
  valuation?: number;
  date: string;
  notes?: string;
  documents?: InvestmentDocument[];
  terms?: InvestmentTerms;
  created_at: string;
  updated_at: string;
}

export interface InvestmentDocument {
  id: string;
  investment_id: string;
  name: string;
  type: 'term_sheet' | 'contract' | 'agreement' | 'other';
  url: string;
  uploaded_by: string;
  created_at: string;
}

export interface InvestmentTerms {
  id: string;
  investment_id: string;
  board_seats?: number;
  pro_rata_rights: boolean;
  voting_rights: boolean;
  liquidation_preference?: number;
  lock_up_period?: number;
  additional_terms?: string;
}

export interface InvestmentWithRelations extends Investment {
  project: Project;
  investor: User;
  documents: InvestmentDocument[];
  terms: InvestmentTerms;
}

export interface InvestmentStats {
  total_invested: number;
  total_investments: number;
  investments_by_type: Record<InvestmentType, number>;
  investments_by_status: Record<InvestmentStatus, number>;
  average_investment: number;
  largest_investment: number;
  total_equity: number;
}

export interface InvestmentRound {
  id: string;
  project_id: string;
  type: InvestmentType;
  target_amount: number;
  raised_amount: number;
  currency: InvestmentCurrency;
  valuation?: number;
  start_date: string;
  end_date?: string;
  status: 'open' | 'closed' | 'cancelled';
  minimum_investment?: number;
  maximum_investment?: number;
  investments: Investment[];
  created_at: string;
  updated_at: string;
}

export interface InvestmentMetrics {
  roi?: number;
  irr?: number;
  holding_period?: number;
  cash_on_cash?: number;
  exit_multiple?: number;
}
