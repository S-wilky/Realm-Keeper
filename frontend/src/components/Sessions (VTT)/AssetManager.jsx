import { useEffect, useState, useRef } from "react";
import RK_Button from "../RK_Button";
import { getURL, listAssets, uploadAsset, isRealAsset } from "../../services/supabase-storage";

export default function AssetManager({ onAddAsset, userId, selectedLayer }) {
    const [assets, setAssets] = useState([]);
    const [selectedUrl, setSelectedUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        async function loadAssets() {
        const files = ((await listAssets("assets", userId))).filter(isRealAsset);   //inline: files.filter(file => !file.name.startsWith(".emptyFolderPlaceholder"))

        const withUrls = await Promise.all(
            files.map(async (file) => ({
            ...file,
            url: await getURL("assets", file.name, userId),
            }))
        );

        setAssets(withUrls);
        }

        loadAssets();
    }, [userId]);


    function handleAdd() {
        if (!selectedUrl) return;

        onAddAsset({
        id: crypto.randomUUID(),
        src: selectedUrl,
        //"/src/assets/IndoorBattlemap.jpg",
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        layer: selectedLayer,
        snapToGrid: true,
        });

        setSelectedUrl(null);
    }


    return (
        <div className="rounded text-white flex flex-col gap-1 w-full">
            
            <div>
                <RK_Button onClick={() => fileInputRef.current?.click()} disabled={uploading} >
                {uploading ? "Uploading..." : "Upload Image"}
                </RK_Button>

                <RK_Button onClick={handleAdd} disabled={!selectedUrl}>
                Add Map to Stage
                </RK_Button>
            </div>

            {/* <RK_Button type="accent" onClick={onClose} >
            Cancel
            </RK_Button> */}
            
            <h2 className="">Map Images</h2>

            <div className="grid grid-cols-6 gap-2 w-full min-h-115 overflow-x-none overflow-y-auto outline-1 outline-pearl-river">
            {assets.map( (file) => {
                return (
                // <>
                // <p>{file.name}</p>
                <img
                    key={file.name}
                    src={file.url}
                    className={`aspect-video object-cover cursor-pointer rounded border-2
                    ${selectedUrl === file.url ? "border-blue-500" : "border-transparent"}`
                    }
                    onClick={() => setSelectedUrl(file.url)}
                />
                // </>
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

                    setUploading(true);
                    const url = await uploadAsset(file, "maps", userId);
                    setSelectedUrl(url);

                    // refresh asset list so it appears immediately
                    const updatedAssets = await listAssets("maps", userId);
                    setAssets(updatedAssets);

                    setUploading(false);
                }}
                />
            </div>
        </div>
    );
}