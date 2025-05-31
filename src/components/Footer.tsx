
const Footer = () => {
  return (
    <footer className="px-6 md:px-12 py-16 md:py-24 border-t-2 border-white">
      {/* Espaciado incómodo inicial */}
      <div className="h-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        
        {/* Columna 1 - Logo/Titulo repetido */}
        <div>
          <h3 className="text-xl font-bold font-anthony mb-4">
          FABRIC[ACTION{"S"}]
          </h3>
          <div className="text-xs font-mono mb-4">
            NON-WEARABLE ART BY THERAPY RECYCLE & EXORCISE
          </div>
          <div className="mt-2">
            <a 
              href="https://therapy-berlin.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src="/img/therapy-logo.png" 
                alt="Therapy Recycle & Exorcise" 
                className="w-[120px] h-auto"
                width="120"
                height="auto"
              />
            </a>
          </div>
        </div>
        
        {/* Columna 2 - Espacio para futuros enlaces */}
        <div className="mt-8 md:mt-0">
          {/* Espacio reservado para futuros enlaces */}
        </div>
        
        {/* Columna 3 - Redes sociales y créditos */}
        <div className="mt-12 md:mt-0">
          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="font-bold mb-2">FOLLOW US ON INSTAGRAM</div>
              <div className="space-y-1">
                <div>
                  <a 
                    href="https://instagram.com/cultural_threads_berlin" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    @cultural_threads_berlin
                  </a>
                </div>
                <div>
                  <a 
                    href="https://instagram.com/fabric_actions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    @fabric_actions
                  </a>
                </div>
                <div>
                  <a 
                    href="https://instagram.com/therapy_berlin" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    @therapy_berlin
                  </a>
                </div>
                <div>
                  <a 
                    href="https://instagram.com/therapy_argentina" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    @therapy_argentina
                  </a>
                </div>
              </div>
            </div>
            
            <div className="h-4"></div>
            
            <div>
              <div className="font-bold mb-2">CREDITS</div>
              <div className="space-y-1">
                <div>ORGANIZER: Sepideh Ahadi</div>
                <div>DESIGNER: Adrian Aguirre</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Espaciado final incómodo */}
      <div className="h-16"></div>
      
      {/* Copyright con posicionamiento extraño */}
      <div className="flex justify-between items-end">
        <div className="text-xs font-mono">
          © 2025 fabric[actions]
        </div>
        
        <div className="brutalist-border px-4 py-2 text-xs font-mono">
          ART IS RESISTANCE
        </div>
      </div>
    </footer>
  );
};

export default Footer;
