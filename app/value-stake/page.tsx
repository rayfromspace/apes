import { ValueStakeHeader } from "@/components/value-stake/header";
import { ValueStakePortfolio } from "@/components/value-stake/portfolio";
import { ValueStakeMetrics } from "@/components/value-stake/metrics";
import { ValueStakeActivity } from "@/components/value-stake/activity";

export default function ValueStakePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-6">
        <ValueStakeHeader />
        <ValueStakeMetrics />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ValueStakePortfolio />
          </div>
          <div>
            <ValueStakeActivity />
          </div>
        </div>
      </div>
    </div>
  );
}