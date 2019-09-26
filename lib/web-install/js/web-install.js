(function(globe) {

    var pathName = window.location.pathname.substring(1);
    var webRoot = pathName == '' ? '' : "/" + pathName.substring(0, pathName.indexOf('/'));
    globe.webRoot = webRoot;

    let WebInstall = {
        install(config) {
            let configUrl = config.configUrl;

            let mainLayout = config.mainLayout;

            let webApp = {};

            let promise = new Promise(function(resolve, reject) {
                window.addEventListener("load", function() {

                    let body = document.body;

                    let installMsgContainer = document.createElement("div");
                    installMsgContainer.className = "install-msg-container";
                    body.appendChild(installMsgContainer);
                    let t1 = new Date();
                    appendMsg(installMsgContainer, "正在加载Web的配置信息。。。")

                    getJSON(configUrl).then(function(res) {
                        let t2 = new Date();
                        appendMsg(installMsgContainer, "加载Web的配置信息完成，用时：" + (t2.getTime() - t1.getTime()));
                        appendMsg(installMsgContainer, "开始加载所有的JS和CSS。。。。");
                        let cssList = res.cssList;
                        let jsList = res.jsList;
                        let components = res.components;
                        let dialogs = res.dialogs;
                        mainLayout.dialogs = dialogs;
                        if (components) {
                            components.map(function(c) {
                                jsList.push(c.url);
                            })
                        }
                        if (dialogs) {
                            dialogs.map(function(c) {
                                jsList.push(c.url);
                            })
                        }
                        installAllCSSAndJS(cssList, jsList).then(function() {
                            let t3 = new Date();
                            appendMsg(installMsgContainer, "加载所有的JS和CSS完成，用时：" + (t3.getTime() - t2.getTime()));
                            if (!mainLayout) {
                                resolve(webApp);
                                installMsgContainer.style.display = "none";
                                return;
                            }
                            installMainLayout(mainLayout, dialogs).then(function(mainLayout) {
                                webApp.mainLayout = mainLayout;
                                installMsgContainer.style.display = "none";
                                resolve(webApp);
                            });
                        });
                    });
                });
            });
            return promise;
        }
    }

    function appendMsg(container, msg) {
        let msgDiv = document.createElement("div");
        msgDiv.innerText = msg;
        container.appendChild(msgDiv);
    }

    function installMainLayout(config) {
        return MainLayoutInstall.install(config);
    }

    function installAllCSSAndJS(cssList, jsList) {
        return new Promise(function(resolve, reject) {
            installAllCss(cssList);
            installAllJs(jsList, resolve, reject);
        });
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

    function installAllJs(jsList, resolve, reject) {
        if (!jsList || !jsList.length) {
            resolve();
            return;
        }
        installJs(jsList, resolve, reject);
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

    function getJSON(url) {
        let promise = new Promise(function(resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("get", url, true, "", "");
            xhr.send(null);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    let responseText = xhr.responseText;
                    resolve(JSON.parse(responseText));
                } else {
                    reject();
                }

            };
        });
        return promise;
    }

    globe.WebInstall = WebInstall;
})(window);