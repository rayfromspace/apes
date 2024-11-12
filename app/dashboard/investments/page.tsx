import { InvestmentsHeader } from "@/components/investments/investments-header"
import { InvestmentsList } from "@/components/investments/investments-list"
import { InvestmentStats } from "@/components/investments/investment-stats"

export default function InvestmentsPage() {
  return (
    <div className="container py-6 space-y-8">
      <InvestmentsHeader />
      <InvestmentStats />
      <InvestmentsList />
    </div>
  )
}