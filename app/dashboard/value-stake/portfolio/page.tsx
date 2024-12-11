import { ValueStakePortfolio } from "@/components/value-stake/portfolio";
import { ValueStakeMetrics } from "@/components/value-stake/metrics";
import { ValueStakeActivity } from "@/components/value-stake/activity";
import { ValueStakeHeader } from "@/components/value-stake/header";

export default function OriginalValueStakePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-6">
        <ValueStakeHeader />
        <ValueStakeMetrics />
        <div className="grid lg:grid-cols-3 gap-6">
          <ValueStakePortfolio />
          <ValueStakeActivity />
        </div>
      </div>
    </div>
  );
}
