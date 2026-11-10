
import Hero from "../components/Hero";
import ExhibitionInfo from "../components/ExhibitionInfo";
import UrbanInterventions from "../components/UrbanInterventions";
import Studiopieces from "../components/Studiopieces";
import EventPostsSection from "../components/EventPostsSection"; // New import
import ArtistsList from "../components/ArtistsList"; // New import
import LocationInfo from "../components/LocationInfo"; // New import
import Footer from "../components/Footer"; // Import Footer component

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <ExhibitionInfo />
      <EventPostsSection /> {/* New component */}
      <Studiopieces />
      <UrbanInterventions />
      <ArtistsList />
      <LocationInfo />
      <Footer />
    </div>
  );
};

export default Index;
