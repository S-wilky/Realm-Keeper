import { tv } from "tailwind-variants";

export default function Tooltip({
  children,
  content,
  side = "left",
  bg = "erie",
  text = "default",
  wrap = false,
  maxWidth = "sm",
}) {
  return (
    <div className="relative inline-block w-full h-full group">
      {/* <div className="w-full h-full flex items-center justify-center"> */}
        {children}
      {/* </div> */}

      <div className={tooltipStyles({ side, bg, text, wrap, maxWidth })}>
        {content}
        <div className={arrowStyles({ side, bg })} />
      </div>
    </div>
  );
}

const tooltipStyles = tv({
  base: `
    pointer-events-none absolute
    opacity-0 group-hover:opacity-100
    z-50 px-3 py-2
    rounded-full text-sm
    shadow-lg shadow-black/20
    transition delay-100 duration-150
  `,
  variants: {
    side: {
      left: `
        right-full mr-3 top-1/2 -translate-y-1/2
      `,
      right: `
        left-full ml-3 top-1/2 -translate-y-1/2
      `,
      top: `
        bottom-full left-1/2 -translate-x-1/2 mb-3
      `,
      bottom: `
        top-full left-1/2 -translate-x-1/2 mt-3
      `,
    },
    bg: {
      erie: "bg-erie",
      dark: "bg-gray-900",
      light: "bg-gray-100",
    },
    text: {
      default: "text-white",
      dark: "text-gray-900",
      light: "text-gray-700",
    },
    wrap: {
      false: "whitespace-nowrap",
      true: "whitespace-normal",
    },
    maxWidth: {
      none: "",
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
    },
  },
  defaultVariants: {
    side: "left",
    bg: "erie",
    text: "default",
    wrap: false,
    maxWidth: "sm",
  },
});

const arrowStyles = tv({
  base: `
    absolute
    w-3 h-3 rotate-45
    transition delay-100 duration-150
    shadow-lg shadow-black/20
  `,
  variants: {
    side: {
      left: `
        -right-0.75 top-1/2 -translate-y-1/2
      `,
      right: `
        -left-0.75 top-1/2 -translate-y-1/2
      `,
      top: `
        -bottom-0.5 left-1/2 -translate-x-1/2
      `,
      bottom: `
        -top-0.5 left-1/2 -translate-x-1/2
      `,
    },
    bg: {
      erie: "bg-erie",
      dark: "bg-gray-900",
      light: "bg-gray-100",
    },
  },
  defaultVariants: {
    side: "left",
    bg: "erie",
  },
});
