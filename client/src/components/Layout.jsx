import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import Button from './Button';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container px-6 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="text-xl font-semibold text-gray-800">
              SeniorCare
            </NavLink>
            <div className="flex items-center space-x-4">
              <span className="text-gray-800">Welcome, {user?.name}</span>
              <Button onClick={logout} variant="secondary">
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-6 py-8">
        <Outlet />
      </main>
      <footer className="py-4 bg-white shadow">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} SeniorCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
