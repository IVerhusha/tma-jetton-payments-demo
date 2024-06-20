import { useEffect, useMemo } from 'react';
import { SDKProvider, useLaunchParams } from '@tma.js/sdk-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { TonClientProvider } from '@/context/ton-client-context.tsx';
import { AppStateProvider } from '@/context/app-context.tsx';

function ErrorBoundaryError({ error }: { error: unknown }) {
    return (
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
}

function Inner() {
    const debug = useLaunchParams().startParam === 'debug';
    const manifestUrl = useMemo(() => {
        return new URL('tonconnect-manifest.json', window.location.href).toString();
    }, []);

    // Enable debug mode to see all the methods sent and events received.
    useEffect(() => {
        if (debug) {
            import('eruda').then((lib) => lib.default.init());
        }
    }, [debug]);

    return (
        <TonConnectUIProvider
            manifestUrl={manifestUrl}
            actionsConfiguration={{ twaReturnUrl: 'https://t.me/tma_jetton_processing_bot/tma_jetton_processing' }}
        >
            <TonClientProvider>
                <AppStateProvider>
                    <SDKProvider acceptCustomStyles debug={debug}>
                        <App/>
                    </SDKProvider>
                </AppStateProvider>
            </TonClientProvider>
        </TonConnectUIProvider>
    );
}

export function Root() {
    return (
        <ErrorBoundary fallback={ErrorBoundaryError}>
            <Inner/>
        </ErrorBoundary>
    );
}
