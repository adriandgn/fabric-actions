
const LocationInfo = () => {
  return (
    <section className="px-6 md:px-12 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-grotesk mb-8">
            LOCATION
          </h2>
          
          <div className="space-y-4 text-sm font-mono">
            <div>
              <div className="font-bold mb-1">PLATTE·BERLIN</div>
              <div>JUNE 3 - JUNE 7</div>
              <div>Memhardstraße 8, 10178 Berlin</div>
            </div>
            
            <div className="h-4"></div>
            
            <div>
              <div className="font-bold mb-1">TRANSPORT</div>
              <div>U2, U5, S5, S7, S75 (Alexanderplatz)</div>
              <div>M4, M5, M6 (Alexanderplatz)</div>
              <div>Tram M2, M4, M5, M6 (Memhardstraße)</div>
            </div>
            
          </div>
        </div>
        
        {/* Bloque de detalles del evento */}
        <div className="mt-16 md:mt-0">
          <div className="ml-8 md:ml-16">
            <div className="brutalist-border brutalist-shadow p-6">
              <h3 className="text-lg font-bold font-grotesk mb-4">
                EVENT DETAILS
              </h3>
              
              <div className="space-y-3 text-sm font-mono">
                <a 
                  href="https://www.eventbrite.com/e/cultural-threads-2025-tickets-1377741254179" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:bg-white hover:text-black transition-colors duration-200 inline-block px-2 py-1"
                >
                  → Eventbrite Tickets
                </a>
                <a 
                  href="mailto:contact@sepidehahadi.com"
                  className="hover:bg-white hover:text-black transition-colors duration-200 inline-block px-2 py-1"
                >
                  → contact@sepidehahadi.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationInfo;
