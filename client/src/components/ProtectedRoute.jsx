// Questo componente controllerà se l’utente è autenticato prima di mostrare una determinata pagina. Se non lo è, lo reindirizza al login.
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) return <div className='text-center p-4'>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}