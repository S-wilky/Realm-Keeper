import { useEffect } from 'react';
import LoginSignupForm from './components/loginSignupForm'
import supabase from './services/supabase-client';
import React, { useState } from "react";
import Splash from "./components/Splash";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [username, setUsername] = useState(""); // store the entered username
  const [session, setSession] = useState(null);

  async function fetchSession() {
    const currentSession = supabase.auth.getSession()
    console.log(currentSession)
    setSession(currentSession.data.session)
  }

  useEffect(() => {
    fetchSession();

    const {data: authListener} = supabase.auth.onAuthStateChange(
      (_event, session) => {
      setSession(session)
      });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [])

  async function logout() {
    await supabase.auth.signOut();
  }

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  // If username is empty, show Sign In screen
  if (!username) {
    return <SignIn onSignIn={(name) => setUsername(name)} />;
  }

  // Once username is set, show Dashboard
  return <Dashboard user={username} />;
}

export default App;