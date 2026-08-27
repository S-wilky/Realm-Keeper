import React, { useState } from "react";

interface DropDownOption {
    label: string;
    value: string;
}

interface DropDownProps {
    options: DropDownOption[];
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
    className?: string;
}

const COLORS = {
    background: "#121C2E",
    border: "#2A3A55",
    text: "#ECE6DA",
    placeholder: "#6E7C94",
    hoverBorder: "#1E3A6B",
    openBorder: "#FF7A2F",
    disabledBackground: "#121C2E",
    disabledText: "#6E7C94",
    optionBackground: "#1B2740",
    optionHover: "#1E3A6B",
    optionSelected: "#1E3A6B",
};

export default function DropDown({
    options,
    value,
    placeholder = "Select a type",
    disabled = false,
    onChange,
    className = "",
}: DropDownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(
        (option) => option.value === value
    );

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
        <div className={`relative w-full ${className}`}>
            {/* Dropdown Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={handleToggle}
                className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left"
                style={{
                    backgroundColor: disabled
                        ? COLORS.disabledBackground
                        : COLORS.background,
                    borderColor: isOpen
                        ? COLORS.openBorder
                        : COLORS.border,
                    color: disabled
                        ? COLORS.disabledText
                        : selectedOption
                        ? COLORS.text
                        : COLORS.placeholder,
                }}
            >
                <span>
                    {selectedOption?.label ?? placeholder}
                </span>

                {/* Chevron */}
                <span
                    className={`ml-2 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    style={{
                        color: isOpen
                            ? COLORS.openBorder
                            : disabled
                            ? COLORS.disabledText
                            : COLORS.placeholder,
                    }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 9L12 15L18 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </button>

            {/* Dropdown Options */}
            {isOpen && !disabled && (
                <div
                    className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border"
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
                                className="w-full px-3 py-2 text-left"
                                style={{
                                    backgroundColor: isSelected
                                        ? COLORS.optionSelected
                                        : COLORS.optionBackground,
                                    color: COLORS.text,
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.backgroundColor =
                                            COLORS.optionHover;      
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        isSelected
                                            ? COLORS.optionSelected
                                            : COLORS.optionBackground;
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