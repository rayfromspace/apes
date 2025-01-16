import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface Investment {
  id: string;
  user_id: string;
  project_id: string;
  type: 'equity' | 'token' | 'revenue_share';
  invested: number;
  current_value: number;
  roi: number;
  progress: number;
  status: 'active' | 'completed' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface InvestmentActivity {
  id: string;
  investment_id: string;
  user_id: string;
  action_type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface InvestmentStore {
  investments: Investment[];
  activities: InvestmentActivity[];
  isLoading: boolean;
  error: string | null;
  metrics: {
    totalInvested: number;
    totalValue: number;
    totalROI: number;
    monthlyChange: number;
  };
  fetchInvestments: () => Promise<void>;
  createInvestment: (data: Partial<Investment>) => Promise<Investment>;
  updateInvestment: (id: string, data: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  fetchActivities: () => Promise<void>;
  recordActivity: (data: Partial<InvestmentActivity>) => Promise<void>;
}

export const useInvestmentStore = create<InvestmentStore>((set, get) => ({
  investments: [],
  activities: [],
  isLoading: false,
  error: null,
  metrics: {
    totalInvested: 0,
    totalValue: 0,
    totalROI: 0,
    monthlyChange: 0,
  },

  fetchInvestments: async () => {
    const supabase = createClientComponentClient();
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const metrics = data.reduce(
        (acc, inv) => ({
          totalInvested: acc.totalInvested + inv.invested,
          totalValue: acc.totalValue + inv.current_value,
          totalROI: acc.totalROI + inv.roi,
          monthlyChange: acc.monthlyChange, // Calculate this separately
        }),
        { totalInvested: 0, totalValue: 0, totalROI: 0, monthlyChange: 0 }
      );

      set({ investments: data, metrics, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createInvestment: async (data) => {
    const supabase = createClientComponentClient();
    set({ isLoading: true, error: null });

    try {
      const { data: newInvestment, error } = await supabase
        .from('investments')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        investments: [newInvestment, ...state.investments],
        isLoading: false,
      }));

      // Record activity
      await get().recordActivity({
        investment_id: newInvestment.id,
        action_type: 'created',
        amount: newInvestment.invested,
        description: `New investment in project created`,
      });

      return newInvestment;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateInvestment: async (id, data) => {
    const supabase = createClientComponentClient();
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase
        .from('investments')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        investments: state.investments.map((inv) =>
          inv.id === id ? { ...inv, ...data } : inv
        ),
        isLoading: false,
      }));

      // Record activity
      await get().recordActivity({
        investment_id: id,
        action_type: 'updated',
        amount: data.current_value,
        description: `Investment updated`,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteInvestment: async (id) => {
    const supabase = createClientComponentClient();
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        investments: state.investments.filter((inv) => inv.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchActivities: async () => {
    const supabase = createClientComponentClient();
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('investment_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      set({ activities: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  recordActivity: async (data) => {
    const supabase = createClientComponentClient();

    try {
      const { error } = await supabase
        .from('investment_activities')
        .insert([data]);

      if (error) throw error;

      // Refresh activities
      await get().fetchActivities();
    } catch (error: any) {
      console.error('Error recording activity:', error);
    }
  },
}));
