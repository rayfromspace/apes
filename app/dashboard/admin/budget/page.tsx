"use client"

import { BudgetOverview } from "@/components/admin/budget/budget-overview"
import { BudgetPlanner } from "@/components/admin/budget/budget-planner"
import { ContractGenerator } from "@/components/admin/budget/contract-generator"
import { ExpenseRequests } from "@/components/admin/budget/expense-requests"
import { JobPostings } from "@/components/admin/budget/job-postings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminBudgetPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
        <p className="text-muted-foreground">
          Manage project budgets, contracts, and financial planning
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="planner">Budget Planner</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="expenses">Expense Requests</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BudgetOverview />
        </TabsContent>

        <TabsContent value="planner">
          <BudgetPlanner />
        </TabsContent>

        <TabsContent value="contracts">
          <ContractGenerator />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseRequests />
        </TabsContent>

        <TabsContent value="jobs">
          <JobPostings />
        </TabsContent>
      </Tabs>
    </div>
  )