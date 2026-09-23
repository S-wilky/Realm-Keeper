import React, { useState } from "react";

interface UnderlineInputProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

const COLORS = {
    border: "#2A3A55",
    focusBorder: "#FF7A2F",
    danger: "#E5484D",
    text: "#ECE6DA",
    placeholder: "#6E7C94",
    disabledText: "#6E7C94",
};

export default function UnderlineInput({
    value = "",
    onChange,
    placeholder = "Name this Tome",
    label,
    error,
    disabled = false,
    className = "",
}: UnderlineInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="mb-1 block text-sm" style={{ color: COLORS.placeholder }}>
                    {label}
                </label>
            )}
            <div className="relative flex flex-col">
                <input
                    type="text"
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange?.(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full bg-transparent py-2 text-sm outline-none transition-colors"
                    style={{
                        borderBottom: `1px solid ${
                            error
                                ? COLORS.danger
                                : isFocused
                                ? COLORS.focusBorder
                                : COLORS.border
                        }`,
                        color: disabled ? COLORS.disabledText : COLORS.text,
                        opacity: disabled ? 0.55 : 1,
                    }}
                />
                {error && (
                    <p className="mt-1 text-xs" style={{ color: COLORS.danger }}>
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}