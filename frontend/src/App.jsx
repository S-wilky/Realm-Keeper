import { useEffect, useState } from "react";
import supabase from "./services/supabase-client";
import Splash from "./components/Splash";
import Dashboard from "./components/Dashboard";
import LoginSignupForm from "./components/LoginSignupForm";
import "./App.css";
import logo from "./assets/RealmKeeperLogoSVG1.svg";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [username, setUsername] = useState("");
  const [session, setSession] = useState(null);

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
    <>
      {session ? (
        <Dashboard user={username} />
       ) : (
         <LoginSignupForm onSignIn={(name) => setUsername(name)} />
        )}  
    </>
  );
}

export default App;