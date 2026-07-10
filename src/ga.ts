import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router';

export function initializeGoogleAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (import.meta.env.MODE === 'test') {
    ReactGA.initialize('G-00000000', { testMode: true });
  } else if (measurementId) {
    ReactGA.initialize(measurementId);
  }
}

export function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    if (ReactGA.isInitialized) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname });
    }
  }, [location.pathname]);
}
