import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import routesConfig from './routesConfig';
import { AuthProvider } from './context/AuthProvider';
import { DashboardSidebarProvider } from './context/DashboardSidebarContext';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
const router = createBrowserRouter(routesConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DashboardSidebarProvider>
        <MantineProvider>
          <Notifications position='bottom-left' zIndex={1001} />
          <RouterProvider router={router} />
        </MantineProvider>
      </DashboardSidebarProvider>
    </AuthProvider>
  </React.StrictMode>,
);
