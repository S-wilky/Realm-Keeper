import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import supabase from "./services/supabase-client";
import Splash from "./components/Splash";
import Dashboard from "./pages/Dashboard";
import LoginSignupForm from "./components/LoginSignupForm";
import ChatbotScreen from "./pages/ChatbotScreen";
import "./App.css";
import logo from "./assets/RealmKeeperLogoSVG1.svg";
import ProfileScreen from "./pages/ProfileScreen";
import WorldScreen from "./pages/WorldScreen";
import CampaignScreen from "./pages/CampaignScreen";
import ArticleScreen from "./pages/ArticleScreen";
import SessionScreen from "./pages/SessionScreen";
import EmailConfirmedScreen from "./pages/EmailConfirmedScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  // const [username, setUsername] = useState("");
  const [session, setSession] = useState(null);

  document.title = "Realm Keeper";

  async function fetchSession() {
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

    const existing = document.querySelectorAll('link[rel="icon"]');
    existing.forEach((e) => e.parentNode.removeChild(e));

    document.head.appendChild(link);
  }, []);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <Routes>
        {/* Default route -- Dashboard or Login */}
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

        {/* Chatbot route */}
        <Route path="/chatbot" element={<ChatbotScreen />} />

        {/* Profile Screen route */}
        <Route
          path="/profile"
          element={<ProfileScreen user={session?.user} />}
        />

        {/* Routes for detail screens */}
        <Route
          path="/world/:id"
          element={<WorldScreen />}
        />
        <Route
          path="/campaign/:id"
          element={<CampaignScreen />}
        />
        <Route
          path="/article/:id"
          element={<ArticleScreen />}
        />
        <Route
          path="/session/:id"
          element={<SessionScreen />}
        />
        <Route
          path="/email-confirmed"
          element={<EmailConfirmedScreen />}
        />
      </Routes>
    </Router>
  );
}

export default App;