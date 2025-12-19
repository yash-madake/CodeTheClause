import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return user ? <Outlet /> : <div>Loading...</div>; // Or a spinner
};

export default ProtectedRoute;
