// cleanupFolder1.js
const fs = require("fs");
const path = require("path");

function deleteFilesOlderThan(folderPath, ageInMilliseconds) {
  try {
    const files = fs.readdirSync(folderPath);
    const currentTime = new Date().getTime();

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileStat = fs.statSync(filePath);
      const fileAge = currentTime - fileStat.ctimeMs;

      if (fileAge > ageInMilliseconds) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted ${filePath}`);
        } catch (deleteErr) {
          console.error(`Error deleting ${filePath}:`, deleteErr);
        }
      }
    }
  } catch (readDirErr) {
    console.error("Error reading directory:", readDirErr);
  }
}

module.exports = {
  deleteFilesOlderThan,
};
