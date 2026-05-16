import { Skeleton } from '@/shared/components/ui/skeleton';

interface BbaseDataTableSkeletonProps {
  columns: number;
}

export function BbaseDataTableSkeleton({ columns }: BbaseDataTableSkeletonProps) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div className="flex gap-2" key={rowIndex}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <Skeleton className="h-8 flex-1" key={columnIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}
