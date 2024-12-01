import { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';
import { useAuth } from '../auth/store';

export interface Investment {
  id: string;
  amount: number;
  type: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'other';
  date: string;
  notes?: string;
  project_id: string;
  investor_id: string;
  created_at: string;
  updated_at: string;
}

export interface InvestmentStats {
  totalInvested: number;
  totalProjects: number;
  averageInvestment: number;
  investmentsByType: Record<Investment['type'], number>;
}

export function useInvestments(projectId?: string) {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchInvestments();
    }
  }, [user?.id, projectId]);

  const fetchInvestments = async () => {
    setLoading(true);
    const endpoint = projectId
      ? `/projects/${projectId}/investments`
      : '/investments';

    const { data, error } = await fetchApi<{
      investments: Investment[];
      stats: InvestmentStats;
    }>(endpoint);

    if (error) {
      setError(error.error);
    } else if (data) {
      setInvestments(data.investments);
      setStats(data.stats);
    }
    setLoading(false);
  };

  const createInvestment = async (
    investmentData: Omit<Investment, 'id' | 'created_at' | 'updated_at' | 'investor_id'>
  ) => {
    const { data, error } = await fetchApi<{ investment: Investment }>(
      '/investments',
      {
        method: 'POST',
        body: JSON.stringify(investmentData),
      }
    );

    if (error) {
      setError(error.error);
      return null;
    }

    setInvestments((prev) => [...prev, data.investment]);
    return data.investment;
  };

  const updateInvestment = async (
    id: string,
    updates: Partial<Investment>
  ) => {
    const { data, error } = await fetchApi<{ investment: Investment }>(
      `/investments/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    );

    if (error) {
      setError(error.error);
      return null;
    }

    setInvestments((prev) =>
      prev.map((inv) => (inv.id === id ? data.investment : inv))
    );
    return data.investment;
  };

  const deleteInvestment = async (id: string) => {
    const { error } = await fetchApi(`/investments/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      setError(error.error);
      return false;
    }

    setInvestments((prev) => prev.filter((inv) => inv.id !== id));
    return true;
  };

  return {
    investments,
    stats,
    loading,
    error,
    createInvestment,
    updateInvestment,
    deleteInvestment,
    refetch: fetchInvestments,
  };
}
