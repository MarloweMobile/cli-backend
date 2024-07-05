const fs = require('fs');
const path = require('path');

function removeSpaces() {

  const directoryPath = '/home/preview/keys/proxiesCopy';
  
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((file) => {
        const oldPath = path.join(directoryPath, file);
        const newFile = file.replace(/\s/g, '');
        const newPath = path.join(directoryPath, newFile);
  
        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`File ${oldPath} renamed to ${newPath}`);
          }
        });
      });
    }
  });


}

module.exports = removeSpaces