import { useEffect, useMemo } from 'react';
import { Navigate, Route, Router, Routes } from 'react-router-dom';
import { initNavigator, useMiniApp, useViewport } from '@telegram-apps/sdk-react';
import { useIntegration } from '@telegram-apps/react-router-integration';

import { routes } from '@/constants/routes.ts';

export function App() {
    const miniApp = useMiniApp();
    const viewport = useViewport();

    const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
    const [location, reactNavigator] = useIntegration(navigator);

    useEffect(() => {
        navigator.attach();
        return () => navigator.detach();
    }, [navigator]);

    useEffect(() => {
        miniApp.setBgColor('#161C24');
        miniApp.setHeaderColor('#161C24');
        miniApp.ready();
    }, [miniApp]);

    useEffect(() => {
        viewport && viewport.expand();
    }, [viewport]);

    return (
        <Router location={location} navigator={reactNavigator}>
            <Routes>
                {routes.map((route) => <Route key={route.path} {...route} />)}
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </Router>
    );
}
