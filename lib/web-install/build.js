let fs = require("fs");
let res = [];
res.push("(function(globe) {");

let src = ["Main", "Leftbar", "LayoutMain"];
src.forEach(s => {
    res.push(fs.readFileSync("src/" + s + ".js"));
});

res.push("})(window);");

fs.writeFileSync("js/web-install.js", res.join("\n"));