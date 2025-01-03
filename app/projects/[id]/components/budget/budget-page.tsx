"use client"

import { useState } from "react"
import { Plus, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { BudgetStats } from "./budget-stats"
import { ExpenseTable } from "./expense-table"
import { AddExpenseDialog } from "./add-expense-dialog"
import { Transactions } from "./transactions"
import { TeamSalaries } from "./team-salaries"
import { InvestorDialog } from "./investor-dialog"

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  status: "pending" | "approved" | "rejected"
  paidFromTreasury: boolean
}

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
}

export interface TeamMember {
  id: string
  name: string
  role: string
  salary: number
}

const initialExpenses: Expense[] = [
  {
    id: "1",
    description: "Team lunch meeting",
    amount: 150.00,
    category: "Food & Beverages",
    date: "2024-01-15",
    status: "approved",
    paidFromTreasury: false
  },
  {
    id: "2",
    description: "Software licenses",
    amount: 299.99,
    category: "Software",
    date: "2024-01-14",
    status: "pending",
    paidFromTreasury: false
  },
  {
    id: "3",
    description: "Office supplies",
    amount: 75.50,
    category: "Supplies",
    date: "2024-01-13",
    status: "approved",
    paidFromTreasury: true
  }
]

const initialTransactions: Transaction[] = [
  {
    id: "1",
    description: "Investor funding",
    amount: 50000,
    date: "2024-01-01",
    type: "income"
  },
  {
    id: "2",
    description: "Office rent",
    amount: 2000,
    date: "2024-01-05",
    type: "expense"
  },
  {
    id: "3",
    description: "Client payment",
    amount: 5000,
    date: "2024-01-10",
    type: "income"
  }
]

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Project Manager",
    salary: 5000
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Senior Developer",
    salary: 4500
  },
  {
    id: "3",
    name: "Mike Johnson",
    role: "Designer",
    salary: 4000
  }
]

export function BudgetPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isInvestorDialogOpen, setIsInvestorDialogOpen] = useState(false)

  const totalBudget = 100000
  const treasuryBalance = 75000
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const expensesFromBudget = expenses
    .filter(expense => !expense.paidFromTreasury)
    .reduce((sum, expense) => sum + expense.amount, 0)
  const expensesFromTreasury = expenses
    .filter(expense => expense.paidFromTreasury)
    .reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = totalBudget - expensesFromBudget
  const remainingTreasury = treasuryBalance - expensesFromTreasury
  const totalSalaries = teamMembers.reduce((sum, member) => sum + member.salary, 0)

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
        totalExpenses={totalExpenses}
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
        onSubmit={(expense) => {
          setExpenses([...expenses, { ...expense, id: String(expenses.length + 1) }])
          setIsAddExpenseOpen(false)
        }}
      />

      <InvestorDialog
        open={isInvestorDialogOpen}
        onOpenChange={setIsInvestorDialogOpen}
      />
    </div>
  )
}
