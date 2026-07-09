import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import { store } from '@/app/store';
import { queryClient } from '@/app/queryClient';
import AuthBootstrap from '@/components/auth/AuthBootstrap';
import AppRoutes from '@/routes/AppRoutes';

export default function App() {
  return (
    <HelmetProvider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthBootstrap>
              <AppRoutes />
            </AuthBootstrap>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { background: '#181b26', color: '#fff', borderRadius: '12px' },
              }}
            />
          </BrowserRouter>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ReduxProvider>
    </HelmetProvider>
  );
}
