import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface InvestorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const investors = [
  { name: "John Smith", amount: 50000, vestedPercentage: 10 },
  { name: "Jane Doe", amount: 75000, vestedPercentage: 15 },
  { name: "Acme Ventures", amount: 100000, vestedPercentage: 20 },
]

export function InvestorDialog({ open, onOpenChange }: InvestorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Investor Information</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Investor Name</TableHead>
              <TableHead>Amount Invested</TableHead>
              <TableHead>Vested Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investors.map((investor, index) => (
              <TableRow key={index}>
                <TableCell>{investor.name}</TableCell>
                <TableCell>${investor.amount.toLocaleString()}</TableCell>
                <TableCell>{investor.vestedPercentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
