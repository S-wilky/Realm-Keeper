// Sign In screen

import React, { useState } from "react";
import logo from "../assets/RealmKeeperLogo.png";

const SignIn = ({ onSignIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim() !== "" && password.trim() !== "") {
            onSignIn(username); // pass username to App
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center bg-[#2C3539] p-4">
            <img src={logo} alt="Logo" className="w-32 h-32 mt-8 mb-6" />

            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4 p-3 rounded-md text-[#D9DDDC] bg-[#504B52] focus:outline-none focus:ring-2 focus:ring-[#EAAC59]"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-6 p-3 rounded-md text-[#D9DDDC] bg-[#504B52] focus:outline-none focus:ring-2 focus:ring-[#EAAC59]"
                />
                <button
                    type="submit"
                    className="mb-4 bg-[#504B52] text-[#D9DDDC] px-4 py-3 rounded-md hover:opacity-80 transition"
                >
                    Sign In
                </button>
                <button
                    type="button"
                    className="mb-4 bg-[#504B52] text-[#D9DDDC] px-4 py-3 rounded-md hover:opacity-80 transition"
                >
                    Sign in with Google
                </button>
                <button
                    type="button"
                    className="mb-6 bg-[#504B52] text-[#D9DDDC] px-4 py-3 rounded-md hover:opacity-80 transition"
                >
                    Sign in with Facebook
                </button>
                <button
                    type="button"
                    className="text-[#D9DDDC] underline hover:opacity-80 transition"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default SignIn;