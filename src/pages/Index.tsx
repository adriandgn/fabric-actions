
import Hero from "../components/Hero";
import ExhibitionInfo from "../components/ExhibitionInfo";
import UrbanInterventions from "../components/UrbanInterventions";
import Studiopieces from "../components/Studiopieces";
import ArtistsList from "../components/ArtistsList";
import LocationInfo from "../components/LocationInfo";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <ExhibitionInfo />
      <UrbanInterventions />
      <Studiopieces />
      <ArtistsList />
      <LocationInfo />
      <Footer />
    </div>
  );
};

export default Index;
