
const ArtistsList = () => {
  const designers = [
    "Alena Steinke",
    "alteralter",
    "ezggi",
    "Five E Jewelry",
    "Gautamma",
    "Machtvoll",
    "Maqu",
    "Nastassia Volkus",
    "ritka rojka",
    "Späti Berlin",
    "Studio SCHMITD",
    "Therapy"
  ];

  const panelists = [
    {
      name: "Izabella Chrobok",
      role: "KEYI magazine"
    },
    {
      name: "Jenny Mauro",
      role: "I.S.I. e. V."
    },
    {
      name: "Rula Ali",
      role: ""
    },
    {
      name: "Marisa Fuentes Prado",
      role: "Maqu"
    },
    {
      name: "Samata Pattinson",
      role: "Black Pearl"
    }
  ];

  return (
    <section className="px-6 md:px-12 py-16 md:py-24">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-grotesk">
          ABOUT THE EVENT
        </h2>
      </div>
      
      <div className="space-y-12">
        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-sm font-mono leading-relaxed mb-6">
              Cultural Threads is a week-long exhibition and public program spotlighting immigrant designers who shape Berlin's diverse and innovative fashion scene. Through garments, accessories, workshops, and dialogue, the program explores how cultural identity is woven into design.
            </p>
            <p className="text-sm font-mono leading-relaxed">
              Experience the creative power of immigrant voices in fashion — from bold aesthetics to business insight.
            </p>
          </div>
        </div>

        {/* Program Overview */}
        <div className="pt-8">
          <h3 className="text-xl font-bold font-grotesk mb-6">PROGRAM OVERVIEW</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Opening Reception */}
            <div className="brutalist-border p-6">
              <h4 className="font-bold font-mono text-sm mb-2">Opening Reception</h4>
              <p className="font-mono text-sm mb-2">June 3 | 17:00–20:00</p>
              <p className="font-mono text-sm">Meet the designers and get a first look at the exhibition. Open to all.</p>
            </div>

            {/* Main Exhibition */}
            <div className="brutalist-border p-6">
              <h4 className="font-bold font-mono text-sm mb-2">Main Exhibition</h4>
              <p className="font-mono text-sm mb-2">June 3–7 | 13:00–19:00</p>
              <p className="font-mono text-sm mb-2">Featuring 12 Berlin-based fashion and accessories designers:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {designers.map((designer, index) => (
                  <div key={index} className="font-mono text-sm">• {designer}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Workshops */}
          <div className="mt-8">
            <h4 className="font-bold font-mono text-sm mb-4">Workshops</h4>
            <p className="font-mono text-xs italic mb-4">Free participation, limited spaces — registration required via Eventbrite</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="brutalist-border p-6">
                <h5 className="font-bold font-mono text-sm">Starting a Fashion Business in Germany</h5>
                <p className="font-mono text-sm mt-1">Facilitator: Justyna Gmitrzuk</p>
                <p className="font-mono text-sm">June 4 | 16:00–19:00</p>
              </div>
              
              <div className="brutalist-border p-6">
                <h5 className="font-bold font-mono text-sm">Made in Berlin: A Fashion Business LAB</h5>
                <p className="font-mono text-sm mt-1">Facilitator: Sepideh Ahadi</p>
                <p className="font-mono text-sm">June 5 | 16:00–19:00</p>
              </div>
            </div>
          </div>

          {/* Panel Discussion */}
          <div className="mt-8 brutalist-border p-6">
            <h4 className="font-bold font-mono text-xl mb-4">Panel Discussion</h4>
            <p className="font-mono text-sm mb-6">June 6 | 17:00–19:00</p>
            
            <p className="font-mono text-sm mb-4">With:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {panelists.map((panelist, index) => (
                <div key={index} className="font-mono text-sm">
                  <div className="font-bold">{panelist.name}</div>
                  {panelist.role && <div className="text-xs">{panelist.role}</div>}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white">
              <p className="font-mono text-xs">Language: English</p>
              <p className="font-mono text-xs">Accessibility: Venue is wheelchair accessible</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistsList;
