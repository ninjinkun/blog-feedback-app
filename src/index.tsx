import 'normalize.css';
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { register } from './serviceWorker';

// App registration and rendering
render(<App />, document.getElementById('root'));
register();
