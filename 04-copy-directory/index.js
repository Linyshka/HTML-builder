const fs = require('fs');
const promises = fs.promises;
const path = require('path');

const pathToFiles = path.join(__dirname, 'files');
const pathToCopyFiles = path.join(__dirname, 'files-copy');

function makeDirectory(pathToDirectory){
  fs.mkdir(pathToDirectory, (err) => {
    if(err) {
      console.log(err);
    }
  });
}

fs.access(pathToCopyFiles, (err) => {
  if(err){
    makeDirectory(pathToCopyFiles);
  }
});

async function makeCopyFiles(pathToFolder, pathToCopyFolder){
  await promises.rm(pathToCopyFolder, {force: true, recursive: true});
  await promises.mkdir(pathToCopyFolder, {recursive: true});

  fs.readdir(pathToFolder, (err, files) => {
    if(err) console.log(err);
    else {
      files.forEach((file) => {
        let currentPath = path.join(pathToFolder, file);
        let newPath = path.join(pathToCopyFolder, file);
        fs.stat(currentPath, (err, stats) => {
          if(err) console.log(err);
          else {
            if(stats.isFile()){
              fs.copyFile(currentPath, newPath, err => {
                if(err) console.log(err);
              });
            }
            else {
              makeDirectory(newPath);
              makeCopyFiles(currentPath, newPath);
            }
          }
        });
      });
    }
  });
}

makeCopyFiles(pathToFiles, pathToCopyFiles);