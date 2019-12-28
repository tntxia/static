var fs = require("fs");

module.exports = {
    writeFile(filePath, data) {
        mkfilepath(filePath);
        console.log(filePath);
        fs.writeFileSync(filePath, data);
    },
    copy(src, dst) {
        mkfilepath(dst);
        // 创建读取流
        let readable = fs.createReadStream(src);
        // 创建写入流
        let writable = fs.createWriteStream(dst);
        // 通过管道来传输流
        readable.pipe(writable);
    }
}

function mkfilepath(filePath) {
    let sp = filePath.split("/");
    let pathArr = [];
    for (let i = 0; i < sp.length - 1; i++) {
        let seg = [];
        for (let j = 0; j <= i; j++) {
            seg.push(sp[j]);
        }
        pathArr.push(seg.join("/"));
    }
    pathArr.forEach(p => {
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    });
}