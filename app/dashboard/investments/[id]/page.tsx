import { InvestmentDetails } from "@/components/investments/investment-details"
import { InvestmentHeader } from "@/components/investments/investment-header"
import { InvestmentMetrics } from "@/components/investments/investment-metrics"
import { InvestmentTransactions } from "@/components/investments/investment-transactions"

export function generateStaticParams() {
  // Generate params for all possible investment IDs
  return Array.from({ length: 10 }, (_, i) => ({
    id: (i + 1).toString()
  }))
}

export default function InvestmentPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <InvestmentHeader id={params.id} />
      <div className="grid gap-6 md:grid-cols-2">
        <InvestmentMetrics id={params.id} />
        <InvestmentDetails id={params.id} />
      </div>
      <InvestmentTransactions id={params.id} />
    </div>
  )
}