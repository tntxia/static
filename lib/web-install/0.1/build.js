let fs = require("fs");

let _ = require("./lib/underscore");
let res = [];
res.push("(function(globe) {");

let src = ["Main", "WebApp", "Leftbar", "LayoutMain"];

src.forEach(s => {
    let content = fs.readFileSync("src/" + s + ".js");
    if (s === "WebApp") {
        let template = fs.readFileSync("src/template.html");
        let tempRenderer = _.template(content.toString());
        content = tempRenderer({
            template: JSON.stringify(template.toString())
        });
    }
    res.push(content);
});

res.push("})(window);");

fs.writeFileSync("js/web-install.js", res.join("\n"));