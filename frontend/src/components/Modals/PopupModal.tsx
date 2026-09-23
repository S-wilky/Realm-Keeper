// Popup Base Modal - used by all popups

import React from "react";

const PopupModal = ({ children, onClose }) => {
    return (
        // Fullscreen overlay
        <div
            onClick={onClose} // Clicking outside closes the popup
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(44, 53, 57, 0.7)", // semi-transparent overlay
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            {/* Modal content */}
            <div
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                style={{
                    backgroundColor: "#2C3539", // popup background
                    color: "#D9DDDC", // text color
                    padding: "2rem",
                    borderRadius: "12px",
                    minWidth: "300px",
                    maxWidth: "500px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    position: "relative",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "transparent",
                        border: "none",
                        color: "#D9DDDC",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                    }}
                >
                    ✕
                </button>

                {/* Dynamic content */}
                {children}
            </div>
        </div>
    );
};

export default PopupModal;