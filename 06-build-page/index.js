const fs = require('fs');
const { promises } = fs;
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');
const projectHtmlPath = path.join(projectPath, 'index.html');
const projectAssetsPath = path.join(projectPath, 'assets');
const projectStylePath = path.join(projectPath, 'style.css');

const templatePath = path.join(__dirname, 'template.html');
const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');

async function makeDirectory(pathToDirectory){
  await promises.mkdir(pathToDirectory, {recursive: true});
}

async function deleteDirectory(pathToDirectory){
  const files = await promises.readdir(pathToDirectory);
  if(files != 0){
    for(let i = 0; i < files.length; i++){
      const currentPath = path.join(pathToDirectory, files[i]);
      fs.stat(currentPath, async (err, stats) => {
        if(err) console.log(err);
        else {
          if(stats.isFile()){
            await promises.rm(currentPath, {force: true, recursive: true});
          }
          else {
            await deleteDirectory(currentPath);
          }
        }
      });
    }
  } else {
    await promises.rm(pathToDirectory, {force: true, recursive: true});
  }
}

async function makeCopyFiles(pathToFolder, pathToCopyFolder){
  await makeDirectory(pathToCopyFolder);
  await deleteDirectory(pathToCopyFolder);
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

async function createHtml(){
  let template = await promises.readFile(templatePath, 'utf-8');
  const files = await promises.readdir(componentsPath);
  for(let i = 0; i < files.length; i++){
    const component = await promises.readFile(path.join(componentsPath, files[i]), 'utf-8');
    template = template.replaceAll(`{{${files[i].split('.')[0]}}}`, component);
  }
  await promises.writeFile(projectHtmlPath, template);
}

async function mergeStyles() {
  const resultArr = [];
  const files = await promises.readdir(stylesPath);
  for(let i = 0; i < files.length; i++) {
    if(files[i].split('.')[1] === 'css'){
      const style = await promises.readFile(path.join(stylesPath, files[i]), 'utf-8');
      resultArr.push(`${style}\n`);
    }
  }
  await promises.writeFile(projectStylePath, resultArr);
}

async function builder(){
  await makeDirectory(projectPath);
  await makeCopyFiles(assetsPath, projectAssetsPath);
  await createHtml();
  await mergeStyles();
}

builder();