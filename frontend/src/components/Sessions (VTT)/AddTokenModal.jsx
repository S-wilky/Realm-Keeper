import { useEffect, useState, useRef, useCallback } from "react";
import RK_Button from "../RK_Button";
import { getURL, listAssets, uploadAsset, isRealAsset } from "../../services/supabase-storage";

export default function AddMapImageModal({ onClose, onAddToken, userId }) {
  const [assets, setAssets] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  
  const loadAssets = useCallback(async () => {
    const files = ((await listAssets("tokens", userId))).filter(isRealAsset);   //inline: files.filter(file => !file.name.startsWith(".emptyFolderPlaceholder"))

    const withUrls = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await getURL("tokens", file.name, userId),
      }))
    );

    setAssets(withUrls);
  }, [userId]);

  useEffect(() => {

    console.log("Loading assets.");
    loadAssets();
  }, [loadAssets]);


  function handleAdd() {
    if (!selectedUrl) return;

    onAddToken({
      id: crypto.randomUUID(),
      src: selectedUrl,
      //"/src/assets/IndoorBattlemap.jpg",
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      layer: "token",
      snapToGrid: true,
    });

    onClose();
  }
      
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-abbey p-6 rounded w-250 h-150 text-white flex flex-col gap-2">
        
        <h2 className="mb-4">Tokens</h2>

        <div className="grid grid-cols-4 gap-2 w-full min-h-115 overflow-x-none overflow-y-auto outline-1 outline-pearl-river">
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
                console.log("File: ", file);
                const url = await uploadAsset(file, "tokens", userId);
                console.log("URL: ", url);
                setSelectedUrl(url);

                // refresh asset list so it appears immediately
                loadAssets();
                setUploading(false);
              }}
            />
            <RK_Button onClick={() => fileInputRef.current?.click()} disabled={uploading} >
              {uploading ? "Uploading..." : "Upload Image"}
            </RK_Button>

            <RK_Button onClick={handleAdd} disabled={!selectedUrl}>
              Add Token to Stage
            </RK_Button>

            {/* <RK_Button type="danger" onClick={deleteAsset} disabled={!selectedUrl}>
              Delete
            </RK_Button> */}

            <RK_Button type="accent" onClick={onClose} >
              Cancel
            </RK_Button>
        </div>
      </div>
    </div>
  );
}











// import RK_Button from "../RK_Button";

// export default function AddTokenModal({ onClose, onAddToken }) {
//   function handleAdd() {
//     onAddToken({
//       id: crypto.randomUUID(),
//       src: "/src/assets/ThistleToken.png",
//       x: 0,
//       y: 0,
//       width: 50,
//       height: 50,
//       layer: "token",
//       snapToGrid: true,
//     });
//   }
      
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//       <div className="bg-zinc-800 p-6 rounded w-70 text-white">
//         <h2 className="mb-4">Add Token</h2>

//         <div className="gap-2 flex">
//             <RK_Button
//             onClick={handleAdd}
//             >
//             Add Token
//             </RK_Button>

//             <RK_Button
//                 type="accent"
//                 onClick={onClose}
//             >
//             Cancel
//             </RK_Button>
//         </div>
//       </div>
//     </div>
//   );
// }
