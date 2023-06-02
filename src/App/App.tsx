import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'react-jss';
import { ReactNotifications } from 'react-notifications-component';
import { useFullscreen } from 'react-use';
import { ToastProvider } from 'react-toast-notifications';
import ThemeContext from '../contexts/themeContext';
import Wrapper from '../layout/Wrapper/Wrapper';
import Portal from '../layout/Portal/Portal';
import { Toast, ToastContainer } from '../components/bootstrap/Toasts';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import { getOS } from '../helpers/helpers';
import AsideRoutes from '../layout/Aside/AsideRoutes';
import axios from 'axios';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AuthContextProvider } from '../contexts/authContext';

import useVerifyAuth from '../pages/presentation/auth/userVerify';
import {api,refreshAccessToken } from '../apiHelper'

const App = () => {
	const BASE_URL = process.env.REACT_APP_DJANGO_BASE_URL
	getOS();
	useVerifyAuth()
	

	dayjs.extend(localizedFormat);
	dayjs.extend(relativeTime);


	const { themeStatus, darkModeStatus } = useDarkMode();
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

	useEffect(() => {
		if (darkModeStatus) {
			document.documentElement.setAttribute('theme', 'dark');
			document.documentElement.setAttribute('data-bs-theme', 'dark');
		}
		return () => {
			document.documentElement.removeAttribute('theme');
			document.documentElement.removeAttribute('data-bs-theme');
		};
	}, [darkModeStatus]);

	/**
	 * Full Screen
	 */
	const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
	const ref = useRef(null);
	useFullscreen(ref, fullScreenStatus, {
		onClose: () => setFullScreenStatus(false),
	});

	/**
	 * Modern Design
	 */
	useLayoutEffect(() => {
		if (process.env.REACT_APP_MODERN_DESGIN === 'true') {
			document.body.classList.add('modern-design');
		} else {
			document.body.classList.remove('modern-design');
		}
	});
	return (
		<ThemeProvider theme={theme}>
			<ToastProvider components={{ ToastContainer, Toast }}>


					<div
						ref={ref}
						className='app'
						style={{
							backgroundColor: fullScreenStatus ? 'var(--bs-body-bg)' : undefined,
							zIndex: fullScreenStatus ? 1 : undefined,
							overflow: fullScreenStatus ? 'scroll' : undefined,
						}}>
						<AsideRoutes />
						<Wrapper />
					</div>
					<Portal id='portal-notification'>
						<ReactNotifications />
					</Portal>

			</ToastProvider>
		</ThemeProvider>
	);
};

export default App;
