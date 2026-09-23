import {
    useState,
    useEffect,
} from "react";

const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

type ScreenSizeLabel =
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl";

type ScreenSize = {
    screenWidth: number;
    innerScreenWidth: number;
    screenSizeLabel: ScreenSizeLabel;
};

function getSizeLabel(
    width: number
): ScreenSizeLabel {
    if (width >= breakpoints["2xl"]) {
        return "2xl";
    }

    if (width >= breakpoints.xl) {
        return "xl";
    }

    if (width >= breakpoints.lg) {
        return "lg";
    }

    if (width >= breakpoints.md) {
        return "md";
    }

    if (width >= breakpoints.sm) {
        return "sm";
    }

    return "xs";
}

export default function useScreenSize(): ScreenSize {
    const [screenSize, setScreenSize] =
        useState<ScreenSize>({
            screenWidth:
                typeof window !== "undefined"
                    ? window.innerWidth
                    : 0,

            innerScreenWidth: 0,

            screenSizeLabel:
                typeof window !== "undefined"
                    ? getSizeLabel(
                            window.innerWidth
                        )
                    : "xs",
        });

    useEffect(() => {
        const handleResize = (): void => {
            const outer =
                document.createElement("div");

            outer.style.visibility =
                "hidden";
            outer.style.overflow =
                "scroll";
            outer.style.width = "100px";

            document.body.appendChild(
                outer
            );

            const inner =
                document.createElement("div");

            inner.style.width = "100%";

            outer.appendChild(inner);

            const scrollbarWidth =
                outer.offsetWidth -
                inner.offsetWidth;

            outer.parentNode?.removeChild(
                outer
            );

            const screenWidth =
                window.innerWidth;

            const innerScreenWidth =
                screenWidth -
                scrollbarWidth -
                100;

            setScreenSize({
                screenWidth,
                innerScreenWidth,
                screenSizeLabel:
                    getSizeLabel(
                        screenWidth
                    ),
            });
        };

        window.addEventListener(
            "resize",
            handleResize
        );

        handleResize();

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);

    return screenSize;
}