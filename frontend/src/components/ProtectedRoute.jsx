// src/components/ProtectedRoute.jsx
// Redirects unauthenticated users to /login
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking localStorage, show nothing (or a spinner)
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  // Not logged in → redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → render the protected page
  return children;
};

export default ProtectedRoute;
