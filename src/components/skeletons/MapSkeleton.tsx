import { Skeleton } from '@/components/ui/Skeleton'

export function MapSkeleton() {
  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
      <Skeleton className="absolute inset-0" />
    </div>
  )
} 