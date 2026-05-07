import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx';
import './index.css'; // Global Tailwind & base styles

/**
 * Application Entry Point
 * Renders the root React component, wrapping it in standard context providers.
 * - React.StrictMode: Highlights potential problems in an application
 * - Provider: Inject the global Redux store into the component tree
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
