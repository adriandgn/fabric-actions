
const LocationInfo = () => {
  return (
    <section className="px-6 md:px-12 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

        <div>
          <h3 className="text-lg font-bold font-grotesk mb-4">
            LOCATION
          </h3>

          <div className="space-y-4 text-sm font-mono">
            <div>
              <div className="font-bold mb-1">RARE COLLECTIVE</div>
              <div>BERLIN FASHION WEEK</div>
              <div>Kopernikusstraße 21, 10178 Berlin</div>
            </div>

            <div className="h-4"></div>

            <div>
              <div className="font-bold mb-1">TRANSPORT</div>
              <div>Tram M10, M13 (Kopernikusstr./Libauer Str.)</div>
              <div>U1, U3, S5, S7, S75, S9 (Warschauer Str.)</div>
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
                  href="https://www.instagram.com/rare_berlin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-white hover:text-black transition-colors duration-200 inline-block px-2 py-1"
                >
                  → @rare_berlin
                </a>
                <a
                  href="https://www.instagram.com/therapy_berlin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-white hover:text-black transition-colors duration-200 inline-block px-2 py-1"
                >
                  → @therapy_berlin
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
