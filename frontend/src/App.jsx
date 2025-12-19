import React, { useState, useEffect } from 'react';
import { DB } from './utils/db';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    DB.init();
    const session = sessionStorage.getItem('activeUser');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem('activeUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('activeUser');
  };

  return currentUser 
    ? <Dashboard user={currentUser} onLogout={handleLogout} /> 
    : <Auth onLogin={handleLogin} />;
};

export default App;