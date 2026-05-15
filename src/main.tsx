import '@/styles/global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@/app/App';
import { APP_ROOT_ID } from '@/app/app.constants';

const root = document.getElementById(APP_ROOT_ID);

if (!root) {
  throw new Error(`Element #${APP_ROOT_ID} not found`);
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
