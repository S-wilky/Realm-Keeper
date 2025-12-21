import React from 'react';
import {tv} from 'tailwind-variants';
import "../styles/overrides.css";

// const Props = {
//     type: "accent" | "confirm" | "danger"
// }

export default function RK_Button({type, size, disabled, onClick, children}) {
    return (
        <button onClick={disabled ? null : onClick} className={buttonStyles({type, size, disabled})}>
            {children}
        </button>
    )
}

const buttonStyles = tv({
    base: "rounded-full hover:opacity-80 transition",
    variants: {
        type: {
            standard: "bg-dusky-blue",
            accent: "bg-pale-orange",
            confirm: "bg-green-500",
            danger: "bg-red-500"
        },
        size: {
            sm: "text-sm p-2",
            md: "text-md p-3",
        },
        disabled: {
            true: "bg-abbey opacity-25 hover:cursor-not-allowed! hover:border-0 hover:opacity-25"
        },
    },
    defaultVariants: {
        type: "standard",
        size: "md",
    }
})