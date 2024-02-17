import { createContext, useEffect, useState } from 'react';
import AuthAPI from '../api/AuthAPI';
import axios from '../api/config/axiosConfig';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  console.log(user);
  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      let response = await axios.get('/auth/status');
      response = response.data;
      const role = response?.data?.user?.role;
      setIsLoggedIn(role === 'guest' ? false : true);
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
      throw new Error(JSON.stringify(error.response.data));
    }
  };

  const signIn = async (username, password) => {
    try {
      let response = await axios.post('/auth/login', { username, password });
      response = response.data;
      console.log(response);
      setIsLoggedIn(true);
      setUser(response?.data?.user);
    } catch (error) {
      console.log(error);
      throw new Error(JSON.stringify(error.response.data));
    }
  };

  const signOut = async () => {
    try {
      let response = await axios.post('/auth/logout');
      response = response.data;
      console.log(response);
      setIsLoggedIn(false);
      setUser({ role: 'guest' });
    } catch (error) {
      console.log(error);
      throw new Error(JSON.stringify(error.response.data));
    }
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
