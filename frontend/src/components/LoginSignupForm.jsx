import React, { useState } from "react";
import supabase from "../services/supabase-client";
import logo from "../assets/RealmKeeperLogo.png";
import RK_Button from "./RK_Button";

function LoginSignupForm({ onSignIn }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confEmailSent, setConfEmailSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        //TODO: Figure out how to check current users here and tell them to log in if user exists.

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          throw signUpError
        } else {
          console.log(data);
          setConfEmailSent(true);
        }
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });
        if (signInError) throw signInError;

        // If successful, pass username/email back to parent
        if (onSignIn) onSignIn(email);
      }
    } catch (err) {
      console.error("Auth error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignin(e) {
    e.preventDefault();
    try {
      const { error: GoogleSigninError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
    if (GoogleSigninError) throw GoogleSigninError;
    } catch (err) {
      console.error("Auth error:", err.message);
      setError(err.message);
    }
  }

  async function handleDiscordSignin(e) {
    e.preventDefault();
    try {
      const { error: DiscordSigninError } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
      })
    if (DiscordSigninError) throw DiscordSigninError;
    } catch (err) {
      console.error("Auth error:", err.message);
      setError(err.message);
    }
  }

  return (
    <div className="w-screen h-screen m-0 p-0 flex flex-col items-center justify-center bg-[#2C3539] overflow-x-hidden">
      <img src={logo} alt="Logo" className="w-32 h-32 mt-8 mb-6" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-sm px-4"
      >
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-3 rounded-md text-[#D9DDDC] bg-[#504B52] focus:outline-none focus:ring-2 focus:ring-[#EAAC59]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 p-3 rounded-md text-[#D9DDDC] bg-[#504B52] focus:outline-none focus:ring-2 focus:ring-[#EAAC59]"
        />

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {confEmailSent && (
          <p className="text-red-400 text-sm mb-4 text-center">
            If email <strong>{email}</strong> exists and does not already have an associated account, you will see a confirmation email appear in your inbox shortly.
            </p>
        )}

        <RK_Button
          type="submit"
          disabled={loading}
          className="mb-4 bg-pale-orange text-[#D9DDDC] px-4 py-3 rounded-md hover:opacity-80 transition"
        >
          {loading
            ? "Loading..."
            : isSignUp
            ? "Sign Up"
            : "Sign In"}
        </RK_Button>

        {!isSignUp && (
          <>
            <RK_Button
              className="mb-4 text-[#D9DDDC] px-4 py-3 rounded-md hover:opacity-80 transition"
              onClick={handleGoogleSignin}
            >
              Sign in with Google
            </RK_Button>
            <RK_Button
              className="mb-6 text-[#D9DDDC] px-4 py-3 rounded-md hover:opacity-80 transition"
              onClick={handleDiscordSignin}
            >
              Sign in with Discord
            </RK_Button>
          </>
        )}

        <RK_Button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setConfEmailSent(false);
          }}
          className="text-[#D9DDDC] underline hover:opacity-80 transition"
        >
          {isSignUp ? "Switch to Sign In" : "Create Account"}
        </RK_Button>
      </form>
    </div>
  );
}

export default LoginSignupForm;