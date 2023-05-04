const fs = require('fs');
const path = require('path');

const currentPath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(currentPath, 'utf-8');
let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => console.log(data));