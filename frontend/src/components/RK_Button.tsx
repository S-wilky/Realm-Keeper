import React from 'react';
import { tv } from 'tailwind-variants';
import '../styles/overrides.css';

interface RK_ButtonProps {
  type?: 'standard' | 'accent' | 'confirm' | 'danger';
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // ← accept event
  children: React.ReactNode;
  htmlType?: 'button' | 'submit' | 'reset';             // ← native type
  [key: string]: any;                                   // ← allow other props
}

export default function RK_Button({
  type = 'standard',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  children,
  htmlType,
  ...rest
}: RK_ButtonProps) {
  return (
    <button
      type={htmlType}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles({ type, size, disabled, className })}
      {...rest}
    >
      {children}
    </button>
  );
}

const buttonStyles = tv({
    base: "rounded-full hover:opacity-80 transition",
    variants: {
        type: {
            standard: "bg-dusky-blue",
            accent: "bg-pale-orange",
            confirm: "bg-green-500",
            danger: "bg-red"
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