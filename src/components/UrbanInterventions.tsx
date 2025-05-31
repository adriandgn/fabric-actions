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
  const carouselRef = useRef<HTMLDivElement>(null);

  // Sample data - replace with your actual data
  const interventions: Intervention[] = [
    {
      id: 1,
      title: 'Test #1 - Your trash, my treasure',
      date: 'JUNE 3',
      image: '/img/501291506_17844186738497041_8104670190827784702_n.jpg'
    },
    {
      id: 2,
      title: 'Test #2 - Your trash, my treasure',
      date: 'JUNE 4',
      image: '/img/501445643_17844178728497041_2990602597438234993_n.jpg'
    },
    {
      id: 3,
      title: 'Test #3 - Fabric Remnants',
      date: 'JUNE 5',
      image: '/img/501947555_17844181419497041_7567780357535951913_n.jpg'
    },
    {
      id: 4,
      title: 'Test #4 - Threaded Spaces',
      date: 'JUNE 6',
      image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 5,
      title: 'Test #5 - Material Memory',
      date: 'JUNE 7',
      image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 6,
      title: 'Test #6 - Urban Patchwork',
      date: 'JUNE 8',
      image: 'https://images.unsplash.com/photo-1501386761578-eacb2ebf4b09?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 7,
      title: 'Test #7 - Textile Echoes',
      date: 'JUNE 9',
      image: 'https://images.unsplash.com/photo-1503341338985-c0477be52513?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 8,
      title: 'Test #8 - Fabric Traces',
      date: 'JUNE 10',
      image: 'https://images.unsplash.com/photo-1571902943201-8ec2e2c7a33b?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 9,
      title: 'Test #9 - Urban Stitches',
      date: 'JUNE 11',
      image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 10,
      title: 'Test #10 - Matåerial Dialogues',
      date: 'JUNE 12',
      image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=500&auto=format&fit=crop&q=60'
    },
  ];

  const totalItems = interventions.length;
  const maxIndex = Math.ceil(totalItems / itemsPerView) - 1;

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: `${(totalItems * 100) / itemsPerView}%`
            }}
          >
            {interventions.map((intervention) => (
              <div 
                key={intervention.id}
                className={`px-2 transition-all duration-300`}
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="brutalist-border p-4 h-full flex flex-col">
                  <div className="aspect-square overflow-hidden mb-4">
                    <img 
                      src={intervention.image} 
                      alt={intervention.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
      
      {/* Indicators */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default UrbanInterventions;
