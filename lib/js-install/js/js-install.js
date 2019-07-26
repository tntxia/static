(function(globe) {
    let JsInstall = {
        install(jsList) {
            return installAllJs(jsList);
        }
    }

    function installAllJs(jsList) {
        let p = new Promise((resolve, reject) => {
            installJs(jsList, resolve, reject);
        });
        return p;
    }

    function installJs(jsList, resolve, reject) {
        if (!jsList.length) {
            resolve();
            return;
        }
        let js = jsList.splice(0, 1);
        let promise = installJsNode(js);
        promise.then(() => {
            installJs(jsList, resolve, reject);
        }, e => {
            reject(e);
        });
        return promise;
    }

    function installJsNode(src) {

        let p = new Promise((resolve, reject) => {
            var node = document.createElement('script');
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;
            node.src = src;
            node.addEventListener('load', function() {
                resolve();
            }, false);
            node.addEventListener('error', function(e) {
                reject(e);
            }, false);
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(node);
        });
        return p;
    }
    globe.JsInstall = JsInstall;
})(window);