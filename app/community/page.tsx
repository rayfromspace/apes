import { CommunityFeed } from "@/components/community/feed";
import { CommunitySidebar } from "@/components/community/sidebar";

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CommunityFeed />
        </div>
        <div className="lg:col-span-1">
          <CommunitySidebar />
        </div>
      </div>
    </div>
  );
}