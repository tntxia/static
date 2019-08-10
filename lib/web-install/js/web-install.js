(function(globe) {

    var pathName = window.location.pathname.substring(1);
    var webRoot = pathName == '' ? '' : "/" + pathName.substring(0, pathName.indexOf('/'));
    globe.webRoot = webRoot;

    let WebInstall = {
        install(config) {
            let cssList = config.cssList;
            installAllCss(cssList);
            let jsList = config.jsList;
            return installAllJs(jsList);
        }
    }

    function installAllCss(cssList) {
        let head = document.getElementsByTagName('head')[0];
        cssList.forEach(css => {
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = css;
            head.appendChild(link);
        })
    }

    function installAllJs(jsList) {
        let p = new Promise((resolve, reject) => {
            if (!jsList || !jsList.length) {
                resolve();
                return;
            }
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
            node.src = src + "?" + (new Date().getTime());
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
    globe.WebInstall = WebInstall;
})(window);