import supabase from "./supabase-client";

export interface Asset {
    name: string;
    id: string | null;      // null for folders
    created_at: string;
    updated_at: string;
    metadata: Record<string, any>;
    url?: string;           // Optional because we add this manually later
}

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
): Promise<Asset[] | undefined> {
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
    deleteAsset, type AssetFolder,
};