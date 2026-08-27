import React, { useState } from "react";

interface MultiSelectProps {
    value?: string[];
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    onChange?: (values: string[]) => void;
    className?: string;
}

interface TokenProps {
    label: string;
    disabled?: boolean;
    onRemove?: () => void;
}

const COLORS = {
    background: "#0B1220",
    surface: "#121C2E",
    raised: "#1B2740",
    brand: "#1E3A6B",
    border: "#2A3A55",
    accent: "#FF7A2F",
    danger: "#E5484D",
    primaryText: "#ECE6DA",
    secondaryText: "#A3AEC2",
    mutedText: "#6E7C94",
};

function Token({
    label,
    disabled = false,
    onRemove,
}: TokenProps) {
    return (
        <span
            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm"
            style={{
                backgroundColor: COLORS.raised,
                color: COLORS.primaryText,
                opacity: disabled ? 0.55 : 1,
            }}
        >
            {label}

            {onRemove && (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="flex h-4 w-4 items-center justify-center rounded-full"
                    style={{
                        color: COLORS.secondaryText,
                    }}
                    aria-label={`Remove ${label}`}
                >
                    x
                </button>
            )}
        </span>
    );
}

export default function MultiSelect({
    value = [],
    label,
    placeholder = "Add an item",
    disabled = false,
    error,
    onChange,
    className= "",
}: MultiSelectProps) {
    const [inputValue, setInputValue] = useState("");

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (disabled) return;

        if (e.key === "Enter") {
            e.preventDefault();

            const token = inputValue.trim();

            if (!token) return;

            if (value.includes(token)) {
                setInputValue("");
                return;
            }

            const newValues = [...value, token];

            onChange?.(newValues);
            setInputValue("");
        }

        if (e.key === "Backspace" && !inputValue && value.length > 0) {
            const newValues = value.slice(0, -1);

            onChange?.(newValues);
        }
    }

    function handleRemove(tokenValue: string) {
        if (disabled) return;

        const newValues = value.filter(
            (selectedValue) => selectedValue !== tokenValue
        );

        onChange?.(newValues);
    }

    return (
        <div className={`relative w-full ${className}`}>
            {/* Label */}
            {label && (
                <label
                    className="mb-1 block text-sm"
                    style={{
                        color: COLORS.secondaryText,
                    }}
                >
                    {label}
                </label>
            )}

            {/* Input */}
            <div
                className="flex min-h-10 w-full flex-wrap items-center gap-1 border-b px-0 py-1"
                style={{
                    backgroundColor: COLORS.background,
                    borderBottomColor: error
                        ? COLORS.danger
                        : COLORS.border,
                    color: COLORS.primaryText,
                    opacity: disabled ? 0.55 : 1,
                }}
            >
                {/* Selected Tokens */}
                {value.map((token) => (
                    <Token
                        key={token}
                        label={token}
                        disabled={disabled}
                        onRemove={() => handleRemove(token)}
                    />
                ))}

                {/* Text Input */}
                <input
                    type="text"
                    value={inputValue}
                    disabled={disabled}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : ""}
                    className="min-w-32 flex-1 bg-transparent py-1 text-sm outline-none"
                    style={{
                        color: COLORS.primaryText,
                    }}
                />
            </div>

            {/* Error Message */}
            {error && (
                <p
                    className="mt-1 text-sm"
                    style={{
                        color: COLORS.danger,
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}