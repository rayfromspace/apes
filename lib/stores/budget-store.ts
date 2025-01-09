import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  status: "pending" | "approved" | "rejected"
  paidFromTreasury: boolean
  projectId: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  projectId: string
}

interface BudgetState {
  expenses: Expense[]
  transactions: Transaction[]
  totalBudget: number
  treasuryBalance: number
  isLoading: boolean
  error: string | null
  fetchBudgetData: (projectId: string) => Promise<void>
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
  updateExpenseStatus: (id: string, status: Expense['status']) => Promise<void>
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  expenses: [],
  transactions: [],
  totalBudget: 0,
  treasuryBalance: 0,
  isLoading: false,
  error: null,

  fetchBudgetData: async (projectId: string) => {
    set({ isLoading: true, error: null })

    try {
      // Fetch expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('project_id', projectId)

      if (expensesError) throw expensesError

      // Fetch transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('project_id', projectId)

      if (transactionsError) throw transactionsError

      // Fetch project budget details
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('total_budget, treasury_balance')
        .eq('id', projectId)
        .single()

      if (projectError) throw projectError

      set({
        expenses: expenses || [],
        transactions: transactions || [],
        totalBudget: project?.total_budget || 0,
        treasuryBalance: project?.treasury_balance || 0,
        isLoading: false
      })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addExpense: async (expense) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select()
        .single()

      if (error) throw error

      set(state => ({
        expenses: [...state.expenses, data],
        isLoading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  updateExpenseStatus: async (id, status) => {
    set({ isLoading: true, error: null })

    try {
      const { error } = await supabase
        .from('expenses')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      set(state => ({
        expenses: state.expenses.map(expense =>
          expense.id === id ? { ...expense, status } : expense
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single()

      if (error) throw error

      // Update treasury balance
      const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          treasury_balance: get().treasuryBalance + balanceChange
        })
        .eq('id', transaction.projectId)

      if (updateError) throw updateError

      set(state => ({
        transactions: [...state.transactions, data],
        treasuryBalance: state.treasuryBalance + balanceChange,
        isLoading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  }
}))
