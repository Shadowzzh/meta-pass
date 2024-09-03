import React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { Web3Provider } from '@/components/Web3Provider';
import { browserRouter } from '@/router/config';

import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NiceModal.Provider>
      <Web3Provider>
        <RouterProvider router={browserRouter} />
      </Web3Provider>
    </NiceModal.Provider>
    <Toaster />
  </React.StrictMode>,
);
