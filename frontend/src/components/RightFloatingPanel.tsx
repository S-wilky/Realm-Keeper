import React from "react";
import RK_Icon from "./RK_Icon";

interface RightFloatingPanelProps {
    className?: string;
}

const COLORS = {
    surface: "#121C2E",
    raised: "#1B2740",
    border: "#2A3A55",
    primaryText: "#ECE6DA",
};

export default function RightFloatingPanel({
    className = "",
}: RightFloatingPanelProps) {
    return (
        <div
            className={`flex w-14 flex-col items-center gap-2 rounded-lg border p-2 ${className}`}
            style={{
                backgroundColor: COLORS.surface,
                borderColor: COLORS.border,
            }}
        >
            {/* Connections */}
            <button
                type="button"
                aria-label="Connections"
                title="Connections"
                className="flex h-10 w-10 items-center justify-center rounded-md border transition-colors"
                style={{
                    backgroundColor: COLORS.raised,
                    borderColor: COLORS.border,
                    color: COLORS.primaryText,
                }}
            >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                    <RK_Icon
                        icon="affiliate"
                        color="pearlRiver"
                        size="sm"
                        className="h-5 w-5"
                    />
                </span>
            </button>

            {/* Prompts */}
            <button
                type="button"
                aria-label="Prompts"
                title="Prompts"
                className="flex h-10 w-10 items-center justify-center rounded-md border transition-colors"
                style={{
                    backgroundColor: COLORS.raised,
                    borderColor: COLORS.border,
                    color: COLORS.primaryText,
                }}
            >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                    <RK_Icon
                        icon="bubble-text"
                        color="pearlRiver"
                        size="sm"
                        className="h-5 w-5"
                    />
                </span>
            </button>

            {/* Autolinker */}
            <button
                type="button"
                aria-label="Autolinker"
                title="Autolinker"
                className="flex h-10 w-10 items-center justify-center rounded-md border transition-colors"
                style={{
                    backgroundColor: COLORS.raised,
                    borderColor: COLORS.border,
                    color: COLORS.primaryText,
                }}
            >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                    <RK_Icon
                        icon="link-plus"
                        color="pearlRiver"
                        size="sm"
                        className="h-5 w-5"
                    />
                </span>
            </button>
        </div>
    );
}