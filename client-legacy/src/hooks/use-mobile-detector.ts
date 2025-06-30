import { useState, useEffect } from 'react';

interface MobileDetectorReturn {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isCapacitor: boolean;
}

export function useMobileDetector(): MobileDetectorReturn {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isCapacitor, setIsCapacitor] = useState<boolean>(false);

  useEffect(() => {
    const detectMobile = () => {
      // Check if the app is running as a Capacitor app
      const isRunningInCapacitor = window.hasOwnProperty('Capacitor');
      setIsCapacitor(isRunningInCapacitor);

      // Check for mobile device
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
      const tabletRegex = /android|ipad|playbook|silk/i;
      
      const isMobileDevice = 
        mobileRegex.test(userAgent) || 
        (userAgent.substring(0, 4).toLowerCase() === 'ipad') ||
        (tabletRegex.test(userAgent) && window.matchMedia("(max-width: 1024px)").matches);
      
      setIsMobile(isMobileDevice);

      // Detect iOS
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      setIsIOS(isIOSDevice);

      // Detect Android
      const isAndroidDevice = /Android/.test(userAgent);
      setIsAndroid(isAndroidDevice);
    };

    detectMobile();

    // Re-detect on resize
    window.addEventListener('resize', detectMobile);
    return () => window.removeEventListener('resize', detectMobile);
  }, []);

  return {
    isMobile,
    isIOS,
    isAndroid,
    isCapacitor
  };
} 