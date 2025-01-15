import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
      {...props}
    />
  );
}

export function SkeletonText({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      className={cn('h-4 w-[250px]', className)}
      {...props}
    />
  );
}

export function VenueSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <SkeletonText className="w-3/4" />
      <SkeletonText className="w-1/2" />
      <div className="flex justify-between items-center mt-4">
        <SkeletonText className="w-1/4" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between">
        <SkeletonText className="w-1/3" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="space-y-2">
        <SkeletonText className="w-full" />
        <SkeletonText className="w-2/3" />
      </div>
      <div className="flex justify-between items-end pt-2">
        <div className="space-y-1">
          <SkeletonText className="w-20" />
          <SkeletonText className="w-32" />
        </div>
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <SkeletonText className="w-32" />
          <SkeletonText className="w-48" />
        </div>
      </div>
      <div className="space-y-4">
        <SkeletonText className="w-full" />
        <SkeletonText className="w-3/4" />
        <SkeletonText className="w-2/3" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonText 
          key={i}
          className={cn(
            i === 0 ? 'w-1/4' : 'w-1/6'
          )}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4 
}: { 
  rows?: number; 
  columns?: number 
}) {
  return (
    <div className="border rounded-lg divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-1">
          <SkeletonText className="w-24" />
          <Skeleton className="w-full h-10 rounded" />
        </div>
      ))}
      <Skeleton className="w-full h-12 rounded bg-black" />
    </div>
  );
} 