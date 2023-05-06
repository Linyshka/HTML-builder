const fs = require('fs');
const { promises } = fs;
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const resultArr = [];

async function mergeStyles() {
  const files = await promises.readdir(stylesPath);
  for(let i = 0; i < files.length; i++) {
    if(files[i].split('.')[1] === 'css'){
      const style = await promises.readFile(path.join(stylesPath, files[i]), 'utf-8');
      resultArr.push(`${style}\n`);
    }
  }
  await promises.writeFile(bundlePath, resultArr);
}

mergeStyles();