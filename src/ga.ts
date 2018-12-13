import ReactGA from 'react-ga';

export function initializeGoogleAnalytics() {
  switch (process.env.NODE_ENV) {
    case 'production':
      ReactGA.initialize('UA-36926308-2');
      break;
    case 'development':
      ReactGA.initialize('', { debug: true });
      break;
    case 'test':
      ReactGA.initialize('', { testMode: true });
      break;
    default:
      break;
  }
}
