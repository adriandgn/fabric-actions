import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const ProtectedRoute = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const authorizeAdmin = async (candidate: Session | null) => {
      if (!candidate) {
        if (isMounted) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("cms_admins")
        .select("user_id")
        .eq("user_id", candidate.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking admin access:", error);
      }
      if (isMounted) {
        setSession(!error && data ? candidate : null);
        setLoading(false);
      }
    };

    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
        return;
      }
      await authorizeAdmin(data.session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      window.setTimeout(() => {
        void authorizeAdmin(session);
      }, 0);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return session ? <AdminLayout /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
