import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import Home from '@/Home';
import Layout from '@/Layout';
import Dashboard from '@/pages/Dashboard';
import Event from '@/pages/Event';

export const routerConfig: RouteObject[] = [
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Navigate to="/home" replace /> },
      {
        path: '/event',
        element: <Event />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
];

export const browserRouter: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routerConfig);
