import 'normalize.css';
import { createRoot } from 'react-dom/client';

import App from './App';

createRoot(document.getElementById('root')!).render(<App />);

// The previous CRA build registered a cache-first service worker.
// Unregister it so existing clients pick up new deploys immediately.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}
