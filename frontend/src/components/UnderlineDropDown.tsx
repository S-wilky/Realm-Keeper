import React, { useState, useRef, useEffect } from "react";

interface DropDownOption {
    label: string;
    value: string;
}

interface UnderlineDropDownProps {
    options: DropDownOption[];
    value?: string;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
    className?: string;
}

const COLORS = {
    background: "#121C2E",
    optionBackground: "#1B2740",
    optionHover: "#1E3A6B",
    optionSelected: "#1E3A6B",
    border: "#2A3A55",
    openBorder: "#FF7A2F",
    danger: "#E5484D",
    text: "#ECE6DA",
    placeholder: "#6E7C94",
};

export default function UnderlineDropDown({
    options,
    value,
    placeholder = "Select a type",
    label,
    error,
    disabled = false,
    onChange,
    className = "",
}: UnderlineDropDownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleToggle() {
        if (disabled) return;
        setIsOpen((open) => !open);
    }

    function handleSelect(option: DropDownOption) {
        if (disabled) return;
        onChange?.(option.value);
        setIsOpen(false);
    }

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            {label && (
                <label className="mb-1 block text-sm" style={{ color: COLORS.placeholder }}>
                    {label}
                </label>
            )}

            <button
                type="button"
                disabled={disabled}
                onClick={handleToggle}
                className="flex w-full items-center justify-between py-2 text-left transition-colors"
                style={{
                    borderBottom: `1px solid ${
                        error
                            ? COLORS.danger
                            : isOpen
                            ? COLORS.openBorder
                            : COLORS.border
                    }`,
                    color: disabled
                        ? COLORS.placeholder
                        : selectedOption
                        ? COLORS.text
                        : COLORS.placeholder,
                    opacity: disabled ? 0.55 : 1,
                }}
            >
                <span>{selectedOption?.label ?? placeholder}</span>
                <span
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: isOpen ? COLORS.openBorder : COLORS.placeholder }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>

            {error && (
                <p className="mt-1 text-xs" style={{ color: COLORS.danger }}>
                    {error}
                </p>
            )}

            {isOpen && !disabled && (
                <div
                    className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border shadow-xl"
                    style={{
                        backgroundColor: COLORS.optionBackground,
                        borderColor: COLORS.border,
                    }}
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className="w-full px-3 py-2 text-left text-sm transition-colors"
                                style={{
                                    backgroundColor: isSelected ? COLORS.optionSelected : COLORS.optionBackground,
                                    color: COLORS.text,
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) e.currentTarget.style.backgroundColor = COLORS.optionHover;
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) e.currentTarget.style.backgroundColor = COLORS.optionBackground;
                                }}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}