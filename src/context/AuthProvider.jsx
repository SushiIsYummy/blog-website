import { createContext, useEffect, useState } from 'react';
import AuthAPI from '../api/AuthAPI';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      const response = await AuthAPI.checkStatus();
      const role = response?.data?.user?.role;
      setIsLoggedIn(role === 'guest' ? false : true);
      setUser(response.data.user);
    } catch (error) {
      throw Error('Error checking authentication status:', error);
    }
  };

  const signIn = async (username, password) => {
    try {
      const response = await AuthAPI.signIn({ username, password });
      setIsLoggedIn(true);
      setUser(response?.data?.user);
    } catch (error) {
      throw Error('Error signing in:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
