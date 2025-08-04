import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <>
      <h1>PERN w/Supabase - Client side w/React</h1>
      <RouterProvider router={router} />
    </>
  </React.StrictMode>
);