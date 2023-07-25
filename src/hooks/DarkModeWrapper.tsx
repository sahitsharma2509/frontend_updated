// DarkModeWrapper.tsx
import { useContext, useEffect, ReactNode } from 'react';
import ThemeContext from '../contexts/themeContext';

interface DarkModeWrapperProps {
  children: ReactNode;
}

const DarkModeWrapper: React.FC<DarkModeWrapperProps> = ({ children }) => {
  const { darkModeStatus, hasHydrated } = useContext(ThemeContext);

  useEffect(() => {
    if (hasHydrated) {
      if (darkModeStatus) {
        document.documentElement.setAttribute('theme', 'dark');
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('theme');
        document.documentElement.removeAttribute('data-bs-theme');
      }
    }
  }, [darkModeStatus, hasHydrated]);

  return <>{children}</>;
}

export default DarkModeWrapper;
