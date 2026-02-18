import { useEffect, useState, useRef, useCallback } from "react";
import RK_Button from "../RK_Button";
import { getURL, listAssets, uploadAsset, isRealAsset, deleteAsset } from "../../services/supabase-storage";

export default function AddAssetModal({ onClose, onAddImage, userId, interactionState }) {
  const [assets, setAssets] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const loadAssets = useCallback(async () => {
      const files = ((await listAssets("assets", userId))).filter(isRealAsset);   //inline: files.filter(file => !file.name.startsWith(".emptyFolderPlaceholder"))

      const withUrls = await Promise.all(
        files.map(async (file) => ({
          ...file,
          url: await getURL("assets", file.name, userId),
        }))
      );

      setAssets(withUrls);
  }, [userId]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets, assets]);


  function handleAdd() {
    if (!selectedUrl) return;

    onAddImage({
      id: crypto.randomUUID(),
      src: selectedUrl,
      //"/src/assets/IndoorBattlemap.jpg",
      x: 0,
      y: 0,
      width: interactionState.activeLayer === "map" ? 800 : 50,
      height: interactionState.activeLayer === "map" ? 600 : 50,
      layer: interactionState.activeLayer,
      snapToGrid: true,
    });

    onClose();
  }

  async function handleDelete() {
    if (!selectedUrl) return;
    // console.log(selectedUrl);

    const selectedFile = assets.filter(a => a.url == selectedUrl)[0]
    // console.log(selectedFile);
    // console.log("assets", userId, selectedFile.name);
    await deleteAsset("assets", selectedFile.name, userId);
    refreshAssets();
  }

  async function refreshAssets() {
    
    // refresh asset list so it appears immediately
    const updatedAssets = await ((await listAssets("assets", userId))).filter(isRealAsset);
    // console.log(updatedAssets);
    setAssets(updatedAssets);
  }
      
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setSelectedUrl(null)}
    >
      <div className="bg-abbey p-6 rounded w-250 h-150 text-white flex flex-col gap-2">
        
        <h2 className="mb-4">Map Images</h2>

        <div className="grid grid-cols-4 gap-2 w-full h-full overflow-x-none overflow-y-auto outline-1 outline-pearl-river"
        >
          {assets.map( (file) => {
            return (
                // <div >
                    <img
                        key={file.name}
                        src={file.url}
                        className={`cursor-pointer border-2
                        ${selectedUrl === file.url ? "border-blue-500" : "border-transparent"}`
                        }
                            //aspect-video object-cover cursor-pointer rounded border-2
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUrl(file.url);
                        }}
                    />
            //   </div>
            );
          })}
        </div>


        <div className="gap-2 flex">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                // console.log(file);

                setUploading(true);
                const url = await uploadAsset(file, "assets", userId);
                // console.log(url);
                setSelectedUrl(url);

                refreshAssets();

                setSelectedUrl(null);
                setUploading(false);
              }}
            />
            <RK_Button onClick={() => fileInputRef.current?.click()} disabled={uploading} >
              {uploading ? "Uploading..." : "Upload Image"}
            </RK_Button>

            <RK_Button onClick={handleAdd} disabled={!selectedUrl}>
              Add Asset to Stage
            </RK_Button>

            <RK_Button onClick={handleDelete} disabled={!selectedUrl}>
              Delete Asset
            </RK_Button>

            <RK_Button type="accent" onClick={onClose} >
              Cancel
            </RK_Button>
        </div>
      </div>
    </div>
  );
}
