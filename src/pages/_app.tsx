import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { ThemeProvider, JssProvider, SheetsRegistry } from 'react-jss';
import { ReactNotifications } from 'react-notifications-component';
import { useFullscreen } from 'react-use';
import { ToastProvider } from 'react-toast-notifications';
import { ThemeContextProvider } from '../contexts/themeContext';
import ThemeContext from '../contexts/themeContext';
import useClientSideLayoutEffect from '../hooks/useClientSideLayoutEffect';
import { AuthContextProvider } from '../contexts/authContext';
import '../styles/styles.scss';
import Wrapper from '../layout/Wrapper/Wrapper';

import { Toast, ToastContainer } from '../components/bootstrap/Toasts';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import '../i18n';
import { AppProps } from 'next/app';
import { create } from 'jss';
import preset from 'jss-preset-default';

import { getOS } from '../helpers/helpers';
import useVerifyAuth from './presentation/auth/userVerify';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import DefaultAside from './_layout/_asides/DefaultAside';
import DarkModeWrapper from '../hooks/DarkModeWrapper';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from 'react-query';
import {useRouter} from 'next/router';



function MyApp({ Component, pageProps }: AppProps) {

  const jss = create(preset());
  const sheets = new SheetsRegistry();
  const router = useRouter()
    const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_BASE_URL
    getOS();
    useVerifyAuth();
    dayjs.extend(localizedFormat);
    dayjs.extend(relativeTime);
    const Portal = dynamic(() => import('../layout/Portal/Portal'), {
      ssr: false
    });


  // Insert all the logic you had in your App component here
  const { themeStatus, hasHydrated, darkModeStatus } = useDarkMode();
  const queryClientRef = React.useRef(new QueryClient());
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }


  const theme = {
    theme: themeStatus,
    primary: COLORS.PRIMARY.code,
    secondary: COLORS.SECONDARY.code,
    success: COLORS.SUCCESS.code,
    info: COLORS.INFO.code,
    warning: COLORS.WARNING.code,
    danger: COLORS.DANGER.code,
    dark: COLORS.DARK.code,
    light: COLORS.LIGHT.code,
  };

  // Full Screen
  const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
  const ref = useRef(null);
  useFullscreen(ref, fullScreenStatus, {
    onClose: () => setFullScreenStatus(false),
  });
  
  console.log('Rendering MyApp component');
  const {locales, locale:activeLocale,defaultLocale} = router;
  
  

  useClientSideLayoutEffect(() => {
    if (process.env.NEXT_PUBLIC_MODERN_DESGIN === 'true') {
      document.body.classList.add('modern-design');
    } else {
      document.body.classList.remove('modern-design');
    }
  }, []);

  useClientSideLayoutEffect(() => {
    const nextRoot = document.getElementById('__next');
    if (nextRoot) {
      nextRoot.classList.add('d-flex', 'flex-column', 'flex-grow-1', 'flex-shrink-1');
      console.log("nextRoot found:", nextRoot);
    }
   
  }, []);
  

  return (
    <JssProvider registry={sheets} jss={jss}>
    <QueryClientProvider client={queryClientRef.current}>
      <ThemeContextProvider>
        <AuthContextProvider>
          <ThemeProvider theme={theme}>
            <ToastProvider components={{ ToastContainer, Toast }}>
              <DarkModeWrapper>
                <div id ="root" className='d-flex flex-column flex-grow-1 flex-shrink-1'>
                  <div
                    ref={ref}
                    className='app'
                    style={{
                      backgroundColor: fullScreenStatus ? 'var(--bs-body-bg)' : undefined,
                      zIndex: fullScreenStatus ? 1 : undefined,
                      overflow: fullScreenStatus ? 'scroll' : undefined,
                    }}>
  
                    <DefaultAside />
                    <Component {...pageProps} />
                  </div>
                  </div>
                  <Portal id='portal-notification'>
                    <ReactNotifications />
                  </Portal>
              </DarkModeWrapper>
            </ToastProvider>
          </ThemeProvider>
        </AuthContextProvider>
      </ThemeContextProvider>
    </QueryClientProvider> 
  </JssProvider>
  );
}

export default MyApp;
