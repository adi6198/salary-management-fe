import { createContext, useState, useEffect } from 'react';
import * as storage from '../utils/storage';
import { login as apiLogin, getMe as apiGetMe } from '../mocks/handlers';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    storage.clearAuth();
    setTokenState(null);
    setUserState(null);
    setIsAuthenticated(false);
  };

  // Initialize Auth State from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = storage.getToken();
      const storedUser = storage.getUser();

      if (storedToken && storedUser) {
        setTokenState(storedToken);
        setUserState(storedUser);
        setIsAuthenticated(true);

        // Verify token against backend
        try {
          const response = await apiGetMe();
          // Backend me returns: { success: true, data: { user } } or just user.
          // In mocks/handlers.js we returned { user: mockUser }
          const fetchedUser = response.user || response.data?.user || response;
          setUserState(fetchedUser);
          storage.setUser(fetchedUser);
        } catch (error) {
          console.error('Failed to verify session token:', error);
          // Token is invalid/expired
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      // Response contains token and user
      const token = response?.data?.token;
      const user = response?.data?.user;

      storage.setToken(token);
      storage.setUser(user);

      setTokenState(token);
      setUserState(user);
      setIsAuthenticated(true);
      setIsLoading(false);

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: message };
    }
  };


  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
