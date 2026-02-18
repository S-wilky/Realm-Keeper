import MenuItem from "./MenuItem.jsx";

export default function ContextMenuContent({
  assetId,
  snapToGrid,
  layer,
  setAssets,
  setInteractionState,
  closeMenu,
  deleteAsset,
}) {
  if (!assetId) return null;

  const toggleSnapToGrid = (assetId) => {
    if (!assetId) return;

    setAssets((assets) =>
        assets.map((asset) =>
            asset.id === assetId
            ? { ...asset, snapToGrid: !asset.snapToGrid}
            : asset
        )
    )

    setInteractionState((s) => ({ ...s, selected: null }));
  };

  const cycleLayer = (assetId, layer) => {
    if (!assetId) return;

    const newLayer = (layer === "map" ? "token" : "map")

    setAssets((assets) =>
        assets.map((asset) =>
            asset.id === assetId
            ? { ...asset, layer: newLayer}
            : asset
        )
    )

    setInteractionState((s) => ({ ...s, selected: null }));
  };

  return (
    <>
      <MenuItem
        onClick={() => {
          console.log("Toggling snapToGrid");
          toggleSnapToGrid(assetId, layer);
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
};