import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BotLogsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-4">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Live mode card skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>

        {/* Overview cards skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and filters skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 flex items-center gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>

        {/* Table skeleton */}
        <div className="space-y-4">
          {/* Desktop table skeleton */}
          <div className="hidden md:block rounded-md border">
            <div className="border-b p-4">
              <div className="flex items-center gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))}
              </div>
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="border-b p-4 last:border-b-0">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile cards skeleton */}
          <div className="md:hidden space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
