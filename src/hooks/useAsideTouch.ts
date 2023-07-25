import { useContext, useEffect, useState } from 'react';
import { useMotionValue, useTransform } from 'framer-motion';
import ThemeContext from '../contexts/themeContext';
import useDeviceScreen from './useDeviceScreen';

const useAsideTouch = () => {
  const { asideStatus } = useContext(ThemeContext);
  const deviceScreen = useDeviceScreen();
  
  const [touchStatus, setTouchStatus] = useState(true);
  const [hasTouchButton, setHasTouchButton] = useState(false);
  const [mobileDesign, setMobileDesign] = useState(false);
  const [asideWidthWithSpace, setAsideWidthWithSpace] = useState(0);
  const x = useMotionValue(0);

  // X value get
  useEffect(() => {
    const unsubscribeX = x.onChange(value => setTouchStatus(!value));
    return () => {
      unsubscribeX();
    };
  }, [x]);

  // Calculate values after component mount
  useEffect(() => {
    if (deviceScreen?.width) {
      setMobileDesign(deviceScreen?.width <= Number(process.env.NEXT_PUBLIC_MOBILE_BREAKPOINT_SIZE || '0'));
      setHasTouchButton(deviceScreen?.width > Number(process.env.NEXT_PUBLIC_MOBILE_BREAKPOINT_SIZE || '0'));
    }

    const calculatedWidth =
      (parseInt(process.env.NEXT_PUBLIC_ASIDE_WIDTH_PX || '0', 10) +
      parseInt(process.env.NEXT_PUBLIC_SPACER_PX || '0', 10)) * -1;
    setAsideWidthWithSpace(calculatedWidth);

    const initialX = process.env.NEXT_PUBLIC_ASIDE_TOUCH_STATUS === 'true' ? 0 : calculatedWidth;
    x.set(initialX);
    setTouchStatus(initialX !== 0);

    if (!asideStatus) {
      x.set(0);
      setTouchStatus(false);
    }

    if (!hasTouchButton) {
      x.set(0);
    }
  }, [asideStatus, deviceScreen, hasTouchButton, x]);

  const left = useTransform(
    x,
    [-100, -90, -10, 0],
    [asideWidthWithSpace, asideWidthWithSpace, 0, 0]
  );
  
  const asideStyle = hasTouchButton ? { left } : { left: mobileDesign ? undefined : '0rem' };

  return { asideStyle, touchStatus, hasTouchButton, asideWidthWithSpace, x };
};

export default useAsideTouch;
