import React, { useState } from "react";

interface FlipChipProps {
    initialState?: "draft" | "finished" | string;
    states?: { label: string; status: string; dotColor: string }[];
    onChange?: (newState: string) => void;
    disabled?: boolean;
    className?: string;
}

const DEFAULT_STATES = [
    { label: "Draft", status: "draft", dotColor: "#A78BFA" },       // soft purple
    { label: "Finished", status: "finished", dotColor: "#2DD4BF" }, // teal
];

const COLORS = {
    background: "#121C2E",
    border: "#2A3A55",
    hoverBorder: "#1E3A6B",
    text: "#ECE6DA",
};

export default function FlipChip({
    initialState = "draft",
    states = DEFAULT_STATES,
    onChange,
    disabled = false,
    className = "",
}: FlipChipProps) {
    // Find the initial index or default to 0
    const [currentIndex, setCurrentIndex] = useState(() => {
        const found = states.findIndex((s) => s.status === initialState);
        return found !== -1 ? found : 0;
    });

    const currentState = states[currentIndex];

    const handleFlip = () => {
        if (disabled) return;
        const nextIndex = (currentIndex + 1) % states.length;
        setCurrentIndex(nextIndex);
        onChange?.(states[nextIndex].status);
    };

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={handleFlip}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all select-none cursor-pointer ${className}`}
            style={{
                backgroundColor: COLORS.background,
                borderColor: COLORS.border,
                color: COLORS.text,
                opacity: disabled ? 0.55 : 1,
            }}
            onMouseEnter={(e) => {
                if (!disabled) e.currentTarget.style.borderColor = COLORS.hoverBorder;
            }}
            onMouseLeave={(e) => {
                if (!disabled) e.currentTarget.style.borderColor = COLORS.border;
            }}
        >
            <span
                className="h-2 w-2 rounded-full transition-colors duration-200"
                style={{ backgroundColor: currentState.dotColor }}
            />
            <span className="transition-all duration-200">{currentState.label}</span>
        </button>
    );
}