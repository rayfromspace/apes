'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  visibility: 'public' | 'private';
  status: 'active' | 'completed' | 'archived';
  founder_id: string;
  created_at: string;
  updated_at: string;
}

interface BudgetPageProps {
  project: Project;
  userRole: string | null;
}

export function BudgetPage({ project, userRole }: BudgetPageProps) {
  const canManageBudget = userRole === 'founder' || userRole === 'admin';

  // Demo data
  const budget = {
    total: 100000,
    spent: 45000,
    remaining: 55000,
    transactions: [
      {
        id: 1,
        description: 'Software Licenses',
        amount: 2500,
        type: 'expense',
        date: '2024-01-15',
      },
      {
        id: 2,
        description: 'Client Payment',
        amount: 10000,
        type: 'income',
        date: '2024-01-10',
      },
      {
        id: 3,
        description: 'Hardware Equipment',
        amount: 3500,
        type: 'expense',
        date: '2024-01-05',
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Budget Overview</h2>
        {canManageBudget && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Budget
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${budget.total.toLocaleString()}
            </div>
            <Progress
              value={(budget.spent / budget.total) * 100}
              className="mt-3"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {((budget.spent / budget.total) * 100).toFixed(1)}% spent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Spent
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ${budget.spent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total expenses to date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Remaining
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ${budget.remaining.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Available budget
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {budget.transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                <div className="mr-4">
                  {transaction.type === 'income' ? (
                    <div className="p-2 bg-green-100 rounded-full">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  ) : (
                    <div className="p-2 bg-red-100 rounded-full">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
