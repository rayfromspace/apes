import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

const expenseRequests = [
  {
    id: 1,
    requester: "John Doe",
    amount: 5000,
    category: "Equipment",
    description: "New development workstations",
    status: "pending",
    date: "2024-03-15",
  },
  {
    id: 2,
    requester: "Sarah Smith",
    amount: 2500,
    category: "Marketing",
    description: "Social media campaign",
    status: "approved",
    date: "2024-03-14",
  },
  {
    id: 3,
    requester: "Mike Johnson",
    amount: 1500,
    category: "Software",
    description: "Annual software licenses",
    status: "rejected",
    date: "2024-03-13",
  },
]

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500",
  approved: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
}

export function ExpenseRequests() {
  const handleApprove = (id: number) => {
    toast.success("Expense request approved")
  }

  const handleReject = (id: number) => {
    toast.success("Expense request rejected")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenseRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.requester}</TableCell>
                <TableCell>${request.amount}</TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>{request.description}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      statusColors[request.status as keyof typeof statusColors]
                    }
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(request.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}