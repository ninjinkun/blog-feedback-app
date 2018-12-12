import ReactGA from 'react-ga';

export function initializeGoogleAnalytics() {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('UA-36926308-2');
  }
}
