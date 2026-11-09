import React, { useState } from "react";
import RK_Icon from "./RK_Icon";

interface InsertMenuItem {
    label: string;
    description: string;
    icon: string;
}

interface InsertMenuCProps {
    onSelect?: (item: InsertMenuItem) => void;
    className?: string;
}

const COLORS = {
    background: "#0B1220",
    surface: "#121C2E",
    raised: "#1B2740",
    brand: "#1E3A6B",
    border: "#2A3A55",
    accent: "#FF7A2F",
    secret: "#A98BE0",
    primaryText: "#ECE6DA",
    secondaryText: "#A3AEC2",
    mutedText: "#6E7C94",
};

const MENU_ITEMS = [
    {
        category: "Basic",
        items: [
            {
                label: "Text",
                description: "Adds a text block to the editor.",
                icon: "text",
            },
            {
                label: "Heading 1",
                description: "Adds a large heading to the editor.",
                icon: "heading",
            },
            {
                label: "Heading 2",
                description: "Adds a level 2 heading to the editor.",
                icon: "heading",
            },
            {
                label: "Heading 3",
                description: "Adds a level 3 heading to the editor.",
                icon: "heading",
            },
            {
                label: "Heading 4",
                description: "Adds a level 4 heading to the editor.",
                icon: "heading",
            },
            {
                label: "Heading 5",
                description: "Adds a level 5 heading to the editor.",
                icon: "heading",
            },
            {
                label: "Heading 6",
                description: "Adds a level 6 heading to the editor.",
                icon: "heading",
            },
            {
                label: "Bulleted list",
                description:
                    "Creates an unordered list. Press Tab to nest one level.",
                icon: "list",
            },
            {
                label: "Numbered list",
                description: "Creates an unordered list.",
                icon: "list-numbers",
            },
            {
                label: "Quote",
                description: "Adds a quoted text block.",
                icon: "quote",
            },
            {
                label: "Divider",
                description: "Adds a horizontal divider.",
                icon: "separator",
            },
        ],
    },
    {
        category: "Embeds",
        items: [
            {
                label: "Image",
                description: "Inserts an image into the editor.",
                icon: "photo",
            },
            {
                label: "Map",
                description: "Embeds a map into the editor.",
                icon: "map",
            },
            {
                label: "Rollable table",
                description: "Adds a table that can be rolled on.",
                icon: "dice",
            },
        ],
    },
    {
        category: "Secret",
        items: [
            {
                label: "Secret block",
                description: "Adds content that can be hidden as a secret.",
                icon: "lock",
            },
        ],
    },
    {
        category: "Should-Ship",
        items: [
            {
                label: "Form / Fields",
                description:
                    "Adds a form block with fields for structured information.",
                icon: "forms",
            },
            {
                label: "Read-aloud",
                description:
                    "Adds a block for read-aloud text intended to be presented to players.",
                icon: "book-2",
            },
            {
                label: "Checklist",
                description:
                    "Adds a checklist for tracking tasks or objectives.",
                icon: "checklist",
            },
            {
                label: "Youtube / Spotify",
                description:
                    "Embeds Youtube or Spotify content into the editor.",
                icon: "player-play",
            },
        ],
    },
];

export default function InsertMenuC({
    onSelect,
    className = "",
}: InsertMenuCProps) {
    const [search, setSearch] = useState("");
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [helpItem, setHelpItem] = useState<string | null>(null);
    const [headingsExpanded, setHeadingsExpanded] = useState(false);

    const filteredCategories = MENU_ITEMS.map((category) => ({
        ...category,
        items: category.items.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter((category) => category.items.length > 0);

    return (
        <div
            className={`w-75 rounded-md border p-1 ${className}`}
            style={{
                backgroundColor: COLORS.raised,
                borderColor: COLORS.border,
            }}
        >
            {/* Search */}
            <div className="p-1">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search blocks..."
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                    style={{
                        backgroundColor: COLORS.surface,
                        borderColor: COLORS.border,
                        color: COLORS.primaryText,
                    }}
                />
            </div>

            {/* Menu Categories */}
            {filteredCategories.map((category) => (
                <div key={category.category} className="mt-1">
                    <div
                        className="px-3 py-1 text-xs"
                        style={{
                            color: COLORS.mutedText,
                        }}
                    >
                        {category.category}
                    </div>

                    {category.items.map((item) => {
                        const isHeading =
                            category.category === "Basic" &&
                            item.label.startsWith("Heading ");

                        const headingNumber = isHeading
                            ? Number(item.label.replace("Heading ", ""))
                            : 0;

                        // Heading text gets progressively smaller.
                        const headingTextSize =
                            headingNumber === 1
                                ? "text-sm"
                                : headingNumber === 2
                                ? "text-[13px]"
                                : headingNumber === 3
                                ? "text-xs"
                                : headingNumber === 4
                                ? "text-[11px]"
                                : headingNumber === 5
                                ? "text-[10px]"
                                : "text-[9px]";

                        // Heading icon gets progressively smaller.
                        const headingIconSize =
                            headingNumber === 1
                                ? "!h-5 !w-5"
                                : headingNumber === 2
                                ? "!h-[18px] !w-[18px]"
                                : headingNumber === 3
                                ? "!h-4 !w-4"
                                : headingNumber === 4
                                ? "!h-[14px] !w-[14px]"
                                : headingNumber === 5
                                ? "!h-3 !w-3"
                                : "!h-[10px] !w-[10px]";

                        // Only Heading 1 is shown when collapsed.
                        if (
                            isHeading &&
                            headingNumber > 1 &&
                            !headingsExpanded
                        ) {
                            return null;
                        }

                        const isHovered = hoveredItem === item.label;
                        const isHelpHovered = helpItem === item.label;

                        return (
                            <React.Fragment key={item.label}>
                                {/* Heading 1 with expand/collapse arrow */}
                                {item.label === "Heading 1" ? (
                                    <div
                                        className="relative flex w-full items-center rounded-md px-1 py-1"
                                        style={{
                                            backgroundColor: isHovered
                                                ? COLORS.brand
                                                : "transparent",
                                        }}
                                        onMouseEnter={() =>
                                            setHoveredItem(item.label)
                                        }
                                        onMouseLeave={() => {
                                            setHoveredItem(null);
                                            setHelpItem(null);
                                        }}
                                    >
                                        {/* Expand / Collapse Arrow */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setHeadingsExpanded(
                                                    (expanded) => !expanded
                                                )
                                            }
                                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[15px]"
                                            style={{
                                                backgroundColor:
                                                    "transparent",
                                                color: COLORS.secondaryText,
                                                border: "none",
                                                padding: 0,
                                            }}
                                            aria-label={
                                                headingsExpanded
                                                    ? "Collapse headings"
                                                    : "Expand headings"
                                            }
                                        >
                                            {headingsExpanded ? "▾" : "▸"}
                                        </button>

                                        {/* Heading 1 */}
                                        <button
                                            type="button"
                                            onClick={() => onSelect?.(item)}
                                            className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left"
                                            style={{
                                                backgroundColor:
                                                    "transparent",
                                                color: COLORS.primaryText,
                                                border: "none",
                                            }}
                                        >
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                                                <RK_Icon
                                                    icon={item.icon}
                                                    color="pearlRiver"
                                                    size="sm"
                                                    className="h-5 w-5"
                                                />
                                            </span>

                                            <span className={headingTextSize}>
                                                {item.label}
                                            </span>
                                        </button>

                                        {/* Help Button */}
                                        {isHovered && (
                                            <button
                                                type="button"
                                                className="relative ml-1 flex shrink-0 items-center justify-center rounded-full border"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    minWidth: "20px",
                                                    minHeight: "20px",
                                                    padding: 0,
                                                    marginRight: "4px",
                                                    borderRadius: "50%",
                                                    backgroundColor:
                                                        "transparent",
                                                    borderColor:
                                                        COLORS.secondaryText,
                                                    color: COLORS.secondaryText,
                                                    lineHeight: 1,
                                                    fontSize: "12px",
                                                }}
                                                aria-label={`Help for ${item.label}`}
                                                onMouseEnter={() =>
                                                    setHelpItem(item.label)
                                                }
                                                onMouseLeave={() =>
                                                    setHelpItem(null)
                                                }
                                            >
                                                ?

                                                {isHelpHovered && (
                                                    <div
                                                        className="absolute left-full top-1/2 z-50 ml-2 w-52 -translate-y-1/2 rounded-md border px-2 py-2 text-left text-xs shadow-lg"
                                                        style={{
                                                            backgroundColor:
                                                                COLORS.background,
                                                            borderColor:
                                                                COLORS.border,
                                                            color:
                                                                COLORS.primaryText,
                                                        }}
                                                    >
                                                        {item.description}
                                                    </div>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className={`relative flex w-full items-center rounded-md px-1 py-1 ${
                                            isHeading ? "pl-7" : ""
                                        }`}
                                        style={{
                                            backgroundColor: isHovered
                                                ? COLORS.brand
                                                : "transparent",
                                        }}
                                        onMouseEnter={() =>
                                            setHoveredItem(item.label)
                                        }
                                        onMouseLeave={() => {
                                            setHoveredItem(null);
                                            setHelpItem(null);
                                        }}
                                    >
                                        {/* Menu Item */}
                                        <button
                                            type="button"
                                            onClick={() => onSelect?.(item)}
                                            className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
                                            style={{
                                                backgroundColor:
                                                    "transparent",
                                                color:
                                                    category.category ===
                                                    "Secret"
                                                        ? COLORS.secret
                                                        : COLORS.primaryText,
                                                border: "none",
                                            }}
                                        >
                                            {/* Icon */}
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                                                <RK_Icon
                                                    icon={item.icon}
                                                    color={
                                                        category.category ===
                                                        "Secret"
                                                            ? "secret"
                                                            : "pearlRiver"
                                                    }
                                                    size="sm"
                                                    className={
                                                        isHeading
                                                            ? headingIconSize
                                                            : "h-5 w-5"
                                                    }
                                                />
                                            </span>

                                            {/* Label */}
                                            <span
                                                className={
                                                    isHeading
                                                        ? headingTextSize
                                                        : undefined
                                                }
                                            >
                                                {item.label}
                                            </span>
                                        </button>

                                        {/* Help Button */}
                                        {isHovered && (
                                            <button
                                                type="button"
                                                className="relative ml-1 flex shrink-0 items-center justify-center rounded-full border"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    minWidth: "20px",
                                                    minHeight: "20px",
                                                    padding: 0,
                                                    marginRight: "4px",
                                                    borderRadius: "50%",
                                                    backgroundColor:
                                                        "transparent",
                                                    borderColor:
                                                        COLORS.secondaryText,
                                                    color: COLORS.secondaryText,
                                                    lineHeight: 1,
                                                    fontSize: "12px",
                                                }}
                                                aria-label={`Help for ${item.label}`}
                                                onMouseEnter={() =>
                                                    setHelpItem(item.label)
                                                }
                                                onMouseLeave={() =>
                                                    setHelpItem(null)
                                                }
                                            >
                                                ?

                                                {/* Tooltip */}
                                                {isHelpHovered && (
                                                    <div
                                                        className="absolute left-full top-1/2 z-50 ml-2 w-52 -translate-y-1/2 rounded-md border px-2 py-2 text-left text-xs shadow-lg"
                                                        style={{
                                                            backgroundColor:
                                                                COLORS.background,
                                                            borderColor:
                                                                COLORS.border,
                                                            color:
                                                                COLORS.primaryText,
                                                        }}
                                                    >
                                                        {item.description}
                                                    </div>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}