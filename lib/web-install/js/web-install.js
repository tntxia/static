(function(globe) {

    var pathName = window.location.pathname.substring(1);
    var webRoot = pathName == '' ? '' : "/" + pathName.substring(0, pathName.indexOf('/'));
    if (webRoot == '/') {
        webRoot = '';
    }
    globe.webRoot = webRoot;

    let webApp = {};

    window.webApp = webApp;

    let installMsgContainer;
    let initJs;
    let lastGroup;
    let routerConfig;
    let layoutConfig;
    let resourcePath;

    window.addEventListener("load", function() {

        let scripts = document.querySelectorAll("head>script");

        for (let i = 0; i < scripts.length; i++) {
            let script = scripts[i];
            let src = script.src;
            if (src && src.indexOf("web-install") >= 0) {
                let attributes = script.attributes;
                resourcePath = getAttrValue(attributes, "resource-path");
            }
        }
        let configUrl = resourcePath + "/json/webConfig.json";
        initJs = resourcePath + "/js/init.js";
        console.log(configUrl, initJs);
        let body = document.body;
        installMsgContainer = document.createElement("div");
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
            let version = res.version;
            let title = res.title;
            if (title) {
                document.title = title;
            }
            webApp.moduleMapping = res.moduleMapping;
            let layout = res.layout;
            layoutConfig = res.layout;
            layout.dialogs = dialogs;
            routerConfig = res.router;
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
            installAllCSSAndJS(cssList, jsList, version).then(function() {
                let t3 = new Date();
                appendMsg(installMsgContainer, "加载所有的JS和CSS完成，用时：" + (t3.getTime() - t2.getTime()));
                if (!layout) {
                    executeInitJs(webApp, initJs);
                    installMsgContainer.style.display = "none";
                    return;
                }
                installLayout(layout, dialogs)
            });
        });

    });

    function executeInitJs(webApp, initJs) {
        http(initJs).then(function(res) {
            try {
                eval("(function(webApp) {" + res + "})(webApp)");
            } catch (e) {
                console.error(e);
            }

        })
    }

    function getAttrValue(attrs, key) {
        for (let i = 0; i < attrs.length; i++) {
            let attr = attrs[i];
            let name = attr.name;
            if (key === name) {
                return attr.nodeValue;
            }
        }
    }

    function appendMsg(container, msg) {
        let msgDiv = document.createElement("div");
        msgDiv.innerText = msg;
        container.appendChild(msgDiv);
    }

    function installLayout(config) {
        return new Promise(function(resolve, reject) {
            return LayoutInstall.install(config).then(function(layout) {
                webApp.layout = layout;
                let mapping = webApp.moduleMapping;
                installMsgContainer.style.display = "none";
                let mainSec = layout.mainSec;
                if (routerConfig && routerConfig.defaultModule) {
                    router.setDefaultModule(routerConfig.defaultModule);
                }
                router.register({
                    target: mainSec,
                    resourcePath: resourcePath,
                    mapping: mapping,
                    onChange(moduleName) {
                        let module;
                        if (mapping) {
                            module = mapping[moduleName];
                        }
                        if (!module) {
                            module = window.modules[moduleName];
                        }
                        let leftbarFlag = module.leftbar;
                        let type;
                        if (moduleName.indexOf("/") >= 0) {
                            type = moduleName.split("/")[0];
                        } else {
                            type = moduleName.split("_")[0];
                        }

                        if (leftbarFlag === false) {
                            layout.hideLeftbar();
                            return;
                        }

                        layout.setLeftbar(type, moduleName);

                        layout.showLeftbar();
                        if (type === lastGroup) {
                            $(".leftbar li").removeClass("selected");
                            $(".leftbar li").each(function() {
                                let href = $(this).find("a").attr("href");
                                if (href.endsWith(moduleName)) {
                                    $(this).addClass("selected");
                                }
                            });
                            return;
                        }
                        lastGroup = type;
                        let leftbar = $(".leftbar");
                        leftbar.empty();
                    }
                });
                executeInitJs(webApp, initJs);
            })
        })

    }

    function installAllCSSAndJS(cssList, jsList, version) {
        return new Promise(function(resolve, reject) {
            installAllCss(cssList);
            installAllJs(jsList, version, resolve, reject);
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

    function installJs(jsList, version, resolve, reject) {
        if (!jsList.length) {
            resolve();
            return;
        }
        let js = jsList.splice(0, 1);
        let promise = installJsNode(js, version);
        promise.then(() => {
            installJs(jsList, version, resolve, reject);
        }, e => {
            reject(e);
        });
        return promise;
    }

    function installJsNode(src, version) {

        let p = new Promise((resolve, reject) => {
            var node = document.createElement('script');
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;
            node.src = src + "?" + version;
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

    function http(url) {
        let promise = new Promise(function(resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("get", url, true, "", "");
            xhr.send(null);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    let responseText = xhr.responseText;
                    resolve(responseText);
                } else {
                    reject();
                }

            };
        });
        return promise;
    }

    let LayoutInstall = {
        install(opt) {
            let p = new Promise((resolve, reject) => {
                // 布局的容器
                let container = opt.container;
                if (!container) {
                    container = $(document.body);
                }
                let layout = new Layout(container);
                layout.install(opt).then((layout) => {
                    layout.setLeftbar();
                    resolve(layout);
                });
            });
            return p;
        }
    }

    function Layout(container) {
        this.container = container;
        this.width = container.get(0).clientWidth;
        this.leftbarWidth = 110;
    }

    Layout.prototype.install = function(opt) {
        let me = this;
        let container = this.container;
        let mainLayout = $("<div>", {
            'class': 'main-layout'
        });
        container.append(mainLayout);
        let containerHeight = container.height();
        let leftbarOpt = opt.leftbar;
        let leftbarWidth = 110;
        if (leftbarOpt && leftbarOpt.width) {
            leftbarWidth = leftbarOpt.width;
        }

        let mainSecWidth = this.width - leftbarWidth;
        this.mainSecWidth = mainSecWidth;
        let headerTemplate = opt.header.template;
        // 头部的高度
        let headerHeight = opt.header.height;
        let header = $("<div>", {
            'class': 'main-layout-header'
        });
        header.css({
            height: headerHeight
        })
        mainLayout.append(header);
        let leftbar = $("<div>", {
            'class': 'leftbar'
        });
        leftbar.css({
            top: headerHeight,
            width: leftbarWidth
        });
        this.leftbar = leftbar;

        let mainHeight = containerHeight - headerHeight;

        mainLayout.append(leftbar);
        let mainSection = $("<div>", {
            'class': 'main_sec'
        });
        this.mainSec = mainSection;
        mainSection.css({
            left: leftbarWidth,
            top: headerHeight,
            width: mainSecWidth
        });
        mainLayout.append(mainSection);

        let dialogsDiv = $("<div>", {
            id: 'dialogsDiv'
        });
        this.dialogsDiv = dialogsDiv;
        dialogsDiv.css({
            position: 'relative',
            'z-index': 10000
        })
        mainLayout.append(dialogsDiv);

        let dialogs = opt.dialogs;
        if (dialogs) {
            dialogs.forEach(comp => {
                let compEl = $("<" + comp.name + ">");
                compEl.attr("ref", comp.ref);
                dialogsDiv.append(compEl);
            });
        }

        this.dialogVue = new Vue({
            el: dialogsDiv.get(0),
            methods: {
                getDialog(name) {
                    return this.$refs[name];
                }
            }
        })

        let p = new Promise((resolve, reject) => {
            header.load(headerTemplate, () => {
                resolve(me);
            }, (e) => {
                reject(e);
            });
        })
        return p;
    }

    Layout.prototype.append = function(el) {
        this.container.append(el);
    }

    Layout.prototype.initLeftbar = function(type) {
        let me = this;
        let leftbar = this.leftbar;
        let url = 'leftbar.do';
        if (layoutConfig.leftbar && layoutConfig.leftbar.url) {
            url = layoutConfig.leftbar.url;
        }
        let promise = new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                cache: false,
                data: {
                    type: type
                }
            }).done(data => {
                data.forEach(item => {
                    let buttons = item.buttons;
                    buttons.forEach(button => {
                        button.selected = false;
                    })
                });
                let leftbarItems = leftbar.find(".leftbar-item");
                leftbarItems.each(function(i) {
                    let item = $(this);
                    if (i >= data.length) {
                        item.remove();
                        return;
                    }
                    let header = item.find(".leftbar-header");
                    let dataItem = data[i];
                    header.text(dataItem.text);
                    let buttons = item.find(".leftbar-list li");
                    let buttonsData = dataItem.buttons;
                    buttons.each(function(i) {
                        let d = buttonsData[i];
                        let li = $(this);
                        if (d.selected) {
                            li.addClass("selected");
                        } else {
                            li.removeClass("selected");
                        }
                        let a = li.find("a");
                        a.attr("href", d.url);
                        a.attr("target", d.target);
                        a.text(d.text);
                    });
                });
                let enter = data.slice(leftbarItems.length, data.length);
                enter.forEach(d => {
                    let item = $("<div>", {
                        'class': 'leftbar-item'
                    });
                    let head = $("<div>", {
                        'class': 'leftbar-header',
                        text: d.text
                    })
                    item.append(head);
                    let list = $("<ul>", {
                        'class': 'leftbar-list'
                    });
                    item.append(list);
                    let buttons = d.buttons;
                    if (buttons) {
                        buttons.forEach(but => {
                            let li = $("<li>");
                            if (but.selected) {
                                li.addClass("selected");
                            }
                            list.append(li);
                            let a = $("<a>", {
                                href: but.url,
                                text: but.text,
                                target: but.target
                            });
                            li.append(a);
                        });
                    }

                    leftbar.append(item);
                });
                resolve();
            })
        });
        return promise;
    }

    Layout.prototype.setLeftbar = function(type, moduleName) {
        let me = this;
        let leftbar = this.leftbar;

        // 判断左边菜单是否初始化
        let isLeftbarInit = this.isLeftbarInit;
        // 上次的左侧菜单类型
        let lastType = this.lastLeftbarType;
        if (!isLeftbarInit || lastType != type) {
            this.initLeftbar(type).then(function() {
                me.selectLeftbar(moduleName);
                me.lastLeftbarType = type;
            });
        } else {
            me.selectLeftbar(moduleName);
        }

    }

    Layout.prototype.hideLeftbar = function(data) {
        let leftbar = this.leftbar;
        leftbar.hide();
        let mainSec = this.mainSec;
        mainSec.css({
            left: 0,
            width: this.width
        })
    }

    Layout.prototype.showLeftbar = function(data) {
        let leftbarWidth = this.leftbarWidth;
        let leftbar = this.leftbar;
        leftbar.show();
        let mainSec = this.mainSec;
        mainSec.css({
            left: leftbarWidth,
            width: this.width - this.leftbarWidth
        });
    }

    Layout.prototype.selectLeftbar = function(route) {
        let leftbar = this.leftbar;
        let liList = leftbar.find("li");
        liList.removeClass("selected");
        liList.each(function() {
            let href = $(this).find("a").attr("href");
            if (href.endsWith(route)) {
                $(this).addClass("selected");
            }
        });
    }

    Layout.prototype.showDialog = function(ref) {
        let dialog = this.dialogVue.$refs[ref];
        dialog.show();
        return dialog;
    }

})(window);