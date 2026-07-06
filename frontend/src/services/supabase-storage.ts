import supabase from "./supabase-client";

type AssetFolder =
    | "maps"
    | "tokens"
    | "articleImages";

async function uploadAsset(
    file: File,
    folder: AssetFolder,
    userId: string
): Promise<string | undefined> {
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

async function listAssets(
    folder: AssetFolder,
    userId: string
): Promise<unknown[] | undefined> {
    const { data, error } = await supabase.storage
        .from("realm-assets")
        .list(`${folder}/${userId}`, {
            limit: 100,
            sortBy: {
                column: "created_at",
                order: "desc",
            },
        });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

async function getURL(
    folder: AssetFolder,
    fileName: string,
    userId: string
): Promise<string> {
    const { data } = await supabase.storage
        .from("realm-assets")
        // .createSignedUrl(`${folder}/${userId}/${fileName}`, 60 * 60)
        .getPublicUrl(
            `${folder}/${userId}/${fileName}`
        );

    // return data.signedUrl;
    return data.publicUrl;
}

function isRealAsset(file: { name: string }): boolean {
    return !file.name.startsWith(
        ".emptyFolderPlaceholder"
    );
}

async function deleteAsset(
    folder: AssetFolder,
    fileName: string,
    userId: string
): Promise<void> {
    const path = `${folder}/${userId}/${fileName}`;

    const { error } = await supabase.storage
        .from("realm-assets")
        .remove([path]);

    if (error) {
        console.error(error);
    } else {
        console.warn(
            "Deleting asset ",
            fileName
        );
    }
}

export {
    uploadAsset,
    listAssets,
    getURL,
    isRealAsset,
    deleteAsset,
};