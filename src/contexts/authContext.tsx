import React, { createContext, FC, ReactNode, useEffect, useMemo, useState, useCallback  } from 'react';
import PropTypes from 'prop-types';
import { api } from '../apiHelper'
const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_BASE_URL
import axios from 'axios';

export interface IAuthContextProps {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
  userData: IUserData | null;
  userProfileData: IUserProfileData | null;
  setUserProfileData: React.Dispatch<React.SetStateAction<IUserProfileData | null>>;
  accessToken: string | null;
  updateToken: (newToken: string | null) => void;
  loadUser: () => Promise<void>;
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
  children: ReactNode;
}

export interface IUserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface IUserProfileData {
  user: IUserData;
  avatar: string | null;
  tokens_used : number | null;
  token_limit : number | null;
  tokens_remaining : number | null;
}




export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [userProfileData, setUserProfileData] = useState<IUserProfileData | null>(null);
  const [accessToken, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  );

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
  };

  const apiClient = api(updateToken);

  const loadUser = useCallback(async () => {
    console.log('Test token:', accessToken);
    
    if (accessToken) {
      try {
        const userResponse = await apiClient.get('/user/profile/');
        console.log('User response:', userResponse);
    
        if (userResponse.data.user.id !== null && userResponse.data.avatar !== '') {
  
          setUserProfileData({ 
            avatar: userResponse.data.avatar,
            tokens_used : userResponse.data.tokens_used,
            token_limit:userResponse.data.token_limit,
            tokens_remaining : userResponse.data.tokens_remaining,
            user: {
              id: userResponse.data.user.id,
              username: userResponse.data.user.username,
              email: userResponse.data.user.email,
              first_name: userResponse.data.user.first_name,
              last_name: userResponse.data.user.last_name,
            }
          });
  
          console.log('User Profile Data:', userProfileData);
        } else {
          console.error("Some other issue");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  }, [accessToken, apiClient]);
  
  
  

  useEffect(() => {
    loadUser();
  }, [accessToken]);

  useEffect(() => {
    console.log('User Profile Data:', userProfileData);
  }, [userProfileData]);
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }, [accessToken]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      userData,
      userProfileData,
      setUserProfileData,
      accessToken,
      updateToken,
      loadUser,
    }),
    [user, userData, userProfileData, accessToken, loadUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;



