import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('catcher-theme');
    return saved ? saved : 'dark';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('catcher-user');
    return saved || null;
  });

  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem('catcher-auth') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('catcher-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const handleLogin = (name) => {
    localStorage.setItem('catcher-user', name);
    localStorage.setItem('catcher-auth', 'true');
    setUser(name);
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('catcher-user');
    localStorage.removeItem('catcher-auth');
    setUser(null);
    setIsAuth(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {!isAuth ? (
        <div className="flex-1 flex items-center justify-center">
          <Login onLogin={handleLogin} theme={theme} />
        </div>
      ) : (
        <Dashboard
          user={user}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={handleLogout}
        />
      )}
      <Footer theme={theme} />
    </div>
  );
}

export default App;
