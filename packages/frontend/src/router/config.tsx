import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import Home from '@/Home';
import Layout from '@/Layout';
import CreateEvent from '@/pages/CreateEvent';
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
      // 事件
      {
        path: '/event',
        element: <Event />,
      },
      // 仪表盘
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      // 创建事件
      {
        path: '/create',
        element: <CreateEvent />,
      },
    ],
  },
];

export const browserRouter: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routerConfig);
