import supabase from "./supabase-client";

//type = "maps" || "tokens" || "articleImages"

async function uploadAsset(file, folder, userId) {
  const path = `${folder}/${userId}/${file.name}`;

  const { error } = await supabase.storage
    .from("realm-assets")
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error(error);
    return;
  }

  return path;
}

async function listAssets(folder, userId) {
  const { data, error } = await supabase.storage
    .from("realm-assets")
    .list(`${folder}/${userId}`, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

async function getURL(folder, fileName, userId) {
    const { data, error } = await supabase.storage
        .from("realm-assets")
        // .createSignedUrl(`${folder}/${userId}/${fileName}`, 60 * 60)
        .getPublicUrl(`${folder}/${userId}/${fileName}`);

    if (error) throw error;
    // return data.signedUrl;
    return data.publicUrl;
}

function isRealAsset(file) {
  return !file.name.startsWith(".emptyFolderPlaceholder");
}

async function deleteAsset(folder, fileName, userId) {
  const path = `${folder}/${userId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from("realm-assets")
    .remove([path]);

  if (error) {
    console.error(error);
  } else {
    console.warn("Deleting asset ", fileName);
  }
}


export { uploadAsset, listAssets, getURL, isRealAsset, deleteAsset };