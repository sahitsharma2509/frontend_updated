import React, { createContext, useLayoutEffect, useEffect,useState, useMemo, FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import useDeviceScreen from '../hooks/useDeviceScreen';
import useClientSideLayoutEffect from '../hooks/useClientSideLayoutEffect';
export interface IThemeContextProps {
	asideStatus: boolean;
	darkModeStatus: boolean;
	hasHydrated: boolean;
	fullScreenStatus: boolean;
	leftMenuStatus: boolean;
	mobileDesign: boolean;
	rightMenuStatus: boolean;
	rightPanel: boolean;
	setAsideStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setDarkModeStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setFullScreenStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setLeftMenuStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setRightMenuStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setRightPanel: (value: ((prevState: boolean) => boolean) | boolean) => void;
}
const ThemeContext = createContext<IThemeContextProps>({} as IThemeContextProps);

interface IThemeContextProviderProps {
	children: ReactNode;
}
export const ThemeContextProvider: FC<IThemeContextProviderProps> = ({ children }) => {
	const deviceScreen = useDeviceScreen();

	// @ts-ignore
	const mobileDesign = deviceScreen?.width <= process.env.NEXT_PUBLIC_MOBILE_BREAKPOINT_SIZE;

	// Initialize all states with a default value
	const [fullScreenStatus, setFullScreenStatus] = useState(false);
	const [leftMenuStatus, setLeftMenuStatus] = useState(false);
	const [rightMenuStatus, setRightMenuStatus] = useState(false);
	const [asideStatus, setAsideStatus] = useState(false);
	const [rightPanel, setRightPanel] = useState(false);
	const [darkModeStatus, setDarkModeStatus] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem('facit_darkModeStatus') === 'true';
		}
		return process.env.NEXT_PUBLIC_DARK_MODE === 'true';
	});
	

	const [hasHydrated, setHasHydrated] = useState(false);
	const defaultDarkMode = process.env.NEXT_PUBLIC_DEFAULT_DARK_MODE === 'true';
	




	useEffect(() => {
		// These are always initialized
		setFullScreenStatus(localStorage.getItem('facit_fullScreenStatus') === 'true');
		setLeftMenuStatus(localStorage.getItem('facit_leftMenuStatus') === 'true');
		setRightMenuStatus(localStorage.getItem('facit_rightMenuStatus') === 'true');
		setAsideStatus(localStorage.getItem('facit_asideStatus') === 'true');
		setRightPanel(localStorage.getItem('facit_rightPanel') === 'true');
		setDarkModeStatus((localStorage.getItem('facit_darkModeStatus') === 'true') || defaultDarkMode);

		setHasHydrated(true);
	  
		// The rest of your code is only run if window is defined
		if (typeof window !== 'undefined' && deviceScreen && deviceScreen.width) {
		  if (deviceScreen.width >= Number(process.env.NEXT_PUBLIC_ASIDE_MINIMIZE_BREAKPOINT_SIZE)) {
			if (localStorage.getItem('facit_asideStatus') === 'true') setAsideStatus(true);
			setLeftMenuStatus(false);
			setRightMenuStatus(false);
		  }
		}
	  }, [deviceScreen?.width]);

	  useEffect(() => {
		if (typeof window !== 'undefined') {
			const localDarkModeStatus = localStorage.getItem('facit_darkModeStatus');
			const isDarkMode = localDarkModeStatus
				? localDarkModeStatus === 'true'
				: process.env.NEXT_PUBLIC_DARK_MODE === 'true';
			setDarkModeStatus(isDarkMode);

		}
	}, []);
	
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('facit_darkModeStatus', darkModeStatus.toString());

		}
	}, [darkModeStatus]);
	

	const values: IThemeContextProps = useMemo(
		() => ({
			mobileDesign,
			darkModeStatus,
			setDarkModeStatus,
			fullScreenStatus,
			setFullScreenStatus,
			asideStatus,
			setAsideStatus,
			leftMenuStatus,
			setLeftMenuStatus,
			rightMenuStatus,
			setRightMenuStatus,
			rightPanel,
			setRightPanel,
			hasHydrated,
		}),
		[
			asideStatus,
			darkModeStatus,
			fullScreenStatus,
			leftMenuStatus,
			mobileDesign,
			rightMenuStatus,
			rightPanel,
			hasHydrated
		],
	);

	if (!hasHydrated) {
		return null;
	}

	return <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>;
};


ThemeContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ThemeContext;
