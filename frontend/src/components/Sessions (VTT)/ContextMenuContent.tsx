import React from "react";
import MenuItem from "./MenuItem";
import { Menu } from "lucide-react";

interface Asset {
    id: string;
    snapToGrid: boolean;
    layer: "map" | "token";
}

interface InteractionState {
    selected: {
        id: string;
        layer: "map" | "token";
    } | null;
}

interface ContextMenuContentProps {
    assetId: string | null;
    snapToGrid: boolean;
    layer: "map" | "token";
    setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
    setInteractionState: React.Dispatch<
        React.SetStateAction<InteractionState>
    >;
    closeMenu: () => void;
    deleteAsset: (assetId: string) => void;
}

export default function ContextMenuContent({
    assetId,
    snapToGrid,
    layer,
    setAssets,
    setInteractionState,
    closeMenu,
    deleteAsset,
}: ContextMenuContentProps) {
    if (!assetId) return null;

    const toggleSnapToGrid = (assetId: string) => {
        setAssets((assets) =>
            assets.map((asset) =>
                asset.id === assetId
                    ? { ...asset, snapToGrid: !asset.snapToGrid }
                    : asset
            )
        );

        setInteractionState((s) => ({ ...s, selected: null }));
    };

    const cycleLayer = (assetId: string, layer: "map" | "token") => {
        const newLayer = layer === "map" ? "token" : "map";

        setAssets((assets) =>
            assets.map((asset) =>
                asset.id === assetId
                    ? { ...asset, layer: newLayer }
                    : asset
            )
        );

        setInteractionState((s) => ({ ...s, selected: null }));
    };

    return (
        <>
            <MenuItem
                onClick={() => {
                    console.log("Toggling snapToGrid");
                    toggleSnapToGrid(assetId);
                    closeMenu();
                }}
            >
                {snapToGrid && "✓ "}Snap to Grid
            </MenuItem>

            <MenuItem
                onClick={() => {
                    cycleLayer(assetId, layer);
                    closeMenu();
                }}
            >
                Switch Layer
            </MenuItem>

            <MenuItem
                danger
                onClick={() => {
                    deleteAsset(assetId);
                    closeMenu();
                }}
            >
                Delete Asset
            </MenuItem>
        </>
    );
}