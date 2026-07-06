import { rejects } from "assert";
import fs from "fs";
import path from "path";

export default function writeJSONL(
    records: object[],
    outputPath: string
): Promise<string> {
    return new Promise(
        (
            resolve,
            reject
        ): void => {
            const dir =
                path.dirname(
                    outputPath
                );

            fs.mkdirSync(dir, {
                recursive: true,
            });

            const stream =
                fs.createWriteStream(
                    outputPath,
                    {
                        flags: "w",
                    }
                );

            stream.on(
                "error",
                reject
            );

            for (const record of records) {
                const line =
                    JSON.stringify(
                        record
                    );

                stream.write(
                    line + "\n"
                );
            }

            stream.end(() =>
                resolve(
                    outputPath
                )
            );
        }
    );
}