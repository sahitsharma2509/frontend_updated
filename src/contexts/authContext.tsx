import React, { createContext, FC, ReactNode, useEffect, useMemo, useState, useCallback  } from 'react';
import PropTypes from 'prop-types';
import { api } from '../apiHelper'
const BASE_URL = process.env.REACT_APP_DJANGO_BASE_URL

export interface IAuthContextProps {
  user: string | null;
  setUser?(...args: unknown[]): unknown;
  userData: IUserData | null;
  accessToken: string | null;
  updateToken: (newToken: string | null) => void;
  loadUser: () => Promise<void>; // Add this line
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
  children: ReactNode;
}

interface IUserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [accessToken, setToken] = useState<string | null>(localStorage.getItem('access_token'));

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
  };

  const apiClient = api(updateToken);

  const loadUser = useCallback(async () => {
    if (accessToken) {
      try {
        const userResponse = await apiClient.get('/user/');
  
        if (userResponse.data.id !== null && userResponse.data.username !== '') {
          setUser(userResponse.data.username);
          setUserData(userResponse.data);
        } else {
          console.error("Some other issue");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      setUser(null);
      setUserData(null);
    }
  }, [accessToken, apiClient]);
  
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  loadUser();
}, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
    } else {
      localStorage.removeItem('access_token');
    }
  }, [accessToken]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      userData,
      accessToken,
      updateToken,
      loadUser, // Add this line
    }),
    [user, userData, accessToken,loadUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
