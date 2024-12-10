import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex flex-col flex-1 gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
