import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useEffect } from 'react';
import './App.css'
import LoginSignupForm from './components/loginSignupForm'
import supabase from './services/supabase-client';

function App() {
  // const [count, setCount] = useState(0)
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

  return (
    <>
      {session ? 
      <div>
        <p>You're Signed In!</p>
        <button onClick={logout}>Log Out</button>
      </div>
      :
      <LoginSignupForm></LoginSignupForm>
      }
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
