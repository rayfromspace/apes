"use client"

import { useEffect, useState } from "react"
import { Plus, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { BudgetStats } from "./budget-stats"
import { ExpenseTable } from "./expense-table"
import { AddExpenseDialog } from "./add-expense-dialog"
import { Transactions } from "./transactions"
import { TeamSalaries } from "./team-salaries"
import { InvestorDialog } from "./investor-dialog"
import { useBudgetStore, type Expense } from "@/lib/stores/budget-store"
import { useParams } from "next/navigation"
import { useTeamStore } from "@/lib/stores/team-store"

export function BudgetPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const { 
    expenses, 
    transactions, 
    totalBudget,
    treasuryBalance,
    fetchBudgetData,
    addExpense,
    isLoading,
    error 
  } = useBudgetStore()
  
  const { teamMembers = [] } = useTeamStore()
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isInvestorDialogOpen, setIsInvestorDialogOpen] = useState(false)

  useEffect(() => {
    if (projectId) {
      fetchBudgetData(projectId)
    }
  }, [projectId, fetchBudgetData])

  const expensesFromBudget = expenses
    .filter(expense => !expense.paidFromTreasury)
    .reduce((sum, expense) => sum + expense.amount, 0)
  const expensesFromTreasury = expenses
    .filter(expense => expense.paidFromTreasury)
    .reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = totalBudget - expensesFromBudget
  const remainingTreasury = treasuryBalance - expensesFromTreasury
  const totalSalaries = teamMembers?.reduce((sum, member) => sum + (member.salary || 0), 0) || 0

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    await addExpense({ ...expense, projectId })
    setIsAddExpenseOpen(false)
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading budget data: {error}</div>
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Budget</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAddExpenseOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add expense
          </Button>
          <Button variant="outline" onClick={() => setIsInvestorDialogOpen(true)}>
            <TrendingUp className="mr-2 h-4 w-4" />
            View Investors
          </Button>
        </div>
      </div>
      
      <BudgetStats 
        totalBudget={totalBudget}
        totalExpenses={expensesFromBudget + expensesFromTreasury}
        remainingBudget={remainingBudget}
        treasuryBalance={treasuryBalance}
        remainingTreasury={remainingTreasury}
        totalSalaries={totalSalaries}
      />
      
      <div className="grid gap-4 md:grid-cols-2">
        <ExpenseTable expenses={expenses} />
        <Transactions transactions={transactions} />
      </div>

      <TeamSalaries teamMembers={teamMembers} />
      
      <AddExpenseDialog 
        open={isAddExpenseOpen} 
        onOpenChange={setIsAddExpenseOpen}
        onSubmit={handleAddExpense}
      />

      <InvestorDialog
        open={isInvestorDialogOpen}
        onOpenChange={setIsInvestorDialogOpen}
      />
    </div>
  )
}
