import fs from "fs";
import path from "path";

/**
 * Writes an array of JS objects to a JSONL file using a write stream.
 * @param {Array<object>} records - The rows you want to export
 * @param {string} outputPath - Path to the JSONL file
 */
export default function writeJSONL(records, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);

    // Ensure directory exists
    fs.mkdirSync(dir, { recursive: true });

    const stream = fs.createWriteStream(outputPath, { flags: "w" });

    stream.on("error", reject);

    for (const record of records) {
      const line = JSON.stringify(record);
      stream.write(line + "\n");
    }

    stream.end(() => resolve(outputPath));
  });
}
