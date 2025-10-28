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
        <div className="w-screen h-screen flex flex-col items-center bg-[#222A32] p-4">
            <img src={logo} alt="Logo" className="w-32 h-32 mt-8 mb-6" />

            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4 p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-6 p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="mb-4 bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600"
                >
                    Sign In
                </button>
                <button
                    type="button"
                    className="mb-4 bg-red-500 text-white px-4 py-3 rounded-md hover:bg-red-600"
                >
                    Sign in with Google
                </button>
                <button
                    type="button"
                    className="mb-6 bg-blue-700 text-white px-4 py-3 rounded-md hover:bg-blue-800"
                >
                    Sign in with Facebook
                </button>
                <button
                    type="button"
                    className="text-white underline hover:text-gray-300"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default SignIn;