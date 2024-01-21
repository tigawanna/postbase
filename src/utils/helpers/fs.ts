import fs from "fs";
import fsp from "fs/promises";
import path from "path";


export async function getTextFromFileWithImports(
  filePath: string,
  currentText: string,
  dbName: string,
) {
  try {
    let count = 0;
    // console.log("===== file path ======",filePath);
    const fileContent = await fsp.readFile(filePath, "utf8");
    // console.log("===== file content ======",fileContent);
    const importRegex = /import.*?from ['"](.+?)['"];/g;
    let match;
    let updatedText = currentText;
    if (count === 0) {
      updatedText += fileContent;
    }

    while ((match = importRegex.exec(fileContent)) !== null) {
      count += 1;
      const importedFilePath = match[1];
      const absoluteImportedPath = path.resolve(filePath);
      // console.log("===== absolute path  ======",absoluteImportedPath);
      const importedFileContent = fs.readFileSync(absoluteImportedPath, "utf8");
      updatedText += "\n" + importedFileContent;
      const next_file_path =
        path.resolve("pg/" +dbName+"/public", importedFilePath) + ".ts";
      // console.log(" ====== next file path  ======",next_file_path);
      updatedText =
        (await getTextFromFileWithImports(next_file_path, updatedText, dbName)) ?? ""; // Make the process recursive
    }
    //  console.log("===== count  ======",count);
    return updatedText;
  } catch (error) {
    console.log("====== error in readTextFromFileWithImport === ", error);
    return;
  }
}
