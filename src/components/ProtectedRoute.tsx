import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!session || !user) {
        navigate('/auth');
        return;
      }
      
      // Check for admin access if required
      if (requireAdmin) {
        const adminEmails = ['admin@credimed.com', 'grant830318@gmail.com'];
        if (!adminEmails.includes(user.email || '')) {
          navigate('/');
          return;
        }
      }
    }
  }, [user, session, loading, navigate, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  if (requireAdmin) {
    const adminEmails = ['admin@credimed.com', 'grant830318@gmail.com'];
    if (!adminEmails.includes(user.email || '')) {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;