import { ExploreFeed } from "@/components/explore/feed";
import { ExploreSidebar } from "@/components/explore/sidebar";

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid lg:grid-cols-3 gap-6 relative">
        <div className="lg:col-span-2">
          <ExploreFeed />
        </div>
        <div className="lg:col-span-1" style={{ isolation: 'isolate' }}>
          <ExploreSidebar />
        </div>
      </div>
    </div>
  );
}