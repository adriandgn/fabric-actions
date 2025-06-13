import { useState, useRef, useEffect } from 'react';
import ImageLightbox from './ImageLightbox'; // Added import for ImageLightbox
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Intervention {
  id: number;
  title: string;
  date: string;
  image: string;
}

const UrbanInterventions = () => {
  // State for ImageLightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Only the first 3 interventions
  const interventions: Intervention[] = [
    {
      id: 1,
      title: 'Your trash, my treasure',
      date: 'MAY 29',
      image: '/img/501291506_17844186738497041_8104670190827784702_n.jpg'
    },
    {
      id: 2,
      title: 'Your trash, my treasure',
      date: 'MAY 30',
      image: '/img/501445643_17844178728497041_2990602597438234993_n.jpg'
    },
    {
      id: 3,
      title: 'Fabric Remnants',
      date: 'JUNE 1',
      image: '/img/501947555_17844181419497041_7567780357535951913_n.jpg'
    },
    {
      id: 4,
      title: 'Crawling clothes in white, red and blue.',
      date: 'JUNE 2',
      image: '/img/503053513_17844825306497041_6652826205093340109_n.jpg'
    },
  ];

  const totalItems = interventions.length;

  // Prepare images for Lightbox
  const lightboxImages = interventions.map(intervention => ({
    src: intervention.image,
    alt: intervention.title, // Using title as alt, consider adding a dedicated alt field for better accessibility
    title: intervention.title
  }));

  // Functions to handle Lightbox visibility
  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

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
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
          aria-label="Next intervention"
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
                      src={intervention.image} 
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
