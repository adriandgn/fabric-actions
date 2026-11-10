import { useState, useRef, useEffect } from 'react';
import ImageLightbox from './ImageLightbox';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Artwork } from "../pages/admin/ArtworksPage"; // Reusing the type

const fetchArtworks = async (): Promise<Artwork[]> => {
  const { data, error } = await supabase.from('artworks').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const Studiopieces = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data: pieces, isLoading, error } = useQuery<Artwork[]>({
    queryKey: ['publicArtworks'],
    queryFn: fetchArtworks
  });

  const totalItems = pieces ? pieces.length : 0;

  const lightboxImages = pieces ? pieces.map(piece => ({
    src: piece.image_url || '',
    alt: piece.title || '',
    title: piece.title || ''
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

  return (
    <>
    <section className="px-6 md:px-12 py-16 md:py-24">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-grotesk">
          STUDIO PIECES
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-sm font-mono leading-relaxed mb-6">
              Studio pieces created in an experimental context, exploring materials and forms using textiles found on the street as both pigment and message.
            </p>
          </div>
        </div>

      {isLoading && <p>Loading studio pieces...</p>}
      {error && <p className="text-red-500">Error loading studio pieces: {error.message}</p>}
      {pieces && pieces.length === 0 && !isLoading && <p>No studio pieces found.</p>}
      {pieces && pieces.length > 0 && (
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
            aria-label="Previous piece"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
            aria-label="Next piece"
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
              {pieces.map((piece, index) => (
                <div
                  key={piece.id}
                  className={`px-2 transition-all duration-300 cursor-pointer`}
                  style={{ width: `${100 / visibleItems}%` }}
                  onClick={() => openLightbox(index)} // Use index for lightbox
                >
                  <div className="brutalist-border p-2 sm:p-4 h-full flex flex-col">
                    <div className="aspect-square overflow-hidden mb-2 sm:mb-4 max-h-[60vh] sm:max-h-none">
                      <img
                        src={piece.image_url || ''}
                        alt={piece.title || ''}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        style={{ maxHeight: 'calc(100vh - 300px)' }}
                      />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{piece.title}</h3>
                    <p className="text-sm text-gray-400">{piece.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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

export default Studiopieces;
