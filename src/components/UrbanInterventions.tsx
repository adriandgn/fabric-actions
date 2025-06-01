import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Intervention {
  id: number;
  title: string;
  date: string;
  image: string;
}

const UrbanInterventions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Only the first 3 interventions
  const interventions: Intervention[] = [
    {
      id: 1,
      title: 'Test #1 - Your trash, my treasure',
      date: 'MAY 29',
      image: '/img/501291506_17844186738497041_8104670190827784702_n.jpg'
    },
    {
      id: 2,
      title: 'Test #2 - Your trash, my treasure',
      date: 'MAY 30',
      image: '/img/501445643_17844178728497041_2990602597438234993_n.jpg'
    },
    {
      id: 3,
      title: 'Test #3 - Fabric Remnants',
      date: 'JUNE 1',
      image: '/img/501947555_17844181419497041_7567780357535951913_n.jpg'
    }
  ];

  const totalItems = interventions.length;

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
    <section className="px-6 md:px-12 py-16 md:py-24 bg-black">
      <h2 className="text-2xl md:text-3xl font-bold font-grotesk mb-12 text-center">
        URBAN INTERVENTIONS
      </h2>
      
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
                className={`px-2 transition-all duration-300`}
                style={{ width: `${100 / visibleItems}%` }}
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
  );
};

export default UrbanInterventions;
