import 'normalize.css';
import React from 'react';
import { render } from 'react-dom';
import UAParser from 'ua-parser-js';

import App from './App';
import { register, unregister } from './serviceWorker';

// App registration and rendering
render(<App />, document.getElementById('root'));

const parser = new UAParser();
const result = parser.getResult();
// Safari's Service Woker sometimes caches HTML as JavaScript
const isSafari = result.browser.name === 'Safari' || result.browser.name === 'Mobile Safari';
if (isSafari) {
  unregister();
} else {
  register();
}
