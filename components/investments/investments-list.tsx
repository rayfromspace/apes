import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const investments = [
  {
    id: "1",
    project: "Digital Art Marketplace",
    category: "Entertainment",
    amount: 12000,
    status: "Active",
    return: "+22.5%",
  },
  {
    id: "2",
    project: "AI Content Platform",
    category: "Software",
    amount: 8500,
    status: "Pending",
    return: "--",
  },
  {
    id: "3",
    project: "Web3 Gaming",
    category: "Gaming",
    amount: 15000,
    status: "Profitable",
    return: "+45.2%",
  },
  {
    id: "4",
    project: "Virtual Event Platform",
    category: "Entertainment",
    amount: 10000,
    status: "Active",
    return: "+18.3%",
  },
  {
    id: "5",
    project: "E-learning Platform",
    category: "Education",
    amount: 7500,
    status: "Active",
    return: "+12.7%",
  },
  {
    id: "6",
    project: "DeFi Trading Bot",
    category: "Finance",
    amount: 20000,
    status: "Profitable",
    return: "+38.9%",
  },
  {
    id: "7",
    project: "Digital Marketing Suite",
    category: "Services",
    amount: 9000,
    status: "Pending",
    return: "--",
  },
  {
    id: "8",
    project: "NFT Marketplace",
    category: "Blockchain",
    amount: 25000,
    status: "Active",
    return: "+28.4%",
  },
]

const statusColors = {
  Active: "bg-blue-500/10 text-blue-500",
  Pending: "bg-yellow-500/10 text-yellow-500",
  Profitable: "bg-green-500/10 text-green-500",
}

export function InvestmentsList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Return</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell className="font-medium">{investment.project}</TableCell>
              <TableCell>{investment.category}</TableCell>
              <TableCell>${investment.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  className={
                    statusColors[investment.status as keyof typeof statusColors]
                  }
                >
                  {investment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className={investment.return.startsWith("+") ? "text-green-600" : ""}>
                  {investment.return}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/investments/${investment.id}`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}