import { useState, useRef, useEffect } from 'react';
import ImageLightbox from './ImageLightbox';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Define the type for an urban intervention (same as in UrbanInterventionsPage.tsx)
export type UrbanIntervention = {
  id: string;
  created_at: string;
  title: string;
  date: string;
  image_url: string | null;
  description: string | null;
  position: number;
};

const fetchUrbanInterventions = () => api.list<UrbanIntervention>('urban_interventions');

const UrbanInterventions = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data: interventions, isLoading, error } = useQuery<UrbanIntervention[]>({
    queryKey: ['urban_interventions_public'], // Different key for public view
    queryFn: fetchUrbanInterventions
  });

  const totalItems = interventions ? interventions.length : 0;

  // Prepare images for Lightbox
  const lightboxImages = interventions ? interventions.map(intervention => ({
    src: intervention.image_url || '', // Use image_url
    alt: intervention.title,
    title: intervention.title
  })) : [];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
        setIsMobile(true);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
        setIsMobile(false);
      } else {
        setItemsPerView(3);
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleItems = isMobile ? 1 : itemsPerView;
  const maxIndex = Math.max(0, totalItems - visibleItems);

  const next = () => {
    setCurrentIndex(prevIndex => Math.min(prevIndex + (isMobile ? 1 : itemsPerView), maxIndex));
  };

  const prev = () => {
    setCurrentIndex(prevIndex => Math.max(prevIndex - (isMobile ? 1 : itemsPerView), 0));
  };

  if (isLoading) return <section className="px-6 md:px-12 py-16 md:py-24"><p>Loading urban interventions...</p></section>;
  if (error) return <section className="px-6 md:px-12 py-16 md:py-24"><p className="text-red-500">Error loading urban interventions: {error.message}</p></section>;
  if (!interventions || interventions.length === 0) return <section className="px-6 md:px-12 py-16 md:py-24"><p>No urban interventions found yet.</p></section>;

  return (
    <>
    <section className="px-6 md:px-12 py-16 md:py-24">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-grotesk">
          URBAN INTERVENTIONS
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-sm font-mono leading-relaxed mb-6">
Installation arranged directly on the street or on canvases from abandoned wood that resemble abstract brush strokes, vomits or spills.   </p>
          </div>
        </div>

      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
          aria-label="Previous intervention"
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
          aria-label="Next intervention"
          disabled={currentIndex >= maxIndex}
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="overflow-hidden"
        >
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / totalItems}%)`,
              width: `${(totalItems * 100) / visibleItems}%`
            }}
          >
            {interventions.map((intervention) => (
              <div
                key={intervention.id}
                className={`px-2 transition-all duration-300 cursor-pointer`}
                style={{ width: `${100 / visibleItems}%` }}
                onClick={() => openLightbox(interventions.findIndex(i => i.id === intervention.id))} // Added onClick to open lightbox
              >
                <div className="brutalist-border p-2 sm:p-4 h-full flex flex-col">
                  <div className="aspect-square overflow-hidden mb-2 sm:mb-4 max-h-[60vh] sm:max-h-none">
                    <img
                      src={intervention.image_url || ''} // Use image_url
                      alt={intervention.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      style={{ maxHeight: 'calc(100vh - 300px)' }}
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{intervention.title}</h3>
                  <p className="text-sm text-gray-400">{intervention.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </section>

      {/* Render ImageLightbox conditionally */}
      {lightboxOpen && (
        <ImageLightbox
          images={lightboxImages}
          startIndex={selectedImageIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};

export default UrbanInterventions;
