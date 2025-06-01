
const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-between p-6 md:p-12">
      {/* Header incómodo */}
      <div className="flex justify-between items-start">
        <div className="text-xs font-mono tracking-wider">
          UPCOMING EXHIBITION - CULTURAL THREADS 
        </div>
        <div className="text-xs font-mono tracking-wider">
           BERLIN 2025
        </div>
      </div>

      {/* Título principal con espaciado incómodo */}
      <div className="flex-1 flex items-center">
        <div className="w-full overflow-hidden">
          <h1 
            className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tight text-left text-glitch font-anthony break-words"
            data-text="FABRIC[ACTIONS]"
            style={{ wordBreak: 'break-word' }}
          >
            FABRIC[ACTIONS]
          </h1>
          
          {/* Espaciado incómodo intencional */}
          <div className="h-16 md:h-24"></div>
          
          <div className="ml-16 md:ml-32">
            <p className="text-lg md:text-xl font-mono max-w-xs">
              EPHEMERAL FABRICATIONS
              AGAINST PERMANENT WASTE
            </p>
          </div>
        </div>
      </div>

      {/* Información abajo con disposición asimétrica */}
      <div className="flex justify-between items-end">
        <div className="text-xs font-mono">
          <div>JUNE 3-7 | 13:00 - 19:00 </div>
          <div className="mt-1">PLATTE·Berlin</div>
          <div>Memhardstraße 8</div>
        </div>
        
        <div className="text-right text-xs font-mono">
          <a 
            href="https://www.eventbrite.com/e/cultural-threads-2025-tickets-1377741254179" 
            target="_blank" 
            rel="noopener noreferrer"
            className="brutalist-border inline-block px-3 py-2 hover:bg-white hover:text-black transition-colors duration-200"
          >
            FREE ENTRY - All are welcome
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
