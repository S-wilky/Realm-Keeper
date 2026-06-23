import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

import supabase from "./services/supabase-client";

import Splash from "./components/Splash";
import Dashboard from "./pages/Dashboard";
import LoginSignupForm from "./components/LoginSignupForm";
import ChatbotScreen from "./pages/ChatbotScreen";
import AIModeSelector from "./pages/AIModeSelector";
import ProfileScreen from "./pages/ProfileScreen";
import WorldScreen from "./pages/WorldScreen";
import CampaignScreen from "./pages/CampaignScreen";
import ArticleScreen from "./pages/ArticleScreen";
import SessionScreen from "./pages/SessionScreen";
import EmailConfirmedScreen from "./pages/EmailConfirmedScreen";

import "./App.css";
import logo from "./assets/RealmKeeperLogoSVG1.svg";

function App() {
    const [showSplash, setShowSplash] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);

    document.title = "Realm Keeper";

    async function fetchSession(): Promise<void> {
        const currentSession = await supabase.auth.getSession();
        setSession(currentSession.data.session);
    }

    useEffect(() => {
        fetchSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const link = document.createElement("link");

        link.rel = "icon";
        link.type = "image/svg+xml";
        link.href = logo;

        const exisiting = document.querySelectorAll('link[rel="icon"]');

        exisiting.forEach((e) => e.parentNode?.removeChild(e));

        document.head.appendChild(link);
    }, []);

    if (showSplash) {
        return <Splash onFinish={() => setShowSplash(false)} />;
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        session ? (
                            <Dashboard user={session.user} />
                        ) : (
                            <LoginSignupForm
                                onSignIn={() => fetchSession()}
                            />
                        )
                    }
                />
                <Route path="/chatbot" element={<AIModeSelector />} />

                <Route path="/chatbot/chat" element={<ChatbotScreen />} />

                <Route
                    path="/profile"
                    element={<ProfileScreen user={session?.user} />}
                />

                <Route path="/world/:id" element={<WorldScreen />} />

                <Route path="/campaign/:id" element={<CampaignScreen />} />

                <Route path="/article/:id" element={<ArticleScreen />} />

                <Route path="/session/:id" element={<SessionScreen />} />

                <Route
                    path="/email-confirmed"
                    element={<EmailConfirmedScreen />}
                />
            </Routes>
        </Router>
    );
}

export default App;