import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Expense } from "./budget-page"

interface ExpenseTableProps {
  expenses: Expense[]
}

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  approved: "bg-green-100 text-green-800 hover:bg-green-100",
  rejected: "bg-red-100 text-red-800 hover:bg-red-100",
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>{expense.description}</TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>${expense.amount.toLocaleString()}</TableCell>
            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge 
                variant="secondary"
                className={statusStyles[expense.status]}
              >
                {expense.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
