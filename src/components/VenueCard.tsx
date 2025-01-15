import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import type { Venue } from '@/types';

interface VenueCardProps {
  venue: Venue;
  onClick?: () => void;
}

export function VenueCard({ venue, onClick }: VenueCardProps) {
  return (
    <div 
      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <ProgressiveImage
        src={venue.imageUrl}
        alt={venue.name}
        width={400}
        height={300}
        className="w-full h-[200px] object-cover"
        placeholder="blur"
        blurDataURL={venue.blurDataURL}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{venue.name}</h3>
        <p className="text-gray-600 mt-1">{venue.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">{venue.location}</span>
          <span className="text-sm font-medium text-green-600">
            {venue.currentOccupancy} / {venue.maxCapacity}
          </span>
        </div>
      </div>
    </div>
  );
} 