import React from 'react';
import {tv} from 'tailwind-variants';
import "../styles/overrides.css";
import getIconPath from '../utils/getIconPath';

interface RK_IconProps {
  icon: string;
  color?: 'duskyBlue' | 'paleOrange' | 'pearlRiver' | 'gray400';
  size?: 'fill' | 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export default function RK_Icon({
  icon,
  color = 'duskyBlue',
  size = 'fill',
  onClick,
  className = '',
}: RK_IconProps) {
  const clickable = Boolean(onClick);
  const iconPath = getIconPath(icon);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      onClick={onClick}
      className={iconStyles({ color, clickable, size }) + ' ' + className}
    >
      <path d={iconPath} />
    </svg>
  );
}

const iconStyles = tv({
    base: "",
    variants: {
        color: {
            duskyBlue: "fill-dusky-blue",
            paleOrange: "fill-pale-orange",
            pearlRiver: "fill-pearl-river",
            gray400: "fill-gray-400",
        },
        size: {
            fill: "w-full h-full",
            sm: "text-sm p-0 w-10 h-10",
            md: "text-md p-2 w-24 h-24",
        },
        clickable: {
            true: "hover:opacity-80 cursor-pointer"
        }
    },
    defaultVariants: {
        color: "duskyBlue",
        size: "fill",
    }
})