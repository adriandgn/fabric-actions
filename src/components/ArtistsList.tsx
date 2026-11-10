
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
            <h3 className="text-lg font-bold font-grotesk mb-4">
            SOFT LANDING - RARE FASHION WEEK EVENT            </h3>

            <p className="text-sm font-mono leading-relaxed mb-6">
            Wind down after hours with style, rhythm, and one-of-a-kind creations.<br /><br />
For Fashion Week, RARE invites you to a styling event like no other—an immersive journey through texture, rhythm, and transformation.
</p>
<br /><p className="text-sm font-mono leading-relaxed">
✨ Flying Fashion ✨ An evening of spinning silhouettes, dreamy soundscapes, and upcycled design.
Experience unique creations in motion as we explore the intersection of sound, movement, and fashion.
Why should fashion remain confined by gravity? Step into a space where garments float, sound sways, and time seems to slow.
</p>
<br /><p className="text-sm font-mono leading-relaxed">
🌀 Featuring pieces by:<br />
Everyday Pieces, Fade Out Label, Tata Christiane, and Therapy Recycle & Exorcise—designers who reshape the familiar into the fantastical.
</p>
<br /><p className="text-sm font-mono leading-relaxed">
🎶 Music by <a href="https://www.instagram.com/maquepereyra/" target="_blank" rel="noopener noreferrer">@maquepereyra</a> – CHOKA co-founder and multidisciplinary artist from Bolivia. Her DJ sets are a ride for pleasure and perreo, for dancing pegadito and transforming rage into sweat, joy, and sexiness. Expect hypnotic blends of cumbia, reggaeton, dembow, and Bolivian roots.
</p>
<br /><p className="text-sm font-mono leading-relaxed">
🛍️ Don’t miss:<br />
– New collections & designer meet-up<br />
– Our Sale Corner featuring samples, archive pieces & special prices<br />
– Drinks<br />
– Good Vibes<br />
</p>
<br /><p className="text-sm font-mono leading-relaxed">
Join us for a Fashion Week evening that glides between energy and ease. Don’t miss this unique Fashion Week evening at RARE.
Open to all, just show up! We wait for you.
</p>
<br /><p className="text-sm font-mono leading-relaxed">
              Experience the creative power of immigrant voices in fashion — from bold aesthetics to business insight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistsList;
