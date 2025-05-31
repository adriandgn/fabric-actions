
const ExhibitionInfo = () => {
  return (
    <section className="px-6 md:px-12 py-16 md:py-24">
      {/* Espaciado incómodo intencional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        
        {/* Columna 1 - vacía intencionalmente para crear incomodidad */}
        <div></div>
        
        {/* Columna 2 */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-grotesk mb-8 leading-tight">
            CONCEPT
          </h2>
          
          <div className="space-y-6 text-sm font-mono leading-relaxed">
            <p>
              A series of urban interventions using found textiles to reclaim public space and expose the fashion industry's cycle of overproduction, waste, and privilege. As an immigrant from Argentina, my connection to materials is shaped by scarcity. In the '80s and '90s, we learned to mend and repurpose out of necessity — a legacy that contrasts sharply with disposable culture in the Global North.
            </p>
            <p>
              These installations — part ritual, part protest — challenge ideas of waste, value, and inequality embedded in the fashion system. They take shape as abstract "spills" made from street-found fabrics, placed directly in public or on discarded wood.
            </p>
            <p>
              This project continues the work of our upcycling brand, Therapy Recycle & Exorcise, extending our critique into the visual arts. Shared on Instagram — a digital space shaped by the same forces — fabric[actions] makes waste visible in both physical and virtual worlds, inviting reflection on consumption, climate, and meaning.
            </p>
          </div>
        </div>
        
        {/* Columna 3 */}
        <div className="mt-16 md:mt-0">
          <div className="brutalist-border p-6">
            <h3 className="text-lg font-bold font-grotesk mb-4">
              MAIN THEMES
            </h3>
            <ul className="text-xs font-mono space-y-2">
              <li>→ MATERIAL MEMORY</li>
              <li>→ URBAN TEXTILE INTERVENTIONS</li>
              <li>→ FASHION WASTE CRITIQUE</li>
              <li>→ IMMIGRANT LABOR VISIBILITY</li>
              <li>→ UPDATED RITUALS</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Espaciado incómodo adicional */}
      <div className="h-24 md:h-32"></div>
      
      {/* Quote destacado con posicionamiento incómodo */}
      <div className="ml-8 md:ml-24 max-w-2xl">
        <blockquote className="text-xl md:text-2xl font-grotesk italic leading-tight">
          "Textile is not neutral. Each fiber carries the history 
          of the hands that worked it."
        </blockquote>
        <cite className="text-xs font-mono mt-4 block">
          — ARTIST: MARIÁNGELES AGUIRRE
        </cite>
      </div>
    </section>
  );
};

export default ExhibitionInfo;
