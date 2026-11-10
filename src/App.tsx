import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FontDebug from "./pages/FontDebug";
import Impressum from "./pages/impressum";
import Datenschutzerklarung from "./pages/datenschutzerklarung";
import LoginPage from "./pages/admin/LoginPage";
import ProtectedRoute from "./components/custom/ProtectedRoute";
import EventsPage from "./pages/admin/EventsPage";
import ArtworksPage from "./pages/admin/ArtworksPage";
import UrbanInterventionsPage from "./pages/admin/UrbanInterventionsPage";
import ExhibitionInfoPage from "./pages/admin/ExhibitionInfoPage"; // New import
import EventPostsPage from "./pages/admin/EventPostsPage"; // New import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/font-debug" element={<FontDebug />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutzerklarung" element={<Datenschutzerklarung />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route path="events" element={<EventsPage />} />
            <Route path="artworks" element={<ArtworksPage />} />
            <Route path="urban-interventions" element={<UrbanInterventionsPage />} />
            <Route path="exhibition-info" element={<ExhibitionInfoPage />} /> {/* New Route */}
            <Route path="event-posts" element={<EventPostsPage />} /> {/* New Route */}
            {/* Add other admin routes here, e.g., artworks */}
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
