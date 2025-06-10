import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Piece {
  id: number;
  title: string;
  date: string;
  image: string;
}

const Studiopieces = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Only the first 3 pieces
  const pieces: Piece[] = [
    {
      id: 1,
      title: 'Piece #1 - Studio Work',
      date: 'JUNE 5',
      image: '/img/studio_piece1.jpg'
    },
    {
      id: 2,
      title: 'Piece #2 - Studio Work',
      date: 'JUNE 6',
      image: '/img/studio_piece2.jpg'
    },
    {
      id: 3,
      title: 'Piece #3 - Studio Work',
      date: 'JUNE 7',
      image: '/img/studio_piece3.jpg'
    }
  ];

  const totalItems = pieces.length;

  // Handle window resize and set items per view
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
  
  // Calculate visible items and navigation
  const visibleItems = isMobile ? 1 : itemsPerView;
  const maxIndex = Math.max(0, totalItems - visibleItems);
  
  // Handle navigation based on device type
  const next = () => {
    setCurrentIndex(prevIndex => Math.min(prevIndex + (isMobile ? 1 : itemsPerView), maxIndex));
  };

  const prev = () => {
    setCurrentIndex(prevIndex => Math.max(prevIndex - (isMobile ? 1 : itemsPerView), 0));
  };

  return (
    <section className="px-6 md:px-12 py-16 md:py-24">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-grotesk">
          STUDIO PIECES
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-sm font-mono leading-relaxed mb-6">
              Concept: Studio pieces created in an experimental context, exploring materials and forms.
            </p>
          </div>
        </div>
      
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
            {pieces.map((piece) => (
              <div 
                key={piece.id}
                className={`px-2 transition-all duration-300`}
                style={{ width: `${100 / visibleItems}%` }}
              >
                <div className="brutalist-border p-2 sm:p-4 h-full flex flex-col">
                  <div className="aspect-square overflow-hidden mb-2 sm:mb-4 max-h-[60vh] sm:max-h-none">
                    <img 
                      src={piece.image} 
                      alt={piece.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      style={{ maxHeight: 'calc(100vh - 300px)' }}
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{piece.title}</h3>
                  <p className="text-sm text-gray-400">{piece.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      

    </section>
  );
};

export default Studiopieces;
