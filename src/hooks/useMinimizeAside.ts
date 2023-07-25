import { useContext, useLayoutEffect, useEffect } from 'react';
import ThemeContext from '../contexts/themeContext';

export default function useMinimizeAside() {
	const { setAsideStatus, mobileDesign } = useContext(ThemeContext);

  // Determine if we're running on server or client.
	const isClient = typeof window === 'object';

  // Choose either useEffect or useLayoutEffect based on the environment.
  const useClientEffect = isClient ? useLayoutEffect : useEffect;

	useClientEffect(() => {
		if (!mobileDesign) setAsideStatus(false);
		return () => {
			if (!mobileDesign) setAsideStatus(true);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mobileDesign]);
}
