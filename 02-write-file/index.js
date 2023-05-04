const fs = require('fs');
const path = require('path');
const { stdin } = process;

const currentPath = path.join(__dirname, 'text.txt');
const ws = fs.createWriteStream(currentPath);

console.log('Привет! Введите данные)');

const goodbay = () => {
  console.log('Запись остановлена. До свидания)');
  ws.end();
  process.exit();
};

process.on('SIGINT', goodbay);

stdin.on('data', (data) => {
  if(data.toString().trim() === 'exit'){
    goodbay();
  }
  ws.write(data);
});