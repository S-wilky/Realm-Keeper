// Splash Screen

import React, { useEffect, useState } from "react";
import logo from "../assets/RealmKeeperLogo.png";

const Splash = ({ onFinish }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    onFinish(); // Notify parent that splash is done
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
        return () => clearInterval(interval);
    }, [onFinish]);

    return (
        <div className="w-screen h-screen m-0 p-0 overflow-x-hidden flex flex-col justify-center items-center bg-[#2C3539]">
            <img src={logo} alt="Logo" className="w-32 h-32 mb-8" />
            <div className="w-64 max-w-[90vw] bg-[#504B52] rounded-full overflow-hidden">
                <div
                    className="bg-[#EAAC59] h-4"
                    style={{ width: `${progress}%`, transition: "width 0.1s" }}
                />
            </div>
            <p className="text-[#D9DDDC] mt-2">Loading...</p>
        </div>
    );
};

export default Splash;