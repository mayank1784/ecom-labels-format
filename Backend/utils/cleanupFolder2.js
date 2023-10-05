// cleanupFolder2.js
const fs = require('fs');
const path = require('path');

function deleteFilesOlderThan(folderPath, ageInMilliseconds) {
  const files = fs.readdirSync(folderPath);
  const currentTime = new Date().getTime();

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileStat = fs.statSync(filePath);
    const fileAge = currentTime - fileStat.ctimeMs;

    if (fileAge > ageInMilliseconds) {
      fs.unlinkSync(filePath);
      console.log(`Deleted ${filePath}`);
    }
  }
}

module.exports = {
  deleteFilesOlderThan,
};
