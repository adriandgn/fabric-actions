import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const ProtectedRoute = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    api.session().then((result) => { if (active) setAuthenticated(result.authenticated); })
      .catch(() => { if (active) setAuthenticated(false); });
    return () => { active = false; };
  }, []);
  if (authenticated === null) return <div>Loading...</div>;
  return authenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
