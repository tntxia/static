$(function() {
    let webConfig = {
        cssList: ["/static/lib/jxiaui/0.1/css/jxiaui.pagination.css"],
        jsList: ["test2.js", "test3.js"]
    }
    WebInstall.install(webConfig).then(() => {
        console.log("webRoot", webRoot);
        console.log("all js installed");
    });
});