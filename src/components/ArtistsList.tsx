
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
    <section id="about-the-event" className="px-6 md:px-12 pt-16 md:pt-24">
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
      </div>
    </section>
  );
};

export default ArtistsList;
