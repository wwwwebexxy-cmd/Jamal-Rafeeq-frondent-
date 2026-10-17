import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import './../App.css';
import client from "../lib/ApiClient";
import { clearAuthSession, saveAuthSession } from "../features/auth/authUtils";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Router from './Router';
import ScrollToTop from '../components/ScrollToTop';

function App() {

    const location = useLocation();
    const normalizedPath = location.pathname.toLowerCase();
    const isAdminPage = normalizedPath.startsWith("/automotive-dashboard") || normalizedPath.startsWith("/eehook-dashboard") || normalizedPath.startsWith("/orderdashboard") || normalizedPath.startsWith("/order-dashboard");
    const [authReady, setAuthReady] = useState(() => !isAdminPage);

    useEffect(() => {
        if (!isAdminPage) return undefined;

        let active = true;
        // Only the protected admin workspace needs session restoration. The
        // public catalogue must render without an auth API dependency.
        client.get("auth/session/", {
            skipAuthRefresh: true,
            skipAuthRedirect: true,
            timeout: 5000,
        })
            .then((response) => {
                if (active) saveAuthSession(response.data);
            })
            .catch((error) => {
                if (error.response?.status === 401) clearAuthSession();
            })
            .finally(() => {
                if (active) setAuthReady(true);
            });
        return () => { active = false; };
    }, [isAdminPage]);

    if (isAdminPage && !authReady) return <div aria-live="polite" className="app-loading">Loading...</div>;

    return (
        <>
            <ScrollToTop />

            {!isAdminPage && <Navbar />}

            <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Router />
            </div>

            {!isAdminPage && <Footer />}
        </>
    );
}

export default App;
