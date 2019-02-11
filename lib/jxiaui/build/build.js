var fs = require('fs');
var fileWriteStream = fs.createWriteStream("test.js");
let fileReadStream = fs.createReadStream("../src/test.js");
fileReadStream.pipe(fileWriteStream,{end:false});