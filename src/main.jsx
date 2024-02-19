import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import routesConfig from './routesConfig';
import { AuthProvider } from './context/AuthProvider';
import { DashboardSidebarProvider } from './context/DashboardSidebarContext';
const router = createBrowserRouter(routesConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DashboardSidebarProvider>
        <RouterProvider router={router} />
      </DashboardSidebarProvider>
    </AuthProvider>
  </React.StrictMode>,
);
