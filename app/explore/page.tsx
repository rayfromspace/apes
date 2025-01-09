import { ExploreFeed } from "@/components/explore/feed";
import { ExploreSidebar } from "@/components/explore/sidebar";

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExploreFeed />
        </div>
        <div className="lg:col-span-1">
          <ExploreSidebar />
        </div>
      </div>
    </div>
  );
}