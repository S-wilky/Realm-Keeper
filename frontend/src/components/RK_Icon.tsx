import React from 'react';
import { tv } from 'tailwind-variants';
import "../styles/overrides.css";
// import getIconPath from '../utils/getIconPath';

import {
  IconBook,
  IconPencil,
  IconBinoculars,
  IconMessage,
  IconSettings,
  IconLink,
  IconPointer,
  IconTrash,
  IconHome,
  IconRefresh,
  IconBookmark,
  IconHelp,
  IconTypography,
  IconHeading,
  IconList,
  IconListNumbers,
  IconQuote,
  IconSeparator,
  IconPhoto,
  IconMap,
  IconDice,
  // IconEyeOff,
  IconLock,
  IconForms,
  IconBook2,
  IconChecklist,
  IconPlayerPlay,
  IconAffiliate,
  IconBubbleText,
  IconLinkPlus,
} from "@tabler/icons-react";


interface RK_IconProps {
  icon: string;
  color?: 'duskyBlue' | 'paleOrange' | 'pearlRiver' | 'gray400' | 'abbey' | 'secret';
  size?: 'fill' | 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

const ICONS: Record<string, React.ElementType> = {
    book: IconBook,
    pencil: IconPencil,
    binoculars: IconBinoculars,
    chat: IconMessage,
    settings: IconSettings,
    connect: IconLink,
    "pointer-finger": IconPointer,
    trash: IconTrash,
    home: IconHome,
    reset: IconRefresh,
    bookmark: IconBookmark,
    text: IconTypography,
    heading: IconHeading,
    list: IconList,
    "list-numbers": IconListNumbers,
    quote: IconQuote,
    separator: IconSeparator,
    photo: IconPhoto,
    map: IconMap,
    dice: IconDice,
    // "eye-off": IconEyeOff,
    lock: IconLock,
    forms: IconForms,
    "book-2": IconBook2,
    checklist: IconChecklist,
    "player-play": IconPlayerPlay,
    affiliate: IconAffiliate,
    "bubble-text": IconBubbleText,
    "link-plus": IconLinkPlus,
};

export default function RK_Icon({
  icon,
  color = 'duskyBlue',
  size = 'fill',
  onClick,
  className = '',
}: RK_IconProps) {
  const clickable = Boolean(onClick);
  const IconComponent = ICONS[icon] ?? IconHelp;

  return (
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   viewBox="0 0 100 100"
    //   onClick={onClick}
    //   className={iconStyles({ color, clickable, size }) + ' ' + className}
    // >
    //   <path d={iconPath} />
    // </svg>

      <IconComponent
          onClick={onClick}
          className={`${iconStyles({
              color,
              clickable,
              size,
          })} ${className}`}
          aria-hidden="true"
      />
  );
}

const iconStyles = tv({
    base: "",
    variants: {
        color: {
            duskyBlue: "text-dusky-blue",
            paleOrange: "text-pale-orange",
            pearlRiver: "text-pearl-river",
            gray400: "text-gray-400",
            abbey: "text-abbey",
            secret: "text-[#A98BE0]",
        },
        size: {
            fill: "w-full h-full",
            sm: "text-sm p-0 w-10 h-10",
            md: "text-md p-2 w-24 h-24",
        },
        clickable: {
            true: "hover:opacity-80 cursor-pointer",
        },
    },
    defaultVariants: {
        color: "duskyBlue",
        size: "fill",
    },
});