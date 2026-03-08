import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import netlifyIdentity, { User } from 'netlify-identity-widget';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(netlifyIdentity.currentUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    netlifyIdentity.init({});

    netlifyIdentity.on('init', (u) => {
      setUser(u);
      setIsLoading(false);
    });

    netlifyIdentity.on('login', (u) => {
      setUser(u);
      netlifyIdentity.close();
    });

    netlifyIdentity.on('logout', () => {
      setUser(null);
    });

    // If init already fired synchronously
    setTimeout(() => setIsLoading(false), 1000);

    return () => {
      netlifyIdentity.off('init');
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const login = () => netlifyIdentity.open('login');
  const logout = () => netlifyIdentity.logout();

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
