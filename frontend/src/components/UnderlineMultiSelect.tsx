import React, { useState } from "react";

interface UnderlineMultiSelectProps {
    value?: string[];
    onChange?: (values: string[]) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

interface TokenProps {
    label: string;
    disabled?: boolean;
    onRemove?: () => void;
}

const COLORS = {
    raised: "#1B2740",
    border: "#2A3A55",
    focusBorder: "#FF7A2F",
    danger: "#E5484D",
    primaryText: "#ECE6DA",
    secondaryText: "#A3AEC2",
    placeholder: "#6E7C94",
};

function Token({ label, disabled = false, onRemove }: TokenProps) {
    return (
        <span
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
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
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/20"
                    style={{ color: COLORS.secondaryText }}
                    aria-label={`Remove ${label}`}
                >
                    ×
                </button>
            )}
        </span>
    );
}

export default function UnderlineMultiSelect({
    value = [],
    onChange,
    placeholder = "Add an alias",
    label,
    error,
    disabled = false,
    className = "",
}: UnderlineMultiSelectProps) {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (disabled) return;

        if (e.key === "Enter") {
            e.preventDefault();
            const token = inputValue.trim();
            if (!token || value.includes(token)) {
                setInputValue("");
                return;
            }
            onChange?.([...value, token]);
            setInputValue("");
        }

        if (e.key === "Backspace" && !inputValue && value.length > 0) {
            onChange?.(value.slice(0, -1));
        }
    }

    function handleRemove(tokenValue: string) {
        if (disabled) return;
        onChange?.(value.filter((v) => v !== tokenValue));
    }

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="mb-1 block text-sm" style={{ color: COLORS.secondaryText }}>
                    {label}
                </label>
            )}
            <div
                className="flex min-h-10 w-full flex-wrap items-center gap-1.5 py-1.5 transition-colors"
                style={{
                    borderBottom: `1px solid ${
                        error
                            ? COLORS.danger
                            : isFocused
                            ? COLORS.focusBorder
                            : COLORS.border
                    }`,
                    opacity: disabled ? 0.55 : 1,
                }}
            >
                {value.map((token) => (
                    <Token
                        key={token}
                        label={token}
                        disabled={disabled}
                        onRemove={() => handleRemove(token)}
                    />
                ))}
                <input
                    type="text"
                    value={inputValue}
                    disabled={disabled}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={value.length === 0 ? placeholder : ""}
                    className="min-w-28 flex-1 bg-transparent py-1 text-sm outline-none"
                    style={{ color: COLORS.primaryText }}
                />
            </div>
            {error && (
                <p className="mt-1 text-xs" style={{ color: COLORS.danger }}>
                    {error}
                </p>
            )}
        </div>
    );
}