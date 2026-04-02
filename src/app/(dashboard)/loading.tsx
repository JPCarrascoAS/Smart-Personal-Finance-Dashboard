import { SkeletonCard } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="animate-shimmer h-8 w-40 rounded-lg" />
        <div className="animate-shimmer h-4 w-64 rounded-lg mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonCard className="lg:col-span-2 h-[360px]" lines={0} />
        <SkeletonCard className="h-[360px]" lines={0} />
      </div>
      <SkeletonCard lines={6} />
    </div>
  );
}
