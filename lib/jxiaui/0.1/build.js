var fs = require("fs");

fs.readFile("package.json", "utf8", (err, content) => {
    let obj = JSON.parse(content);
    console.log("obj", obj);

    let distFile = obj.dist.file;

    let res = [];
    res.push("(function(globe){");
    res.push('if (!globe.Vue) {console.warn("可能你还没导入Vue的引用。。。");}');
    res.push("if(arguments.length<2) {console.warn('参数不对');return;}");
    res.push("for(let i=1;i<arguments.length;i++){");
    res.push("Vue.component(arguments[i].name, arguments[i]);")
    res.push("}")
    res.push("})(window, ");

    let components = obj.components;
    components.forEach(c => {
        res.push("\n(()=>{let module = {};");
        let optionsjsFile = c.options;
        let options = fs.readFileSync(optionsjsFile);
        res.push(options);
        let templateFile = c.template;
        if (templateFile) {
            let template = fs.readFileSync(templateFile);
            res.push('module.exports.template = ' + JSON.stringify(template.toString()));
        }
        res.push("return module.exports;})(), \n");
    });

    res.push(")\n");

    fs.writeFile(distFile, res.join("\n"), err => {
        if (err) {
            console.error(e);
            return;
        }
        console.log("构建完成");
    });

});

/** fs.readFile("test.html", "utf8", (err, content) => {

    let opt = {
        template: content
    };
    console.log(content);

    let res = "Vue.component('app', " + JSON.stringify(opt) + ")";

    fs.writeFile("app.js", res, (err) => {

        console.log("生成文件完成");
    })
});

console.log("hello, node js "); */