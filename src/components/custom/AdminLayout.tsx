import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <nav>
          <ul className="flex space-x-4">
            <li className="p-2 text-white">
              <Link to="/admin/urban-interventions" className="text-white hover:bg-gray-700">Interventions</Link>
            </li>
            <li className="p-2 text-white">
              <Link to="/admin/exhibition-info" className="text-white hover:bg-gray-700">Hero</Link>
            </li>
            <li className="p-2 text-white">
              <Link to="/admin/event-posts" className="text-white hover:bg-gray-700">Posts</Link>
            </li>
            <li className="p-2 text-white">
              <Link to="/admin/events" className="text-white hover:bg-gray-700">Events</Link>
            </li>
            <li className="p-2 text-white">
              <Link to="/admin/artworks" className="hover:bg-gray-700">Artworks</Link>
            </li>
            <li>
              <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-gray-700">
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
