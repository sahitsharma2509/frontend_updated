import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api, refreshAccessToken } from '../../../apiHelper';

const useVerifyAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
  
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
              router.push('/login'); // navigate to the login page when user is not authenticated
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
    }, [router]);
  
    return { isAuthenticated, isLoading };
  };
  
  export default useVerifyAuth;
