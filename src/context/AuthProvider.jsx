import { createContext, useEffect, useState } from 'react';
import AuthAPI from '../api/AuthAPI';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    async function setAuthState() {
      await checkAuthenticationStatus();
    }
    setAuthState();
  }, []);

  const checkAuthenticationStatus = async () => {
    let response = await AuthAPI.checkStatus();
    const role = response?.data?.user?.role;
    setIsLoggedIn(role === 'guest' ? false : true);
    setUser(response.data.user);
  };

  const signIn = async (username, password) => {
    let response = await AuthAPI.signIn({ username, password });
    setIsLoggedIn(true);
    setUser(response?.data?.user);
  };

  const signOut = async () => {
    let response = await AuthAPI.signOut();
    setIsLoggedIn(false);
    setUser({ role: 'guest' });
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, signIn, signOut, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
