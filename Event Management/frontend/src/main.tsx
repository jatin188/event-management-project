import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  </React.StrictMode>
);
