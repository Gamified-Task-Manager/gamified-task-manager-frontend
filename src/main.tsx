import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // ✅ Make sure there's no `.js` extension
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
