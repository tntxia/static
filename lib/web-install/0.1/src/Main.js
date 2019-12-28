var pathName = window.location.pathname.substring(1);
var webRoot = pathName == '' ? '' : "/" + pathName.substring(0, pathName.indexOf('/'));
if (webRoot == '/') {
    webRoot = '';
}
globe.webRoot = webRoot;

// 等待文档加载完成
window.addEventListener("load", function() {
    let webApp = new WebApp();
    window.webApp = webApp;
});

function getResourcePath() {
    let scripts = document.querySelectorAll("head>script");
    let res;
    for (let i = 0; i < scripts.length; i++) {
        let script = scripts[i];
        let src = script.src;
        if (src && src.indexOf("web-install") >= 0) {
            let attributes = script.attributes;
            res = getAttrValue(attributes, "resource-path");
        }
    }
    return res;
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

function getJSON(url) {
    let promise = new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("get", url, true, "", "");
        xhr.send(null);
        xhr.onload = function() {
            console.log("status", xhr.status);
            if (xhr.status === 200) {
                let responseText = xhr.responseText;
                resolve(JSON.parse(responseText));
            } else {
                reject(xhr.status);
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
                reject(xhr.status);
            }

        };
    });
    return promise;
}

function Layout() {
    this.leftbarWidth = 110;
    let router = new Router();
    this.router = router;
    window.router = router;
}

Layout.prototype.install = function(opt) {

    // 布局的容器
    let container = opt.container;
    if (!container) {
        container = $(document.body);
    }
    this.width = container.get(0).clientWidth;
    let me = this;
    me.opt = opt;

    let routerConfig = opt.router;
    let mainLayout = $("<div>", {
        'class': 'main-layout'
    });
    container.append(mainLayout);
    me.el = mainLayout;

    // 头部的高度
    let headerHeight = opt.header.height;
    this.headerHeight = headerHeight;
    header.css({
        height: headerHeight
    })
    mainLayout.append(header);

    if (opt.leftbar) {
        let leftbar = new Leftbar(me);
        this.leftbar = leftbar;
    }

    this.main = new LayoutMain(this);

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

    header.load(headerTemplate, () => {
        let headVue = new Vue({
            el: header.get(0),
            data: {
                module: null
            }
        });
        router.onChange(function(moduleName) {
            headVue.module = moduleName;
        });

        if (me.leftbar) {
            me.leftbar.init().then(function() {
                me.registerRouter();
            });
        } else {
            me.registerRouter();
        }

    }, (e) => {
        reject(e);
    });
}

Layout.prototype.registerRouter = function() {

    let layout = this;
    let opt = layout.opt;
    let routerConfig = opt.router;

    let mapping = routerConfig.moduleMapping;
    let mainSec = this.mainSec;
    let router = this.router;

    routerConfig.resourcePath = opt.resourcePath;
    router.setConfig(routerConfig);
    router.register({
        target: mainSec,
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

            if (layout.leftbar) {
                if (leftbarFlag === false) {
                    layout.hideLeftbar();
                    return;
                }
                layout.setLeftbar(type, moduleName);
                layout.showLeftbar();
            }

            webApp.lastGroup = type;
        }
    });
    webApp.router = router;
}

Layout.prototype.append = function(el) {
    this.container.append(el);
}

Layout.prototype.setLeftbar = function(type, moduleName) {
    let me = this;
    let leftbar = this.leftbar;

    // 判断左边菜单是否初始化
    let isLeftbarInit = this.isLeftbarInit;
    // 上次的左侧菜单类型
    let lastType = this.lastLeftbarType;
    if (!isLeftbarInit || lastType != type) {
        this.leftbar.show(type);
        me.selectLeftbar(moduleName);
        me.lastLeftbarType = type;
    } else {
        me.selectLeftbar(moduleName);
    }
}

Layout.prototype.hideLeftbar = function(data) {
    let leftbar = this.leftbar;
    leftbar.hide();
    let mainDiv = this.mainDiv;
    mainDiv.css({
        left: 0,
        width: this.width
    })
}

Layout.prototype.showLeftbar = function(data) {
    let leftbarWidth = this.leftbar.width;
    let mainDiv = this.mainDiv;
    mainDiv.css({
        left: leftbarWidth,
        width: this.width - leftbarWidth
    });
}

Layout.prototype.selectLeftbar = function(route) {
    let leftbar = this.leftbar;
    leftbar.select(route);
}

Layout.prototype.showDialog = function(ref) {
    let dialog = this.dialogVue.$refs[ref];
    dialog.show();
    return dialog;
}