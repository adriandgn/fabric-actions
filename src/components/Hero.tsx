
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Define type for exhibition info
interface ExhibitionInfo {
  last_exhibition: string;
  header_label: string;
  next_exhibition: string;
  next_exhibition_date: string;
  next_exhibition_address: string;
}

const Hero = () => {
  const { data, isLoading, error } = useQuery<ExhibitionInfo[]> ({
    queryKey: ['exhibition_info'],
    queryFn: () => api.list<ExhibitionInfo>('exhibition_info'),
  });

  if (isLoading) {
    return <section className="min-h-screen flex items-center justify-center">Loading exhibition info...</section>;
  }

  if (error) {
    return <section className="min-h-screen flex items-center justify-center">Error loading exhibition info: {error.message}</section>;
  }

  const exhibition = data && data.length > 0 ? data[0] : null;

  return (
    <section className="min-h-screen flex flex-col justify-between p-6 md:p-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="text-xs font-mono tracking-wider">
          {exhibition?.last_exhibition ?? 'LATEST EXHIBITION - CULTURAL THREADS'}
        </div>
        <div className="text-xs font-mono tracking-wider">
          {exhibition?.header_label ?? 'BERLIN 2025'}
        </div>
      </div>

      {/* Main Title */}
      <div className="flex-1 flex items-center">
        <div className="w-full overflow-hidden">
          <div className="w-full ml-1 sm:ml-0">
            <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tight text-left font-anthony">
              <span className="relative inline-block text-glitch" data-text="FABRIC">
                FABRIC
              </span>
              <span className="block sm:inline-block sm:ml-0 -ml-2 relative text-glitch" data-text="[ACTIONS]">
                [ACTIONS]
              </span>
            </h1>
          </div>

          {/* Intentional awkward spacing */}
          <div className="h-16 md:h-24"></div>

          <div className="ml-16 md:ml-32">
            <p className="text-lg md:text-xl font-mono max-w-xs">
              EPHEMERAL FABRICATIONS
              AGAINST PERMANENT WASTE
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Information */}
      <div className="flex justify-between items-end">
        <div className="text-xs font-mono">
          <div>{exhibition?.next_exhibition ?? 'NEXT EXHIBITION'}</div>
          <div>{exhibition?.next_exhibition_date ?? 'JULY 3 | 13:00 - 19:00'}</div>
          <div className="mt-1">{exhibition?.next_exhibition_address ?? 'RARE Collective Shop - Berlin'}</div>
          {!exhibition && <div>Kopernikusstraße 21, 10245 Berlin</div>}
        </div>

        <div className="text-right text-xs font-mono">
          <a href="#footer" className="hover:underline">If you are interested in our work, please sign up to our newsletter.</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
