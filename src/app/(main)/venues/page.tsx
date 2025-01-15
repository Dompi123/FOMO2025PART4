import { DataBoundary } from '@/components/error-boundaries/DataBoundary';
import { VenueSkeleton } from '@/components/ui/Skeleton';
import { useApi } from '@/hooks/useApi';
import { api } from '@/api';

function VenuesList() {
  const [{ data: venues, isLoading }, { execute }] = useApi(
    () => api.venues.getVenues({ limit: 10 }),
    { immediate: true }
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <VenueSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {venues?.map((venue) => (
        <div key={venue.id} className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold">{venue.name}</h2>
          <p className="text-gray-600">{venue.description}</p>
          {/* Add more venue details here */}
        </div>
      ))}
    </div>
  );
}

export default function VenuesPage() {
  return (
    <DataBoundary>
      <VenuesList />
    </DataBoundary>
  );
} 