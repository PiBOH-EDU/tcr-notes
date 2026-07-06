import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('tcr-theme');
    return saved ? saved : 'dark';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tcr-user');
    return saved || null;
  });

  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('tcr-role');
    return saved || 'editor';
  });

  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem('tcr-auth') === 'true';
  });

  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('tcr-theme', theme);
  }, [theme]);

  // Rileva route admin via pathname
  useEffect(() => {
    const checkPath = () => {
      setIsAdminRoute(window.location.pathname === '/admin');
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  // Capacitor: ricarica quando l'app torna in foreground (evita cache WebView)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
      import('@capacitor/app').then(({ App }) => {
        App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) window.location.reload();
        });
      }).catch(() => {});
    }
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const handleLogin = (name, userRole = 'editor') => {
    localStorage.setItem('tcr-user', name);
    localStorage.setItem('tcr-role', userRole);
    localStorage.setItem('tcr-auth', 'true');
    setUser(name);
    setRole(userRole);
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('tcr-user');
    localStorage.removeItem('tcr-role');
    localStorage.removeItem('tcr-auth');
    setUser(null);
    setRole('editor');
    setIsAuth(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {isAdminRoute ? (
        <Admin theme={theme} />
      ) : !isAuth ? (
        <div className="flex-1 flex items-center justify-center">
          <Login onLogin={handleLogin} theme={theme} />
        </div>
      ) : (
        <Dashboard
          user={user}
          role={role}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={handleLogout}
        />
      )}
      {!isAdminRoute && <Footer theme={theme} />}
    </div>
  );
}

export default App;
