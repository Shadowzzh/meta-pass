import React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';
import { Web3Provider } from '@/components/Web3Provider';
import routerInstance from '@/router/config';

import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Web3Provider>
      <NiceModal.Provider>
        <RouterProvider router={routerInstance} />
      </NiceModal.Provider>
    </Web3Provider>
    <Toaster />
  </React.StrictMode>,
);
