$(function() {
    let jsList = ["test2.js", "test3.js"];
    JsInstall.install(jsList).then(() => {
        console.log("all js installed");
    });
});