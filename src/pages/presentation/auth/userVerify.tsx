import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, refreshAccessToken } from '../../../apiHelper';

const useVerifyAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      const verifyAuth = async () => {
        const accessToken = await refreshAccessToken();
  
        if (accessToken) {
          try {
            const apiInstance = api();
            const userResponse = await apiInstance.get('/user/');
            console.log('User data:', userResponse.data);
  
            if (userResponse.data.id !== null && userResponse.data.username !== '') {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
  
        setIsLoading(false);
      };
  
      verifyAuth();
    }, [navigate]);
  
    return { isAuthenticated, isLoading };
  };
  
  export default useVerifyAuth;