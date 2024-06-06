import { FC, useEffect, useMemo } from 'react';
import { Navigate, Route, Router, Routes } from 'react-router-dom';
import { initNavigator, useMiniApp, useViewport } from '@tma.js/sdk-react';
import { useIntegration } from '@tma.js/react-router-integration';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { routes } from '@/constants/routes.ts';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { AppProvider } from '@/context/app-context.tsx';
import { TonClientProvider } from '@/context/ton-client-context.tsx';

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
  <div>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>
        {error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : JSON.stringify(error)}
      </code>
    </blockquote>
  </div>
);

function App() {
  const miniApp = useMiniApp();
  const viewport = useViewport();

  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);

  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  useEffect(() => {
    miniApp.ready();
    miniApp.setBgColor('#161C24');
    miniApp.setHeaderColor('#161C24');
    viewport?.expand();
  }, []);

  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <TonConnectUIProvider
        manifestUrl={manifestUrl}
        actionsConfiguration={{ twaReturnUrl: 'https://t.me/tma_jetton_processing_bot/tma_jetton_processing' }}>
        <TonClientProvider>
          <AppProvider>
            <Router location={location} navigator={reactNavigator}>
              <Routes>
                {routes.map((route) => <Route key={route.path} {...route} />)}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </AppProvider>
        </TonClientProvider>
      </TonConnectUIProvider>
    </ErrorBoundary>
  );
}

export default App;
