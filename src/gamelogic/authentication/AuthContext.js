import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setUserToken(token);
    };
    loadToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{userToken, setUserToken, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
